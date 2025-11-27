import { View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, Modal } from '../Components';
import { Reducers, useDispatch, useSelector } from '../Modules';
import { logo } from '../../assets';

interface AppInfoProps {
  onClose: () => void;
}
const AppInfoScreens: React.FC<AppInfoProps> = ({ onClose }) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const [activeIndex, setActiveIndex] = useState(1);
  const dispatch = useDispatch();

  return (
    <Modal
      isVisible={true}
      onClose={() => {
        dispatch(Reducers.setShowSplash(true));
        onClose();
        // BackHandler.exitApp();
      }}
      style={{
        height: '100%',
        width: '100%',
        margin: 0,
        borderRadius: 0,
        backgroundColor: Colors.White,
      }}>
      <Text
        onPress={() => {
          dispatch(Reducers.setShowSplash(true));
        }}
        style={{
          ...Fonts.Bold2,
          fontSize: 15,
          color: Colors.Primary,
          textAlign: 'right',
          marginTop: Sizes.Radius,
          marginRight: Sizes.Base,
        }}>
        Skip
      </Text>
      {/* Welcome */}
      {activeIndex == 1 && (
        <View style={{ flex: 1, marginTop: Sizes.header }}>
          {/* <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.Primary,
            textAlign: 'center',
          }}>
          {'Namaste,'}
        </Text> */}
          <Text
            style={{
              ...Fonts.Bold1,
              fontSize: 28,
              color: Colors.Primary,
              textAlign: 'center',
              marginBottom: Sizes.Base,
            }}>
            {'Welcome to\n 12 Dimensions'}
          </Text>
          <Image
            source={logo}
            style={{
              width: Sizes.Width * 0.7,
              height: Sizes.Width * 0.7,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.Black,
              textAlign: 'center',
              marginTop: Sizes.Padding,
            }}>
            {'(AWAKE AWARE ALERT)'}
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.Primary,
              textAlign: 'center',
              marginTop: Sizes.Padding * 2,
            }}>
            {'A Multi-Featured All In One Productivity & Lifestyle Tracker App'}
          </Text>
        </View>
      )}
      {/* school erp */}
      {activeIndex == 2 && (
        <View style={{ flex: 1, marginTop: Sizes.header * 2 }}>
          <Text
            style={{
              ...Fonts.Bold1,
              fontSize: 23,
              color: Colors.Primary,
              textAlign: 'center',
              marginBottom: Sizes.Base,
            }}>
            {'School ERP with Paper Generator'}
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              textAlign: 'center',
              marginBottom: Sizes.Padding * 2,
              marginHorizontal: Sizes.ScreenPadding,
            }}>
            {'For pre-schools, schools & academic only'}
          </Text>
          <Image
            source={require('../../assets/AppInfoImages/schoolErp.png')}
            style={{
              width: Sizes.Width * 0.7,
              height: Sizes.Width * 0.4,
              alignSelf: 'center',
            }}
          />

          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              textAlign: 'center',
              marginTop: Sizes.Padding * 3,
            }}>
            Manage student attendance & fees, send online homeworks, assignments
            and classWorks. Simplify exam preparation and save time with our
            easy paper generator.
          </Text>
        </View>
      )}
      {/* task book */}
      {activeIndex == 3 && (
        <View style={{ flex: 1, marginTop: Sizes.header * 2 }}>
          <Text
            style={{
              ...Fonts.Bold1,
              fontSize: 27,
              color: Colors.Primary,
              textAlign: 'center',
              marginBottom: Sizes.Padding * 2,
            }}>
            {'Task Book'}
          </Text>
          <Image
            source={require('../../assets/AppInfoImages/trackBook.png')}
            style={{
              width: Sizes.Width * 0.6,
              height: Sizes.Width * 0.5,
              alignSelf: 'center',
            }}
          />

          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              textAlign: 'center',
              marginTop: Sizes.Padding * 3,
            }}>
            With our exclusive task-book feature, overcome your weaknesses
            scattered within 12 life dimensions with age appropriate tasks and
            challenges.
          </Text>
        </View>
      )}
      {/* health and fitness */}
      {activeIndex == 4 && (
        <View style={{ flex: 1, marginTop: Sizes.header * 2 }}>
          <Text
            style={{
              ...Fonts.Bold1,
              fontSize: 27,
              color: Colors.Primary,
              textAlign: 'center',
              marginBottom: Sizes.Padding * 2,
            }}>
            {'Health And Fitness'}
          </Text>
          <Image
            source={require('../../assets/AppInfoImages/healthAndFitness.jpg')}
            style={{
              width: Sizes.Width * 0.6,
              height: Sizes.Width * 0.6,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              textAlign: 'center',
              marginTop: Sizes.ScreenPadding,
            }}>
            Improve your fitness with free-hand exercising videos like yoga,
            isometric, band, cardio, strength training etc. Know your
            health with tools like BMI calculator and period tracker.
          </Text>
        </View>
      )}
      {/* digital detox */}
      {activeIndex == 5 && (
        <View style={{ flex: 1, marginTop: Sizes.header * 2 }}>
          <Text
            style={{
              ...Fonts.Bold1,
              fontSize: 27,
              color: Colors.Primary,
              textAlign: 'center',
            }}>
            {'Digital Detox'}
          </Text>
          <Image
            source={require('../../assets/AppInfoImages/digitalDetox.png')}
            style={{
              width: Sizes.Width * 0.9,
              height: Sizes.Width * 0.55,
              alignSelf: 'center',
            }}
          />

          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              textAlign: 'center',
              marginTop: Sizes.Padding * 3,
            }}>
            Improve your productivity by controlling screen time and mindless
            mobile scrolling with our unique digital detox feature.
          </Text>
        </View>
      )}
      {/* daily organizer */}
      {activeIndex == 6 && (
        <View style={{ flex: 1, marginTop: Sizes.header * 2 }}>
          <Text
            style={{
              ...Fonts.Bold1,
              fontSize: 27,
              color: Colors.Primary,
              textAlign: 'center',
              marginBottom: Sizes.Padding * 2,
            }}>
            {'Daily Organizer'}
          </Text>
          <Image
            source={require('../../assets/AppInfoImages/DailyOrganizer.jpg')}
            style={{
              width: Sizes.Width * 0.6,
              height: Sizes.Width * 0.5,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              textAlign: 'center',
              marginTop: Sizes.Padding * 3,
            }}>
            Set easily daily work list, shopping list, and various task and
            sub-tasks with easy to understand daily organizer.
          </Text>
        </View>
      )}
      {/* weekly planner */}
      {activeIndex == 7 && (
        <View style={{ flex: 1, marginTop: Sizes.header * 2 }}>
          <Text
            style={{
              ...Fonts.Bold1,
              fontSize: 27,
              color: Colors.Primary,
              textAlign: 'center',
              marginBottom: Sizes.Padding * 2,
            }}>
            {'Weekly Planner'}
          </Text>
          <Image
            source={require('../../assets/AppInfoImages/weeklyPlanner.jpg')}
            style={{
              width: Sizes.Width * 0.6,
              height: Sizes.Width * 0.4,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              textAlign: 'center',
              marginTop: Sizes.Padding * 3,
            }}>
            Create a weekly roadmap to balance studies, sports, events,
            meetings, appointments, trips, and personal goals. Prioritize work
            with tags and track the progress by setting reminders and
            notification.
          </Text>
        </View>
      )}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          {activeIndex != 1 && (
            <Text
              onPress={() => {
                setActiveIndex(activeIndex - 1);
              }}
              style={{ ...Fonts.Medium2, color: Colors.Primary }}>
              Previous
            </Text>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            activeIndex == 7
              ? dispatch(Reducers.setShowSplash(true))
              : setActiveIndex(activeIndex + 1);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.Primary,
              textAlign: 'right',
            }}>
            {activeIndex == 7 ? 'Finish..' : ' Next'}
          </Text>
          {activeIndex != 7 && (
            <Icon
              name="long-arrow-alt-right"
              type="FontAwesome5"
              style={{ paddingTop: 2, paddingLeft: 5 }}
            />
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AppInfoScreens;
