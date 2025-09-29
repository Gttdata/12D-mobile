import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { BASE_URL, apiPost, useSelector } from '../../Modules';
import { StackProps } from '../../routes';
import { Header, Icon, Modal, TextInput, Toast } from '../../Components';
import moment from 'moment';
import {
  CLASS_TEACHER_MAPPING,
  STUDENT_CLASS_MAPPING,
  SUBJECT_TEACHER_MASTER,
} from '../../Modules/interface';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { noData, noProfile } from '../../../assets';
import { useTranslation } from 'react-i18next';
import StudentDetailsModal from './StudentDetailsModal';
import FloatingAdd from '../../Components/FloatingAdd';
import LinearGradient from 'react-native-linear-gradient';
import { BannerAds } from '../../Modules/AdsUtils';

type Props = StackProps<'StudentList'>;
interface selectData {
  item: SUBJECT_TEACHER_MASTER;
}
type flatListProps = {
  item: STUDENT_CLASS_MAPPING;
  index: number;
};
const StudentList = ({ navigation }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { member } = useSelector(state => state.member);
  const { t } = useTranslation();
  const { teacherClassMapping, studentClassMapping }: any = useSelector(
    state => state.teacher,
  );
  const [searchValue, setSearchValue] = useState('');
  const [selectedData, setSelectedData] = useState<selectData>({
    item: {},
  });
  const [studentList, setStudentList] = useState<CLASS_TEACHER_MAPPING[]>([]);
  const [loading, setLoading] = useState(false);
  const [mainModal, setMainModal] = useState(true);
  const [studentDetailsData, setStudentDetailsData] = useState({});
  const [studentDetailsModal, setStudentDetailsModal] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [isClassTeacher, setClassTeacher] = useState(false);
  let scale = useSharedValue(0);
  const animation = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const startAnimation = async () => {
    return new Promise((resolve, reject) => {
      scale.value = withTiming(1, { duration: 500 });
    });
  };
  const endAnimation = async () => {
    return new Promise((resolve, reject) => {
      scale.value = withTiming(0, { duration: 500 });
    });
  };
  const flatListData =
    searchValue === ''
      ? studentList.length < 0
        ? studentClassMapping
        : studentList
      : studentList.length < 0
        ? studentClassMapping.filter(
          (item: any) =>
            item.STUDENT_NAME.toLowerCase().includes(
              searchValue.toLowerCase(),
            ) ||
            item.CLASS_NAME.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.YEAR.toLowerCase().includes(searchValue.toLowerCase()),
          // ||
          //   (item.MOBILE_NUMBER &&
          //     item.MOBILE_NUMBER.includes(searchValue)),
        )
        : studentList.filter(
          (item: any) =>
            item.STUDENT_NAME.toLowerCase().includes(
              searchValue.toLowerCase(),
            ) ||
            item.CLASS_NAME.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.YEAR.toLowerCase().includes(searchValue.toLowerCase()),
        );
  console.log("\n\nflatlistdata..", flatListData);

  useEffect(() => {
    // getSubjectTeacherMaster();
    getTeacherData();
  }, []);
  const getTeacherData = async () => {
    setLoading(true);
    let calls = await Promise.all([
      apiPost('api/subjectTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND STATUS = 1 `,
      }),
      apiPost('api/classTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND SCHOOL_ID = ${member?.SCHOOL_ID} AND STATUS = 1 AND CLASS_STATUS = 1`,
      }),
    ]);
    console.log('\n\ncalls..', calls[1]);

    if (calls[0].code == 200 && calls[1].code == 200) {
      const mergedData: any = [...calls[0].data, ...calls[1].data];
      setFilterData(calls[1].data);
      setLoading(false);
    } else {
      Toast('Something Wrong...Please try again');
      setLoading(false);
    }
  };
  const getSubjectTeacherMaster = async () => {
    setLoading(true);
    try {
      const res = await apiPost('api/subjectTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setFilterData(res.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error..', error);
    }
  };
  const getStudentListData = async (item: SUBJECT_TEACHER_MASTER) => {
    setMainModal(false);
    setLoading(true);
    try {
      const res = await apiPost('api/studentClassMapping/get', {
        filter: ` AND CLASS_ID = ${item.CLASS_ID} AND DIVISION_ID = ${item.DIVISION_ID} AND STATUS = 1 AND YEAR_ID = ${item.YEAR_ID} `,
      });

      if (res && res.code == 200) {
        let id = 1;
        const data = res.data.map((item: any) => ({
          ...item,
          SR_NO: id++,
          value: item.ACTIVITY_NAME,
        }));
        // console.log('\n\nresponse..', data);
        startAnimation();
        setStudentList(data);
        setLoading(false);
      }
    } catch (error) {
      console.log('err..', error);
    }
  };
  const getStudentFeeDetails = async (item: STUDENT_CLASS_MAPPING) => {
    try {
      setLoading(true);
      const res = await apiPost('api/studentFeeDetails/get', {
        filter: ` AND STUDENT_ID = ${item.STUDENT_ID} AND CLASS_ID = ${item.CLASS_ID} AND DIVISION_ID = ${item.DIVISION_ID} AND YEAR_ID = ${item.YEAR_ID} AND STATUS = 1 `,
        sortKey: 'ID',
        sortValue: 'ASC',
      });
      if (res && res.code == 200) {
        navigation.navigate('StudentListDetails', {
          feeData: res.data,
          studentData: item,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error....', error);
    }
  };
  const toggleSelectedItem = (item: SUBJECT_TEACHER_MASTER) => {
    const selectedItems: any = filterData.filter(
      (it: SUBJECT_TEACHER_MASTER) => item.ID === it.ID,
    );
    setSelectedData({
      ...selectedData,
      item: selectedItems[0],
    });
    selectedItems[0].SUBJECT_ID ? null : setClassTeacher(true);
    // startAnimation();
    getStudentListData(selectedItems[0]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label={t('studentList.header')}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, margin: Sizes.Radius }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            marginTop: Sizes.Padding,
          }}>
          <View style={{ width: '86%' }}>
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
            onPress={() => { }}
            style={{
              height: Sizes.Field,
              width: Sizes.Field,
              borderRadius: Sizes.Radius,
              backgroundColor: Colors.Background,
              elevation: 6,
              shadowColor: Colors.Primary,
              marginLeft: Sizes.Base,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name="search-outline"
              type="Ionicons"
              style={{}}
              size={24}
              color={Colors.Primary2}
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: Sizes.Padding }} />
        {loading ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : flatListData.length == 0 ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
            data={flatListData}
            ItemSeparatorComponent={() => <View style={{ height: Sizes.Base }} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                colors={[Colors.Primary, Colors.Primary]}
                onRefresh={() => {
                  endAnimation();
                  getStudentListData(selectedData.item);
                }}
              />
            }
            renderItem={({ item, index }: flatListProps) => {
              return (
                <Animated.View style={[animation]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: Colors.White,
                      borderRadius: Sizes.Radius,
                      shadowColor: Colors.Primary,
                      elevation: 5,
                      padding: Sizes.Padding,
                      margin: Sizes.Base,
                    }}
                    onPress={() => {
                      setStudentDetailsData(item);
                      setStudentDetailsModal(true);
                      // getStudentFeeDetails(item);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      {/* <View
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: 23,
                          marginRight: Sizes.Base,
                        }}>
                        <Image
                          source={
                            item.PROFILE_PHOTO
                              ? {
                                  uri:
                                    BASE_URL +
                                    'static/studentProfile/' +
                                    item.PROFILE_PHOTO,
                                }
                              : noProfile
                          }
                          style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 23,
                          }}
                        />
                      </View> */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
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
                            {`${item.STUDENT_NAME}`}
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
                            {`Roll No.: ${item.ROLL_NUMBER}`}
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

      {/* {isClassTeacher && (
        <FloatingAdd
          onPress={() => {
            navigation.navigate('TeacherStudentApproveList', {
              filter: selectedData.item,
            });
          }}
        />
      )} */}
      {studentDetailsModal && (
        <StudentDetailsModal
          visible={studentDetailsModal}
          onClose={() => {
            setStudentDetailsModal(false);
          }}
          data={studentDetailsData}
          type="S"
          onSuccess={() => {
            setStudentDetailsModal(false);
          }}
        />
      )}
      {mainModal && (
        <Modal
          isVisible={mainModal}
          onClose={() => {
            filterData.length == 0
              ? navigation.goBack()
              : selectedData.item.ID
                ? setMainModal(false)
                : navigation.goBack();
          }}
          style={{
            borderRadius: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
          }}>
          <Header
            label={t('studentList.title')}
            onBack={() => {
              filterData.length == 0
                ? navigation.goBack()
                : selectedData.item.ID
                  ? setMainModal(false)
                  : navigation.goBack();
            }}
          />
          {member?.IS_ERP_MAPPED == 1 ? (
            <View
              style={{
                width: '100%',
                marginTop: Sizes.Padding,
                justifyContent: 'center',
                flex: 1,
              }}>
              {loading ? (
                <View
                  style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size={'large'} color={Colors.Primary} />
                </View>
              ) : filterData.length == 0 ? (
                <View
                  style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: Sizes.ScreenPadding,
                  }}>
                  <Text
                    style={{
                      ...Fonts.Bold2,
                      color: Colors.Primary,
                      textAlign: 'center',
                    }}>
                    You have not been assigned any class. Please contact the
                    admin
                  </Text>
                  {/* <Image
                    resizeMode={'contain'}
                    style={{
                      width: 170,
                      height: 170,
                    }}
                    source={noData}
                    tintColor={Colors.Secondary2}
                  /> */}
                </View>
              ) : (
                <FlatList
                  data={filterData}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={false}
                      colors={[Colors.Primary, Colors.Primary]}
                      onRefresh={() => {
                        // getSubjectTeacherMaster();
                        getTeacherData();
                      }}
                    />
                  }
                  renderItem={({ item, index }: any) => {
                    const gradients = [
                      ['#b1cfa7', '#b1cfa7'],
                      ['#f49d9d', '#f49d9d'],
                      ['#cbf188', '#cbf188'],
                      ['#9f9ee2', '#9f9ee2'],
                      ['#e595cd', '#e595cd'],
                      ['#71c8d5', '#71c8d5'],
                      ['#e9de0d', '#e9de0d'],
                      ['#685757', '#685757'],
                      ['#b1cfa7', '#b1cfa7'],
                      ['#f49d9d', '#f49d9d'],
                      ['#e9de0d85', '#e9de0d85'],
                      ['#cbf188c4', '#cbf188c4'],
                      ['#9f9ee2', '#9f9ee2'],
                      ['#3b5998', '#3b5998'],
                      ['#9c27b0', '#e1bee7'],
                      ['#dc143c99', '#dc143c99'],
                      ['#6a0dad99', '#6a0dad99'],
                      ['#ff7f5099', '#ff7f5099'],
                      ['#40e0d099', '#40e0d099'],
                      ['#0077be99', '#0077be99'],
                      ['#ffd70099', '#ffd70099'],
                      ['#50c87899', '#50c87899'],
                    ];
                    const gradient = gradients[index % gradients.length];

                    return (
                      <LinearGradient
                        colors={gradient}
                        style={{
                          paddingHorizontal: Sizes.Padding,
                          paddingVertical: Sizes.Base,
                          borderRadius: Sizes.Radius,
                          backgroundColor:
                            selectedData.item.ID == item.ID
                              ? Colors.Primary + 70
                              : Colors.Background,
                          margin: Sizes.Base,
                          marginHorizontal: Sizes.Padding,
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            toggleSelectedItem(item);
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View>
                            <Image
                              source={require('../../../assets/images/subject.png')}
                              style={{ height: 35, width: 35 }}
                            />
                          </View>
                          <View
                            style={{
                              flex: 1,
                              marginLeft: Sizes.ScreenPadding,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                ...Fonts.Regular2,
                                color: Colors.Black,
                              }}>
                              {`Class : ${item.CLASS_NAME ? item.CLASS_NAME : 'N/A'
                                }`}
                            </Text>
                            <Text
                              style={{
                                ...Fonts.Medium2,
                                color: Colors.Black,
                                // marginLeft: Sizes.Padding,
                              }}>
                              {`Div : ${item.DIVISION_NAME ? item.DIVISION_NAME : 'N/A'
                                }`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </LinearGradient>
                    );
                  }}
                />
              )}

              <BannerAds />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Colors.Primary,
                    ...Fonts.Bold2,
                  }}>
                  Sorry, you are not eligible to access this functionality.
                </Text>
              </View>
              <BannerAds />
            </View>
          )}
        </Modal>
      )}
    </View>
  );
};

export default StudentList;
