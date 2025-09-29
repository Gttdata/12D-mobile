import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { noData } from '../../assets';
import { apiPost, useSelector } from '../Modules';
import {
  CLASS_TEACHER_MAPPING,
  SUBJECT_TEACHER_MASTER,
} from '../Modules/interface';
import { Header, Icon, Toast } from '.';
import { useTranslation } from 'react-i18next';
import { StackProps } from '../routes';
import LinearGradient from 'react-native-linear-gradient';
import { BannerAds } from '../Modules/AdsUtils';
interface selectData {
  className: CLASS_TEACHER_MAPPING;
  item: SUBJECT_TEACHER_MASTER;
}
interface SelectionComponentProp {
  isVisible: boolean;
  onClose: () => void;
  loading: boolean;
  title?: string;
  onSelectItem: (item: SUBJECT_TEACHER_MASTER) => void;
  navigation: any;
}

type Props = StackProps<'SelectionComponent'>;
const SelectionComponent = ({ navigation }: Props): JSX.Element => {
  const { member } = useSelector(state => state.member);
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { t } = useTranslation();
  const [taskData, setTaskData] = useState({
    data: [],
    filterData: [],
    filterClassData: [],
    loading: false,
  });

  useEffect(() => {
    getTeacherData();
  }, []);

  const getTeacherData = async () => {
    console.log("SUBJECT", member?.S_TEACHER_ATTENDANCE_ENABLED);

    setTaskData({ ...taskData, loading: true });
    let calls = await Promise.all([
      apiPost('api/subjectTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND STATUS = 1 `,
      }),
      apiPost('api/classTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND SCHOOL_ID = ${member?.SCHOOL_ID} AND STATUS = 1 AND CLASS_STATUS = 1`,
      }),
    ]);
    console.log("CALLS", calls[1]);

    if (calls[0].code == 200 && calls[1].code == 200) {
      setTaskData({
        ...taskData,
        filterData: calls[0].data,
        filterClassData: calls[1].data,
        loading: false,
      });
    } else {
      Toast('Something Wrong...Please try again');
      setTaskData({ ...taskData, loading: false });
    }
  };

  const toggleClassSelectedItem = (
    item: SUBJECT_TEACHER_MASTER,
    classTeacher: boolean,
  ) => {
    const selectedItems = taskData.filterClassData.filter(
      (it: SUBJECT_TEACHER_MASTER) => item.ID === it.ID,
    );
    navigation.navigate('ClassTeacherAttendance', {
      item: selectedItems[0],
      Teacher: '1',
    });
  };

  const toggleSubjectSelectedItem = (
    item: SUBJECT_TEACHER_MASTER,
    classTeacher: boolean,
  ) => {
    const selectedItems = taskData.filterData.filter(
      (it: SUBJECT_TEACHER_MASTER) => item.ID === it.ID,
    );
    navigation.navigate('SubjectTeachAttendance', {
      item: selectedItems[0],
      Teacher: '0',
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <Header
        label={'Student Attendance'}
        onBack={() => {
          navigation.goBack();
        }}
      />
      {member?.IS_ERP_MAPPED == 1 ? (
        <View style={{ paddingHorizontal: Sizes.Padding, flex: 1 }}>
          {taskData.loading ? (
            <View
              style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={'large'} color={Colors.Primary} />
            </View>
          ) : taskData.filterData.length == 0 &&
            taskData.filterClassData.length == 0 ? (
            <View
              style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  ...Fonts.Bold2,
                  color: Colors.Primary,
                  textAlign: 'center',
                }}>
                You have not been assigned any class. Please contact the admin
              </Text>
            </View>
          ) : (
            <>
              {/* ✅ Show NOT ELIGIBLE only once if both disabled */}
              {member?.C_TEACHER_ATTENDANCE_ENABLED != 1 &&
                member?.S_TEACHER_ATTENDANCE_ENABLED != 1 ? (
                <View style={{ justifyContent: 'center', marginTop: Sizes.Padding }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.Primary,
                      ...Fonts.Bold2,
                    }}>
                    Sorry, you are not eligible to access this functionality.
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: Sizes.ScreenPadding }}>
                  {/* Class Teacher Section */}
                  {taskData.filterClassData.length != 0 &&
                    member?.C_TEACHER_ATTENDANCE_ENABLED == 1 && (
                      <View>
                        <Text
                          style={{
                            ...Fonts.Bold2,
                            color: Colors.Primary,
                          }}>
                          {t('teacherAssignTask.classTitle')}
                        </Text>
                        <FlatList
                          data={taskData.filterClassData}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item, index) => index.toString()}
                          refreshControl={
                            <RefreshControl
                              refreshing={false}
                              colors={[Colors.Primary, Colors.Primary]}
                              onRefresh={() => {
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
                            ];
                            const gradient = gradients[index % gradients.length];

                            return (
                              <LinearGradient
                                colors={gradient}
                                style={{
                                  paddingHorizontal: Sizes.Padding,
                                  paddingVertical: Sizes.Base,
                                  borderRadius: Sizes.Radius,
                                  backgroundColor: Colors.Background,
                                  margin: Sizes.Base,
                                }}>
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() => {
                                    navigation.navigate('ClassTeacherAttendance', {
                                      item: item,
                                      Teacher: '1',
                                    });
                                  }}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View>
                                    <Image
                                      source={require('../../assets/images/subject.png')}
                                      style={{
                                        height: 35,
                                        width: 35,
                                      }}
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
                                      }}>
                                      {`Div : ${item.DIVISION_NAME
                                        ? item.DIVISION_NAME
                                        : 'N/A'
                                        }`}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </LinearGradient>
                            );
                          }}
                        />
                      </View>
                    )}

                  {/* Subject Teacher Section */}
                  {taskData.filterData.length != 0 &&
                    member?.S_TEACHER_ATTENDANCE_ENABLED == 1 && (
                      <View style={{ marginTop: Sizes.Radius }}>
                        <FlatList
                          data={taskData.filterData}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item, index) => index.toString()}
                          refreshControl={
                            <RefreshControl
                              refreshing={false}
                              colors={[Colors.Primary, Colors.Primary]}
                              onRefresh={() => {
                                getTeacherData();
                              }}
                            />
                          }
                          renderItem={({ item, index }: any) => {
                            const gradients = [
                              ['#9f9ee2', '#9f9ee2'],
                              ['#e595cd', '#e595cd'],
                              ['#71c8d5', '#71c8d5'],
                              ['#e9de0d', '#e9de0d'],
                              ['#b1cfa7', '#b1cfa7'],
                              ['#f49d9d', '#f49d9d'],
                              ['#cbf188', '#cbf188'],
                            ];
                            const gradient = gradients[index % gradients.length];
                            return (
                              <LinearGradient
                                colors={gradient}
                                style={{
                                  paddingHorizontal: Sizes.Padding,
                                  paddingVertical: Sizes.Base,
                                  borderRadius: Sizes.Radius,
                                  backgroundColor: Colors.Background,
                                  margin: Sizes.Base,
                                }}>
                                <Text
                                  style={{
                                    ...Fonts.Bold2,
                                    color: Colors.Primary,
                                  }}>
                                  {t('teacherAssignTask.subjectTitle')}
                                </Text>
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() => {
                                    toggleSubjectSelectedItem(item, false);
                                    navigation.navigate('SubjectTeachAttendance', {
                                      item: item,
                                      Teacher: '2',
                                    });
                                  }}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View>
                                    <Image
                                      source={require('../../assets/images/subject.png')}
                                      style={{
                                        height: 35,
                                        width: 35,
                                      }}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flex: 1,
                                      marginLeft: Sizes.ScreenPadding,
                                    }}>
                                    <View
                                      style={{
                                        flex: 1,
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
                                        }}>
                                        {`Div : ${item.DIVISION_NAME
                                          ? item.DIVISION_NAME
                                          : 'N/A'
                                          }`}
                                      </Text>
                                    </View>
                                    <Text
                                      style={{
                                        ...Fonts.Medium2,
                                        color: Colors.PrimaryText1,
                                      }}
                                      numberOfLines={2}>
                                      {item.SUBJECT_NAME
                                        ? item.SUBJECT_NAME
                                        : 'N/A'}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </LinearGradient>
                            );
                          }}
                        />
                      </View>
                    )}
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.Primary,
              ...Fonts.Bold2,
            }}>
            Sorry, you are not eligible to access this functionality.
          </Text>
        </View>
      )}
      <BannerAds />
    </View>
  );
};

export default SelectionComponent;
