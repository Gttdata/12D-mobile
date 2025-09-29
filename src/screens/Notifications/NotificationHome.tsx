import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
  // Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiPost, useSelector} from '../../Modules';
import {Header, Icon} from '../../Components';
import {StackProps} from '../../routes';
import {NOTIFICATION_DATA_INTERFACE} from '../../Modules/interface';
import {noData} from '../../../assets';
import moment from 'moment';

type Props = StackProps<'NotificationHome'>;
const NotificationHome = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  type notificationProps = {
    data: NOTIFICATION_DATA_INTERFACE[];
    loading: boolean;
  };
  // const scrollY = React.useRef(new Animated.Value(0)).current;

  const [notificationData, setNotificationData] = useState<notificationProps>({
    data: [],
    loading: true,
  });
  useEffect(() => {
    getNotification();
  }, []);
  const getNotification = async () => {
    try {
      const res = await apiPost('api/notification/get', {
        filter: ` AND USER_ID = ${member?.ID} `,
      });
      if (res && res.code == 200) {
        // console.log('\n\n..res..', res);
        setNotificationData({
          ...notificationData,
          data: res.data,
          loading: false,
        });
      }
    } catch (error) {
      console.log('error...', error);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label="Notifications"
        onBack={() => {
          navigation.goBack();
        }}
      />
      {/* <BMIGauge /> */}
      <View style={{flex: 1, margin: Sizes.Padding}}>
        {notificationData.loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator color={Colors.Primary} />
          </View>
        ) : notificationData.data.length == 0 ? (
          <View
            style={{
              marginTop: Sizes.Header * 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={noData}
              style={{height: 150, width: 150, tintColor: Colors.Primary}}
            />
          </View>
        ) : (
          <FlatList
            data={notificationData.data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={false}
                colors={[Colors.Primary, Colors.Primary]}
                onRefresh={() => {
                  getNotification();
                }}
              />
            }
            renderItem={({item, index}) => {
              const today = moment();
              const differenceInDays = today.diff(
                item.CREATED_MODIFIED_DATE,
                'days',
              );
              let displayDate;
              if (differenceInDays > 10) {
                displayDate = moment(item.CREATED_MODIFIED_DATE).format(
                  'DD/MMM/YYYY',
                );
              } else {
                differenceInDays == 0
                  ? (displayDate = 'Today')
                  : differenceInDays == 1
                  ? (displayDate = differenceInDays + ' day')
                  : (displayDate = differenceInDays + ' days');
              }
              return (
                <View >
                  <TouchableOpacity
                    key={index.toString()}
                    activeOpacity={0.8}
                    style={{
                      paddingHorizontal: Sizes.Padding,
                      paddingVertical: Sizes.Radius,
                      borderRadius: Sizes.Radius,
                      elevation: Sizes.Base,
                      shadowColor: Colors.Primary,
                      backgroundColor: Colors.White,
                      marginHorizontal: 3,
                      marginVertical: Sizes.Base,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          height: 34,
                          width: 34,
                          borderRadius: 17,
                          backgroundColor: Colors.Secondary + 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          name="notifications"
                          type="Ionicons"
                          size={18}
                          color={Colors.Primary}
                        />
                      </View>
                      <View style={{width: Sizes.Radius}} />
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            ...Fonts.Medium2,
                            color: Colors.PrimaryText1,
                          }}>
                          {item.TITLE}
                        </Text>
                        <Text
                          style={{
                            ...Fonts.Medium2,
                            fontSize: 12,
                            color: Colors.PrimaryText,
                          }}>
                          {`${displayDate}  |  ${moment(
                            item.CREATED_MODIFIED_DATE,
                          ).format('HH:mm')}`}
                        </Text>
                      </View>
                    </View>
                    {item.DESCRIPTION && (
                      <Text
                        style={{
                          ...Fonts.Medium2,
                          color: Colors.PrimaryText,
                          marginTop: Sizes.Base,
                          fontSize: 12,
                        }}>
                        {item.DESCRIPTION}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default NotificationHome;
