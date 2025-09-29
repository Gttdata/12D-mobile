import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackProps} from '../../routes';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Header, Icon, TextInput} from '../../Components';
import {BASE_URL, apiPost, useSelector} from '../../Modules';
import {useTranslation} from 'react-i18next';
import {noData, noProfile} from '../../../assets';
import {
  MEMBER_INTERFACE,
  STUDENT_LIST_INTERFACE,
} from '../../Modules/interface';
import StudentDetailsModal from './StudentDetailsModal';

type Props = StackProps<'TeacherStudentApproveList'>;
const TeacherStudentApproveList = ({navigation, route}: Props): JSX.Element => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {filter} = route.params;
  const {member} = useSelector(state => state.member);
  const {t} = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [studentData, setStudentData] = useState({
    data: [],
    loading: true,
    modalData: {},
  });
  const [studentDetailsModal, setStudentDetailsModal] = useState(false);
  let scale = useSharedValue(0);
  const animation = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
  const startAnimation = async () => {
    return new Promise((resolve, reject) => {
      scale.value = withTiming(1, {duration: 500});
    });
  };
  const endAnimation = async () => {
    return new Promise((resolve, reject) => {
      scale.value = withTiming(0, {duration: 500});
    });
  };
  useEffect(() => {
    getStudentList();
  }, []);
  const getStudentList = async () => {
    try {
      const res = await apiPost('api/appUser/get', {
        filter: ` AND ROLE = 'S' AND SCHOOL_ID = ${member?.SCHOOL_ID} AND TEMP_CLASS_ID = ${filter.CLASS_ID} AND TEMP_DIVISION_ID = ${filter.DIVISION_ID} AND YEAR_ID = ${filter.YEAR_ID} AND STATUS = 1 `,
      });
      // const res = await apiPost('api/student/get', {
      //   filter: ` AND SCHOOL_ID = ${member?.SCHOOL_ID} AND TEMP_CLASS_ID = ${filter.CLASS_ID} AND TEMP_DIVISION_ID = ${filter.DIVISION_ID} AND YEAR_ID = ${filter.YEAR_ID} AND STUDENT_STATUS = 'P' AND STATUS = 1 `,
      // });
      if (res && res.code == 200) {
        // console.log('\n\n..response...', res.data[0]);
        let id = 1;
        const data = res.data.map((item: any) => ({
          ...item,
          SR_NO: id++,
          value: item.ACTIVITY_NAME,
        }));
        startAnimation();
        setStudentData({...studentData, data: data, loading: false});
      }
    } catch (error) {
      console.log('error...', error);
    }
  };
  // console.log('\n\n..filter..', studentData.modalData);
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label={t('studentList.header')}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1, margin: Sizes.Radius}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            marginTop: Sizes.Padding,
          }}>
          <View style={{width: '84%'}}>
            <TextInput
              onChangeText={txt => {
                setSearchValue(txt);
              }}
              value={searchValue}
              placeholder={t('studentList.searchPlaceholder')}
              style={{
                borderWidth: 0,
                elevation: 6,
                shadowColor: Colors.Primary,
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={{
              height: 43,
              width: '14%',
              borderRadius: 8,
              backgroundColor: Colors.Background,
              elevation: 8,
              shadowColor: Colors.Primary,
              marginLeft: Sizes.Base,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name="search-outline"
              type="Ionicons"
              style={{marginLeft: Sizes.Base}}
              size={24}
              color={Colors.Primary2}
            />
          </TouchableOpacity>
        </View>
        <View style={{height: Sizes.Padding}} />
        {studentData.loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : studentData.data.length == 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              resizeMode={'contain'}
              style={{
                width: 170,
                height: 170,
              }}
              source={noData}
              tintColor={Colors.Primary}
            />
          </View>
        ) : (
          <FlatList
            data={studentData.data}
            ItemSeparatorComponent={() => <View style={{height: Sizes.Base}} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                colors={[Colors.Primary, Colors.Primary]}
                onRefresh={() => {
                  endAnimation();
                }}
              />
            }
            renderItem={({
              item,
              index,
            }: {
              item: STUDENT_LIST_INTERFACE;
              index: number;
            }) => {
              return (
                <Animated.View style={[animation]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: Colors.White,
                      borderRadius: Sizes.Radius,
                      shadowColor: Colors.Primary,
                      borderWidth: 0.3,
                      borderColor: Colors.Primary,
                      elevation: 6,
                      padding: Sizes.Padding,
                      margin: Sizes.Base,
                    }}
                    onPress={() => {
                      setStudentData({
                        ...studentData,
                        modalData: item,
                      });
                      setStudentDetailsModal(true);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              ...Fonts.Medium2,
                              color: Colors.PrimaryText1,
                              marginRight: Sizes.Padding,
                            }}>
                            {item.SR_NO > 9 ? item.SR_NO : '0' + item.SR_NO}
                          </Text>
                          <Text
                            style={{
                              ...Fonts.Medium2,
                              color: Colors.PrimaryText1,
                            }}>
                            {`${item.NAME}`}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              ...Fonts.Medium3,
                              color: Colors.PrimaryText,
                            }}>
                            {`Roll No. : ${item.TEMP_ROLL_NO}`}
                          </Text>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                            }}>
                            <Icon
                              name="call"
                              type="MaterialIcons"
                              size={15}
                              color={Colors.PrimaryText}
                            />
                            <Text
                              style={{
                                ...Fonts.Medium3,
                                color: Colors.PrimaryText,
                                marginLeft: 5,
                              }}>
                              {`${item.MOBILE_NUMBER}`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        )}
      </View>
      {studentDetailsModal && (
        <StudentDetailsModal
          visible={studentDetailsModal}
          onClose={() => {
            setStudentDetailsModal(false);
          }}
          data={studentData.modalData}
          type="A"
          onSuccess={() => {
            getStudentList();
            setStudentDetailsModal(false);
          }}
        />
      )}
    </View>
  );
};

export default TeacherStudentApproveList;
