import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import SoundPlayer from 'react-native-sound-player';

const WorkoutTimer = ({
  durationInSeconds,
  isPaused,
  onTimerEnd,
  onTimerTick,
  ACTIVITY_TYPE
}: any) => {
  const [seconds, setSeconds] = useState(durationInSeconds);
  const intervalRef = useRef(null);
console.log('ACTIVITY_TYPE', ACTIVITY_TYPE);
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = BackgroundTimer.setInterval(() => {
        setSeconds((prevSeconds: number) => {
          if (prevSeconds > 0) {
            if (onTimerTick) {
              onTimerTick(prevSeconds - 1);
            }
            if (prevSeconds === 5) {
              onTimerEnd();
              // try {
              //   SoundPlayer.playAsset(
              //     require('../../assets/sounds/countdown1_3.mp3'),
              //   );
              // } catch (error) {
              //   console.log('Cannot play the sound file', error);
              // }
            }
            return prevSeconds - 1;
          } else {
            BackgroundTimer.clearInterval(intervalRef.current);
            if (onTimerEnd) {
              onTimerEnd();
            }
            return 0;
          }
        });
      }, 1000);
    } else {
      BackgroundTimer.clearInterval(intervalRef.current);
    }
    return () => BackgroundTimer.clearInterval(intervalRef.current);
  }, [isPaused]);

  useEffect(() => {
    setSeconds(durationInSeconds);
  }, [durationInSeconds]);

  const formatTime = (time: any) => {
    if (time >= 3600) {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const remainingSeconds = time % 60;
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
        remainingSeconds < 10 ? '0' : ''
      }${remainingSeconds}`;
    } else if (time >= 60) {
      const minutes = Math.floor(time / 60);
      const remainingSeconds = time % 60;
      return `${minutes}:${
        remainingSeconds < 10 ? '0' : ''
      }${remainingSeconds}`;
    } else {
      return `${time}`;
    }
  };

  return (
    <View style={styles.container}>
      {ACTIVITY_TYPE!="P"&&<Text style={styles.timerText}>{formatTime(seconds)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
});

export default WorkoutTimer;
