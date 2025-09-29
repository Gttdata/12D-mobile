import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {useSelector} from '../../Modules';
import {Header} from '../../Components';
import {NavigationContainer} from '@react-navigation/native';
import {StackProps} from '../../routes';

type Props = StackProps<'AppInfo'>;
const AppInfo = ({navigation}: Props): JSX.Element => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <View style={{flex: 1}}>
      <Header
        label="App Info"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        style={{margin: Sizes.Padding}}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: Sizes.Base,
            textAlign: 'justify',
          }}>
          Welcome to 12 dimensions : A multi-featured productivity app for a
          disciplined lifestyle.
        </Text>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.Primary,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          Are you ready to take control of your life and achieve your goals?
        </Text>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: 5,
            textAlign: 'justify',
          }}>
          12 dimensions is your ultimate companion for fitness, productivity,
          growth, and balance. Designed to meet the demands of modern life, this
          app is packed with features to help you stay organized, improve
          yourself, and live intentionally—all in one place.
        </Text>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.Primary,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          Why choose 12 dimensions?
        </Text>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: 5,
            textAlign: 'justify',
          }}>
          Because your life deserves more than just another app! 12 dimensions
          brings together everything you need to lead a happier, healthier, and
          more productive life. No more juggling multiple apps. Get it all here,
          beautifully integrated and easy to use.
        </Text>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          Step into a world of productivity, growth, and self-improvement with
          12 dimensions, the ultimate all-in-one app designed to cater to your
          diverse needs. Whether you're striving to achieve fitness goals,
          streamline your daily tasks, or embrace a balanced digital lifestyle,
          12 dimensions is your trusted companion.
        </Text>

        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.Primary,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          What makes 12 dimensions special?
        </Text>
        {/* 1 */}
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: 5,
            textAlign: 'justify',
          }}>
          1. Achieve your fitness goals, manage your pains with the health &
          fitness feature-
        </Text>
        <View style={{marginLeft: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Transform your health with guided exercise videos tailored to
            every fitness level.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Manage your muscular pains with our unique pain management aquatic
            and static exercising videos.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Track your health with period tracker and bmi calculator.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • From strength training to yoga, there’s something for everyone.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Feel stronger, healthier, and more confident every day.
          </Text>
        </View>
        {/* 2 */}
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          2. Unlock your potential with life challenges using task-book-
        </Text>
        <View style={{marginLeft: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Discover a unique approach to personal growth with tasks &
            challenges based on 12 life dimensions like physical, psychological,
            spiritual, intellectual, environmental, occupational, technological,
            financial, social, parental, ethical & habitual.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Overcome weaknesses with age-appropriate tasks & challenges that
            focus on health, career, relationships, creativity, mindfulness, and
            much more.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Win virtual rewards & surprises after daily completion of tasks &
            challenges.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Build better habits, step out of your comfort zone, and grow every
            day.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Perfect for kids as well as adults looking to add meaning and
            excitement to life.
          </Text>
        </View>
        {/* 3 */}
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          3. Simplify school with important erp tools and an easy paper
          generator (for pre-schools, schools & academies)-
        </Text>
        <View style={{marginLeft: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Revolutionize how students, teachers, and parents stay connected
            and organized.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Manage student fees, attendance, classworks, homeworks &
            assignments effortlessly.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Access tools for better communication and coordination.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Generate question papers easily for exams, tests, etc.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Perfect for students and educators looking for a smarter way to
            manage school life with other exclusive unique in-app features.
          </Text>
        </View>
        {/* 4 */}
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          4. Screen control made easy with the digital detox feature-
        </Text>
        <View style={{marginLeft: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Take back control of your time with our innovative digital detox
            feature.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Monitor your screen time and block apps after excessive usage.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Cultivate healthier phone habits and spend more time on what truly
            matters.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Strike the perfect balance between the digital and real worlds.
          </Text>
        </View>
        {/* 5 */}
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          5. Organize your life easily with the daily organizer & weekly
          planner-
        </Text>
        <View style={{marginLeft: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Stay ahead of your tasks and plans with powerful organizational
            tools.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Simplify your day with an intuitive daily organizer.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Plan your week like a pro with a sleek weekly planner.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Get reminders and updates so you never miss a deadline or event.
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.Primary,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          For whom is the 12 dimensions app?
        </Text>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: Sizes.Base,
            textAlign: 'justify',
          }}>
          This app is perfect for-
        </Text>
        <View style={{marginLeft: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Individuals seeking a healthier, more organized lifestyle.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Students and teachers aiming to simplify school/academic
            management.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Anyone who is eager to control screen time.
          </Text>
          <Text
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginTop: 5,
              textAlign: 'justify',
            }}>
            • Self-starters looking for daily inspiration and meaningful tasks &
            challenges.
          </Text>
        </View>

        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            marginTop: Sizes.Radius,
            textAlign: 'justify',
          }}>
          Start your journey toward a better, balanced, and more fulfilling life
          today. Download 12 dimensions and unlock the power of personal growth
          and productivity!
        </Text>
      </ScrollView>
    </View>
  );
};

export default AppInfo;
