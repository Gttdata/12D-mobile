import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Icon, Modal, TextButton, Toast } from '../../Components';
import { BASE_URL, apiPut, useSelector } from '../../Modules';
import { STUDENT_TASK_DATA_INTERFACE } from '../../Modules/interface';
import moment from 'moment';
import ImageView from 'react-native-image-viewing';
import { useTranslation } from 'react-i18next';

interface modalProps {
  visible: boolean;
  onClose: () => void;
  item: STUDENT_TASK_DATA_INTERFACE | any;
  onSuccess: () => void;
}
const TaskDetailsModal = ({ visible, onClose, item, onSuccess }: modalProps) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { t } = useTranslation();
  const [openImage, setOpenImage] = useState(false);
  const [loader, setLoader] = useState({
    complete: false,
    pending: false,
  });

  const updateTaskStatus = async (status: string) => {
    try {
      const res = await apiPut('api/studentTaskDetails/update', {
        ...item,
        STATUS: status,
        COMPLETION_DATE_TIME:
          status == 'C'
            ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            : null,
      });
      if (res && res.code == 200) {
        onSuccess();
      } else {
        Toast('Something Wrong..please try again');
      }
    } catch (error) { }
  };

  return (
    <View>
      <Modal
        isVisible={visible}
        onClose={onClose}
        animation="slide"
        style={{
          paddingLeft: Sizes.Padding,
        }}
        containerStyle={{
          justifyContent: 'center',
          flex: 1,
        }}>
        {/* ✅ Added ScrollView */}
        <ScrollView
          contentContainerStyle={{
            padding: 10,
            paddingTop: Sizes.Base,
            paddingBottom: Sizes.ScreenPadding,
          }}
          showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
              }}>
              {`Assigned By : ${item.TEACHER_NAME}`}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {item.SUBJECT_NAME && (
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                }}>
                {`${t('studentTask.subjectName')} : ${item.SUBJECT_NAME}`}
              </Text>
            )}
          </View>

          <Text
            style={{
              ...Fonts.Regular2,
              color: Colors.PrimaryText1,
              marginTop: Sizes.Base,
            }}>
            {`${t('studentTask.type')} : ${item.TYPE == 'CW'
                ? 'ClassWork'
                : item.TYPE == 'HW'
                  ? 'HomeWork'
                  : 'Assignment'
              }`}
          </Text>

          <Text
            style={{
              ...Fonts.Regular2,
              color: Colors.Black,
              marginTop: Sizes.Base,
            }}>
            {`Assigned Date : `}
            <Text
              style={{
                ...Fonts.Regular2,
                color: Colors.PrimaryText,
              }}>
              {moment(item.ASSIGNED_DATE).format('DD/MMM/YYYY')}
            </Text>
          </Text>

          <Text
            style={{
              ...Fonts.Regular2,
              color: Colors.Black,
              marginTop: Sizes.Base,
            }}>
            {`${t('studentTask.task')} : `}
            <Text
              style={{
                ...Fonts.Regular2,
                color: Colors.PrimaryText1,
              }}>
              {item.TASK}
            </Text>
          </Text>

          {item.ATTACMENT && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setOpenImage(true)}
              style={{
                width: 100,
                height: 60,
                borderRadius: Sizes.Radius,
                marginTop: Sizes.Base,
              }}>
              <Image
                source={{
                  uri: BASE_URL + 'static/taskAttachment/' + item.ATTACMENT,
                }}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: Sizes.Radius,
                }}
              />
            </TouchableOpacity>
          )}

          <Text
            style={{
              ...Fonts.Regular2,
              color: Colors.Black,
              marginTop: Sizes.Base,
            }}>
            {`${t('studentTask.submissionDate')} : `}
            <Text
              style={{
                ...Fonts.Regular2,
                color: Colors.PrimaryText,
              }}>
              {moment(item.SUBMISSION_DATE).format('DD/MMM/YYYY')}
            </Text>
          </Text>

          {item.STATUS == 'C' && (
            <Text
              style={{
                ...Fonts.Regular2,
                color: Colors.Black,
                marginTop: Sizes.Base,
              }}>
              {`${t('studentTask.completedDate')} : `}
              <Text
                style={{
                  ...Fonts.Regular2,
                  color: Colors.PrimaryText,
                }}>
                {moment(item.COMPLETION_DATE_TIME).format('DD/MMM/YYYY')}
              </Text>
            </Text>
          )}

          {item.TYPE != 'CW' && item.STATUS != 'C' && (
            <View
              style={{ flexDirection: 'row', marginTop: Sizes.ScreenPadding }}>
              <TextButton
                label={`${t('common.Cancel')}`}
                loading={false}
                onPress={onSuccess}
                isBorder={true}
                style={{ flex: 0.5 }}
              />
              <View style={{ width: Sizes.Radius }} />
              <TextButton
                label={`Complete`}
                loading={loader.complete}
                onPress={() => {
                  setLoader({ ...loader, complete: true });
                  updateTaskStatus('C');
                }}
                style={{ flex: 0.5 }}
              />
            </View>
          )}
        </ScrollView>
      </Modal>

      <ImageView
        images={[
          {
            uri: BASE_URL + 'static/taskAttachment/' + item.ATTACMENT,
          },
        ]}
        imageIndex={0}
        visible={openImage}
        onRequestClose={() => setOpenImage(false)}
      />
    </View>
  );
};

export default TaskDetailsModal;
