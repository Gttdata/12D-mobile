import { View, Text, Touchable, TouchableOpacity, Image, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackProps } from '../../routes';
import { IMAGE_URL, useSelector } from '../../Modules';
import { Header } from '../../Components';
import moment from 'moment';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

type Props = StackProps<'AssignmentDetails'>;
const AssignmentDetails = ({ navigation, route }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAttachmentPress = () => {
    if (item.ATTACMENT) {
      setModalVisible(true);
    }
  };

  const { t } = useTranslation();
  const { item } = route.params;
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label={t('assignmentDetails.header')}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <Animated.ScrollView
        entering={SlideInRight.delay(500).duration(500)}
        exiting={SlideOutLeft}
        style={{ flex: 1, margin: Sizes.ScreenPadding }}

        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginTop: Sizes.Padding,
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
            {t('assignmentDetails.className')}
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
            {item.CLASS_NAME}
          </Text>
        </View>
        <View style={{ height: Sizes.ScreenPadding }} />

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
            {t('assignmentDetails.year')}
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
            {item.YEAR}
          </Text>
        </View>
        <View style={{ height: Sizes.ScreenPadding }} />

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
            {t('assignmentDetails.date')}
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
            {item.DATE}
          </Text>
        </View>
        <View style={{ height: Sizes.ScreenPadding }} />

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
            {t('assignmentDetails.taskType')}
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
            {item.TYPE == 'HW'
              ? 'HomeWork'
              : item.TYPE == 'CW'
                ? 'ClassWork'
                : 'Assignment'}
          </Text>
        </View>
        <View style={{ height: Sizes.ScreenPadding }} />

        {item.SUBJECT_NAME && (
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
              {t('assignmentDetails.subjectName')}
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
              {item.SUBJECT_NAME}
            </Text>
          </View>
        )}
        {item.SUBJECT_NAME && <View style={{ height: Sizes.ScreenPadding }} />}

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
            {t('assignmentDetails.description')}
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
              flex: 0.5,
            }}>
            {item.DESCRIPTION ? item.DESCRIPTION : 'Not mentioned'}
          </Text>
        </View>
        <View style={{ height: Sizes.ScreenPadding }} />

        <TouchableOpacity
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={handleAttachmentPress}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
              flex: 0.4,
            }}>
            {t('assignmentDetails.attachment')}
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
              color: item.ATTACMENT ? 'blue' : Colors.PrimaryText1,
              textDecorationLine: item.ATTACMENT ? 'underline' : 'none',
              textAlign: 'left',
              flex: 0.5,
            }}>
            {item.ATTACMENT ? item.ATTACMENT : 'No Attachment Available'}
          </Text>
        </TouchableOpacity>

        {/* Modal to show the attachment */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '90%',
              height: '80%'
            }}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>Attachment Preview</Text>
              <Image
                source={{ uri: `${IMAGE_URL}/taskAttachment/${item.ATTACMENT}` }}
                style={{ width: '100%', height: '90%', resizeMode: 'contain' }}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  marginTop: 10,
                  alignSelf: 'center',
                  padding: 10,
                  backgroundColor: 'lightgray',
                  borderRadius: 5,
                }}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <View style={{ height: Sizes.ScreenPadding }} />

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
            {t('assignmentDetails.submissionDate')}
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
            {moment(item.SUBMISSION_DATE).format('DD/MMM/YYYY')}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default AssignmentDetails;
