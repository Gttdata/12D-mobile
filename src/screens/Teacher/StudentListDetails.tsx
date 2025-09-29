import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import { StackProps } from '../../routes';
import { Header, Icon, Modal, TextButton, TextInput } from '../../Components';
import { BASE_URL, apiPut, useSelector } from '../../Modules';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import AddFeeDetailsModal from './AddFeeDetailsModal';
import { useTranslation } from 'react-i18next';
import { Edit, noProfile } from '../../../assets';

type Props = StackProps<'StudentListDetails'>;
const StudentListDetails = ({ navigation, route }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { t } = useTranslation();
  const { feeData, studentData } = route.params;
  const [addFeeModal, setAddFeeModal] = useState(false);
  // console.log('\n\n\nfeeData...', feeData);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label={t('studentListDetails.header')}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <Animated.View
        entering={SlideInRight.delay(500).duration(500)}
        exiting={SlideOutLeft}
        style={{ flex: 1, margin: Sizes.ScreenPadding }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: Sizes.Radius,
            marginBottom: Sizes.Radius,
          }}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => { }}>
            <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
              {`STD : ${studentData.CLASS_NAME}`}
            </Text>
          </TouchableOpacity>
          <View style={{ width: Sizes.Radius }} />
          <TouchableOpacity activeOpacity={0.8}>
            <Text
              style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}
              numberOfLines={1}>
              {`DIV : ${studentData.DIVISION_NAME}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderWidth: 0.3,
            elevation: 5,
            shadowColor: Colors.Primary,
            borderRadius: Sizes.Radius,
            borderColor: Colors.Primary,
            padding: Sizes.Padding,
            backgroundColor: Colors.White,
          }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={
                studentData.PROFILE_PHOTO
                  ? {
                    uri:
                      BASE_URL +
                      'static/studentProfile/' +
                      studentData.PROFILE_PHOTO,
                  }
                  : noProfile
              }
              style={{
                height: 75,
                width: 75,
                borderRadius: 23,
              }}
            />
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                marginTop: Sizes.Base,
              }}>
              {studentData.STUDENT_NAME}
            </Text>
            <Text
              style={{
                ...Fonts.Regular3,
                color: Colors.PrimaryText1,
              }}>
              {`ID ${studentData.ROLL_NUMBER}`}
            </Text>
            <Icon
              name="pencil"
              type="SimpleLineIcons"
              style={{ position: 'absolute', right: 0 }}
              size={23}
              color={Colors.Primary2}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: Sizes.Padding,
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
                flex: 0.4,
              }}>
              {t('studentListDetails.year')}
            </Text>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                flex: 0.1,
              }}>
              :
            </Text>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
                flex: 0.5,
              }}>
              {studentData.YEAR}
            </Text>
          </View>
          <View style={{ height: Sizes.Padding }} />

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
                flex: 0.4,
              }}>
              {'Gender'}
            </Text>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                flex: 0.1,
              }}>
              :
            </Text>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
                flex: 0.5,
              }}>
              {studentData.GENDER == 'M' ? 'Male' : 'Female'}
            </Text>
          </View>
          <View style={{ height: Sizes.Padding }} />

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
                flex: 0.4,
              }}>
              {t('studentListDetails.mobileNumber')}
            </Text>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                flex: 0.1,
              }}>
              :
            </Text>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
                flex: 0.5,
              }}>
              {studentData.MOBILE_NUMBER}
            </Text>
          </View>
          <View style={{ marginTop: Sizes.Base }}>
            <FlatList
              data={feeData}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ marginVertical: Sizes.Base }}>
                    <Text
                      style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
                      {item.HEAD_NAME}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        marginTop: 3,
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            ...Fonts.Regular2,
                            color: Colors.PrimaryText1,
                          }}>
                          {t('studentListDetails.totalFee')}
                        </Text>
                        <Text
                          style={{
                            ...Fonts.Regular2,
                            color: Colors.PrimaryText1,
                          }}>
                          {item.TOTAL_FEE ? item.TOTAL_FEE : 0}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            ...Fonts.Regular2,
                            color: Colors.PrimaryText1,
                          }}>
                          {t('studentListDetails.paidFee')}
                        </Text>
                        <Text
                          style={{
                            ...Fonts.Regular2,
                            color: Colors.PrimaryText1,
                          }}>
                          {item.PAID_FEE ? item.PAID_FEE : 0}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            ...Fonts.Regular2,
                            color: Colors.PrimaryText1,
                          }}>
                          {t('studentListDetails.pendingFee')}
                        </Text>
                        <Text
                          style={{
                            ...Fonts.Regular2,
                            color: Colors.PrimaryText1,
                          }}>
                          {item.PENDING_FEE ? item.PENDING_FEE : 0}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Animated.View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setAddFeeModal(true);
        }}
        style={{
          borderRadius: 23,
          backgroundColor: Colors.Primary2,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-end',
          margin: Sizes.ScreenPadding,
          paddingHorizontal: Sizes.Padding,
          paddingVertical: Sizes.Radius,
        }}>
        <Text
          style={{
            ...Fonts.Medium2,
            alignSelf: 'center',
            textAlign: 'center',
            textAlignVertical: 'center',
            color: Colors.White,
          }}>
          {t('studentListDetails.addFee')}
        </Text>
      </TouchableOpacity>

      {addFeeModal && (
        <AddFeeDetailsModal
          visible={addFeeModal}
          onClose={() => setAddFeeModal(false)}
          feeData={feeData}
          onSuccess={() => {
            setAddFeeModal(false);
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};

export default StudentListDetails;
