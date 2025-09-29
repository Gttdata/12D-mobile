import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
// @ts-ignore
import Video, { OnProgressData } from "react-native-video";
import LottieView from "lottie-react-native";
import Shimmer from "react-native-shimmer";
import { BASE_URL, useSelector } from "../../Modules";
import { Icon } from "../../Components";

export interface VideoSectionProps {
  animationVideoData: { VIDEO_URL?: string };
  animationVideoTime: { startTime: number; endTime: number };
  unlockVideo: { lock: boolean; showUnlockPopUp: boolean };
  setUnlockVideo: React.Dispatch<
    React.SetStateAction<{
      lock: boolean;
      showUnlockPopUp: boolean;
      openWarnPopUp: boolean;
      disableRewardIcon: boolean;
    }>
  >;
  videoPaused: boolean;
  setVideoPaused: (paused: boolean) => void;
}

const CustomVideoPlayer: React.FC<VideoSectionProps> = ({
  animationVideoData,
  animationVideoTime,
  unlockVideo,
  setUnlockVideo,
  videoPaused,
  setVideoPaused,
}) => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const videoRef = useRef<Video>(null);
  const skipAutoPause = useRef(false);
  const [videoLoad, setVideoLoad] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const onProgress = (e: OnProgressData) => {
    setCurrentTime(e.currentTime);
    // ignore one tick if just seeking backward
    if (skipAutoPause.current) {
      skipAutoPause.current = false;
      return;
    }
    // auto-pause only when playing past the startTime
    if (!videoPaused && e.currentTime >= animationVideoTime.startTime) {
      videoRef.current?.seek(animationVideoTime.startTime);
      setVideoPaused(true);
    }
  };

  const seekTo = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };
  const handleBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    skipAutoPause.current = true;
    seekTo(newTime);
    setVideoPaused(false);
  };
  const handleForward = () => {
    if (!videoPaused) {
      const newTime = currentTime + 10;
      seekTo(newTime);
    }
  };
  const handlePlayPause = () => {
    if (unlockVideo.lock) return;
    setVideoPaused((p: any) => !p);
  };

  return (
    <View
      style={{
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <View style={{ width: "100%", height: "100%", position: "relative" }}>
        <Video
          
          loading={videoLoad}
          controls={false}
          ref={videoRef}
          source={
            animationVideoData.VIDEO_URL
              ? {
                  uri: `${BASE_URL}static/animationVideo/${animationVideoData.VIDEO_URL}`,
                }
              : require("../../../assets/video/Nature.mp4")
          }
          style={{ width: "100%", height: "100%", zIndex: 1 }}
          resizeMode="cover"
          paused={unlockVideo.lock || videoPaused}
          onLoad={() => setVideoLoad(false)}
          onProgress={onProgress}
          onSeek={(d: any) => {
            // maintain clamp logic if user scrubs
            if (d.currentTime >= animationVideoTime.startTime) {
              videoRef.current?.seek(animationVideoTime.startTime);
              setVideoPaused(true);
            }
          }}
        />
        {!videoLoad && unlockVideo.lock && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              setUnlockVideo({ ...unlockVideo, showUnlockPopUp: true })
            }
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                source={require("../../../assets/LottieAnimation/rewardLock.json")}
                autoPlay
                loop
                style={{ width: 70, height: 70 }}
              />
            </View>
          </TouchableOpacity>
        )}
        {videoLoad && (
          <Shimmer
            duration={2000}
            pauseDuration={1000}
            animationOpacity={0.9}
            opacity={0.5}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: Sizes.Base,
              shadowColor: Colors.Primary2,
              backgroundColor: Colors.Secondary,
            }}
          >
            <View
              style={{
                height: 150,
                width: "100%",
                backgroundColor: Colors.Secondary,
              }}
            >
              <Text />
            </View>
          </Shimmer>
        )}
        {!videoLoad && (
          <View
            style={{
              position: "absolute",
              bottom: 15,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              zIndex: 3,
            }}
          >
            <TouchableOpacity
              onPress={handleBackward}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                type="MaterialIcons"
                name="replay-10"
                size={36}
                color="#FFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePlayPause}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                type="MaterialIcons"
                name={videoPaused ? "play-arrow" : "pause"}
                size={36}
                color="#FFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleForward}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                type="MaterialIcons"
                name="forward-10"
                size={36}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomVideoPlayer;
