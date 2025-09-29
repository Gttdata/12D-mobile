import React, {useEffect, useRef, useState} from 'react';
import {
  Canvas,
  DataSourceParam,
  Group,
  Image,
  Mask,
  Path,
  Rect,
  Skia,
} from '@shopify/react-native-skia';
import {StyleProp, View, ViewStyle, StyleSheet} from 'react-native';
import {svgPathProperties} from 'svg-path-properties';

type Props = {
  style: ViewStyle;
  ChildrenStyle?: ViewStyle;
  image: DataSourceParam;
  children: React.ReactNode;
  STORK_WIDTH?: number;
  OnScratched: () => void;
  setShowRewardImage: any;
};
export const ScratchCard: React.FC<Props> = ({
  style,
  children,
  image,
  ChildrenStyle,
  STORK_WIDTH = 50,
  OnScratched,
  setShowRewardImage,
}) => {
  const [[width, height], setSize] = useState([0, 0]);
  const path = useRef(Skia.Path.Make());
  const STROKE_WIDTH = 45;

  useEffect(() => {
    setTimeout(() => {
      setShowRewardImage(true);
    }, 200);
  }, []);

  const handleTouchEnd = ({nativeEvent}: {nativeEvent: any}) => {
    const pathProperties = new svgPathProperties(path.current.toSVGString());
    const pathArea = pathProperties.getTotalLength() * STROKE_WIDTH;
    const areaScratched = (pathArea / (width * height)) * 100;
    if (areaScratched > 70) {
      OnScratched();
      // console.log('More than 70% scratched');
    }
  };
  return (
    <View
      onLayout={e => {
        setSize([e.nativeEvent.layout.width, e.nativeEvent.layout.height]);
      }}
      style={{
        position: 'relative',
        width: 150,
        height: 200,
        overflow: 'hidden',
        ...style,
      }}>
      {Boolean(image && width && height) && (
        <>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 100,
              height: 200,
              ...ChildrenStyle,
            }}>
            {children}
          </View>
          <Canvas
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 100,
              height: 200,
              ...ChildrenStyle,
            }}
            onTouchStart={({nativeEvent}) => {
              path.current.moveTo(nativeEvent.locationX, nativeEvent.locationY);
            }}
            onTouchMove={({nativeEvent}) => {
              path.current.lineTo(nativeEvent.locationX, nativeEvent.locationY);
            }}
            onTouchEnd={handleTouchEnd}>
            <Mask
              mode="luminance"
              mask={
                <Group>
                  <Rect x={0} y={0} width={1000} height={1000} color="white" />
                  <Path
                    path={path.current}
                    color="black"
                    style="stroke"
                    strokeWidth={STORK_WIDTH}
                  />
                </Group>
              }>
              <Image
                image={image}
                fit="cover"
                x={0}
                y={0}
                width={width}
                height={height}
              />
            </Mask>
          </Canvas>
        </>
      )}
    </View>
  );
};
