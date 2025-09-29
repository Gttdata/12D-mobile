import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from '../../Modules';
import {Header, Icon} from '../../Components';
import {StackProps} from '../../routes';
import Animated from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {useAnimatedGestureHandler} from 'react-native-reanimated';

type Props = StackProps<'SelectChallenges'>;
const SelectChallenges = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [tabIndex, setTabIndex] = useState(1);
  const onPanGestureEvent =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onActive: event => {
        // console.log('on active..', event);
      },
      onEnd: () => {},
    });
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label="Track Book"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1, margin: Sizes.Padding}}>
        <Text
          style={{
            ...Fonts.Medium1,
            color: Colors.PrimaryText1,
          }}>{`Title`}</Text>
        <View>
          <FlatList
            data={[1, 1, 1]}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: Sizes.Base}} />}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.Background,
                    elevation: 6,
                    shadowColor: Colors.Primary,
                    paddingHorizontal: Sizes.Padding,
                    paddingVertical: Sizes.Base,
                    borderRadius: Sizes.Base,
                    margin: Sizes.Base,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      ...Fonts.Regular2,
                      color: Colors.PrimaryText1,
                    }}>
                    welcome
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 9,
                      backgroundColor: Colors.Primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name="right"
                      type="AntDesign"
                      color={Colors.White}
                      size={10}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      {/* <GestureHandlerRootView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {tabIndex == 1 && (
            <View style={{flex: 1}}>
              <PanGestureHandler onGestureEvent={onPanGestureEvent}>
                <Animated.View style={{backgroundColor: 'pink'}}>
                  <FlatList
                    data={[, , , , , , , , , , , , , , , , , , , , , ,]}
                    renderItem={item => {
                      return (
                        <View style={{margin: Sizes.Padding}}>
                          <Text>{'Hii'}</Text>
                        </View>
                      );
                    }}
                  />
                </Animated.View>
              </PanGestureHandler>
            </View>
          )}
          {tabIndex == 2 && (
            <View style={{flex: 1, backgroundColor: 'green'}}></View>
          )}
          {tabIndex == 3 && (
            <View style={{flex: 1, backgroundColor: 'purple'}}></View>
          )}
        </View>
      </GestureHandlerRootView> */}
    </View>
  );
};

export default SelectChallenges;
