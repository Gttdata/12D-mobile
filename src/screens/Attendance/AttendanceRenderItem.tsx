import {View, Text} from 'react-native';
import React from 'react';
import {ATTENDANCE_LIST} from '../../Modules/interface';
import {useSelector} from '../../Modules';
import {useTranslation} from 'react-i18next';

interface AttendanceRenderItemProps {
  item: ATTENDANCE_LIST;
}

const AttendanceRenderItem: React.FC<AttendanceRenderItemProps> = ({item}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {t} = useTranslation();

  return (
    <View
      style={{
        padding: Sizes.Base,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          color: Colors.PrimaryText1,
          ...Fonts.Medium2,
        }}>
        {`Name : `}
        <Text
          style={{
            color: Colors.PrimaryText1,
            ...Fonts.Medium2,
          }}>{`${item.STUDENT_NAME}`}</Text>
      </Text>
      <Text
        style={{
          color: Colors.PrimaryText1,
          ...Fonts.Medium2,
        }}>
        {`${t('classTeacherAttendance.header')} : ` + item.STATUS == 'A'
          ? t('classTeacherAttendance.absent')
          : item.STATUS == 'P'
          ? t('classTeacherAttendance.present')
          : t('classTeacherAttendance.absent')}
      </Text>
    </View>
  );
};

export default AttendanceRenderItem;
