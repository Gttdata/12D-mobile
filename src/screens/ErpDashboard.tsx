import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { apiPost, IMAGE_URL, useSelector } from '../Modules';
import { Header } from '../Components';
import DashboardCard from '../Components/DashboardCard';
import { StackProps } from '../routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import QuestionPaperInfo from './TrackModule/QuestionPaperInfo';
import { ERPA, school } from '../../assets';

type Props = StackProps<'Dashboard'>;
const ErpDashboard = ({ navigation }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { member, appUserData } = useSelector(state => state.member);
  const { t } = useTranslation();
  const [questionPaperInfo, setQuestionPaperInfo] = useState<boolean>(false);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        const res = await apiPost('api/school/get', {
          filter: ` AND ID=${member?.SCHOOL_ID}`,
        });
        console.log('getSchoolData:', res?.data);
        if (res && res.code === 200) {
          setSchoolData(res.data);
        }
      } catch (error) {
        console.log('error fetching school data:', error);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchSchoolData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header
        label="School ERP"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: Sizes.Radius,
          borderTopLeftRadius: Sizes.Radius,
          borderTopRightRadius: Sizes.Radius,
          paddingTop: Sizes.Padding,
          zIndex: 0,
        }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='small' color={Colors.Primary2} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Sizes.Radius,
              paddingTop: Sizes.Radius,
            }}>
            {schoolData && schoolData.length > 0 && (
              <View
                style={{
                  backgroundColor: Colors.White,
                  borderRadius: Sizes.Radius,
                  padding: Sizes.Padding,
                  marginBottom: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  gap: 12,
                  marginHorizontal: 4
                }}>
                {schoolData[0]?.INSTITUTE_LOGO ? (
                  <Image
                    source={{
                      uri: `${IMAGE_URL}/instituteLogo/${schoolData[0]?.INSTITUTE_LOGO}`,
                    }}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      resizeMode: 'cover',
                      marginRight: 15,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      backgroundColor: Colors.Primary2 + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 15,
                    }}>
                    {/* <Text style={{ color: Colors.Primary2, ...Fonts.Medium2 }}>🏫</Text> */}
                    <Image
                      source={school}
                      style={{ width: 40, height: 40 }}
                    />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: Colors.Primary2,
                      fontFamily: Fonts.Medium2.fontFamily,
                    }}>
                    {schoolData[0]?.SCHOOL_NAME}
                  </Text>
                  {/* <Text
                  style={{
                    ...Fonts.Regular,
                    fontSize: 14,
                    color: Colors.TextGray,
                    marginTop: 4,
                  }}>
                  {schoolData[0]?.ADDRESS}
                </Text> */}
                </View>
              </View>
            )}

            {/**********TEACHER*************/}
            {member?.ROLE == 'T' && member?.APPROVAL_STATUS == 'A' && (
              <View>
                {/*visible part for Teacher ( student List & Class teacher attendance)*/}
                <DashboardCard
                  fromLeft
                  onPress={() => {
                    navigation.navigate('StudentList');
                  }}
                  animationSource={require('../../assets/LottieAnimation/studentList.json')}
                  title={t('dashboard.StudentList')}
                  description="Access and view the list of all students."
                  startColor="#B1F2EF"
                  endColor="#17A589"
                />
                <DashboardCard
                  imageSize={75}
                  onPress={() => {
                    navigation.navigate('SelectionComponent');
                  }}
                  animationSource={require('../../assets/LottieAnimation/AttendanceList.json')}
                  title={t('dashboard.ClassTeacher')}
                  description="Monitor and record student attendance."
                  startColor="#C9E79F"
                  endColor="#D4AC0D"
                />
                {/*visible part for Teacher ( question paper & ASSIGN TASK)*/}
                <DashboardCard
                  fromLeft
                  onPress={async () => {
                    const ques = await AsyncStorage.getItem('QuestionPaperShown');
                    if (!ques) {
                      setQuestionPaperInfo(true);
                    }
                    if (member?.BOARD_ID == 1) {
                      navigation.navigate('ClassSelectionScreen');
                      // navigation.navigate('SubjectSelectionScreen');
                    } else {
                      navigation.navigate('ClassSelectionScreen');
                      // navigation.navigate('SubjectSelectionScreen');
                    }
                  }}
                  animationSource={require('../../assets/LottieAnimation/demo.json')}
                  title={'Question Paper Generator'}
                  description="Create and manage question papers for exams."
                  startColor="#A6EAF8"
                  endColor="#2E86C1"
                />
                {questionPaperInfo && (
                  <QuestionPaperInfo
                    onClose={() => setQuestionPaperInfo(false)}
                    onOpen={() => setQuestionPaperInfo(false)}
                  />
                )}
                <DashboardCard
                  imageSize={75}
                  onPress={() => {
                    navigation.navigate('Assignment');
                  }}
                  animationSource={require('../../assets/LottieAnimation/AssignTask.json')}
                  title={'School Assignments'}
                  description="Know your daily classwork and assigned Homework/Activities/Assignments"
                  startColor="#AAEBC6"
                  endColor="#239B56"
                />
              </View>
            )}

            {/**********STUDENT**********/}

            {member?.ROLE == 'S' && member.APPROVAL_STATUS == 'A' && (
              <View>
                {/*visible part for students (student attendance & my tasks)*/}
                <DashboardCard
                  fromLeft
                  onPress={() => {
                    navigation.navigate('StudentTask');
                  }}
                  animationSource={require('../../assets/LottieAnimation/abc.json')}
                  title={t('dashboard.MyTasks')}
                  description="Manage your assignments and tasks."
                  startColor="#A3E4D7"
                  endColor="#17A589"
                />
                <DashboardCard
                  onPress={() => {
                    navigation.navigate('StudentAttendanceShow');
                  }}
                  animationSource={require('../../assets/LottieAnimation/AttendanceList.json')}
                  title={t('dashboard.MyAttendance')}
                  description="View your daily attendance records."
                  startColor="#FAD7A0"
                  endColor="#B9770E"
                />
                <DashboardCard
                  fromLeft
                  onPress={() => {
                    navigation.navigate('FeeStructure');
                  }}
                  animationSource={require('../../assets/LottieAnimation/feereceipt.json')}
                  title={'Fee Details'}
                  description="View your fee details."
                  startColor="#A3E4D7"
                  endColor="#17A589"
                />
                <DashboardCard
                  onPress={() => {
                    navigation.navigate('HolidayShow');
                  }}
                  animationSource={require('../../assets/LottieAnimation/AttendanceList.json')}
                  title={t('dashboard.Holiday')}
                  description="View your holiday."
                  startColor="#FAD7A0"
                  endColor="#B9770E"
                />
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default ErpDashboard;
