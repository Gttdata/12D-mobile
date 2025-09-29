import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import {BASE_URL, apiPost, useSelector} from '../../Modules';
import {Icon, Modal, TextButton} from '../../Components';
import {
  STUDENT_CLASS_MAPPING,
  STUDENT_LIST_INTERFACE,
} from '../../Modules/interface';
import {noProfile} from '../../../assets';

type Data = STUDENT_CLASS_MAPPING | STUDENT_LIST_INTERFACE;
interface modalProps {
  visible: boolean;
  onClose: () => void;
  data: STUDENT_LIST_INTERFACE;
  type: string;
  onSuccess: () => void;
}
const StudentDetailsModal = ({
  visible,
  onClose,
  data,
  type,
  onSuccess,
}: modalProps) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [loading, setLoading] = useState(false);
  // 7757895323
  // local student = 87483743304 teacher = 9999977777
  // api/student/approveReject

  const approveStudent = async () => {
    setLoading(true);
    try {
      const body = {
        ...data,
        STUDENT_STATUS: 'A',
      };
      const res = await apiPost('api/student/approveReject', body);
      if (res && res.code == 200) {
        setLoading(false);
        onSuccess();
      }
    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };
  return (
    <Modal
      title={''}
      isVisible={visible}
      onClose={onClose}
      style={{
        margin: 0,
        marginLeft: Sizes.ScreenPadding,
        borderRadius: Sizes.Radius,
        width: '90%',
      }}>
      <View
        style={{
          paddingVertical: Sizes.Base,
        }}>
        {/* Top Part */}
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.3, alignItems: 'center'}}>
            <Image
              source={
                data.PROFILE_PHOTO
                  ? {
                      uri:
                        BASE_URL +
                        'static/studentProfile/' +
                        data.PROFILE_PHOTO,
                    }
                  : noProfile
              }
              style={{
                height: 76,
                width: 76,
                borderRadius: 38,
              }}
            />
          </View>
          <View style={{flex: 0.7, marginLeft: Sizes.Padding}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...Fonts.Bold2, color: Colors.Primary}}>
                {type == 'A' ? data.NAME : data.STUDENT_NAME}
              </Text>
              <Icon
                name="check"
                type="AntDesign"
                size={20}
                style={{marginLeft: Sizes.Base}}
              />
            </View>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                marginLeft: 3,
              }}>
              {data.ID}
            </Text>
            <Text
              style={{
                ...Fonts.Medium3,
                fontSize: 14,
                color: Colors.PrimaryText,
                marginLeft: 3,
              }}>
              {type == 'A' ? data.TEMP_ROLL_NO : data.ROLL_NUMBER}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: Colors.PrimaryText1,
            marginVertical: Sizes.ScreenPadding,
          }}
        />
        {/* Middle Part */}
        <View style={{marginHorizontal: Sizes.Padding * 2}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="cake-variant-outline"
              type="MaterialCommunityIcons"
              size={27}
              style={{flex: 0.2, marginLeft: -3}}
            />
            <Text
              selectable={true}
              style={{...Fonts.Medium2, flex: 0.8, color: Colors.PrimaryText1}}>
              {data.DOB}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: Sizes.Radius,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="mail" type="Feather" size={23} style={{flex: 0.2}} />
            <Text
              style={{...Fonts.Medium2, flex: 0.8, color: Colors.PrimaryText1}}>
              {data.EMAIL_ID}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: Sizes.Radius,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="call"
              type="MaterialIcons"
              size={23}
              style={{flex: 0.2}}
            />
            <Text
              selectable={true}
              style={{...Fonts.Medium2, flex: 0.8, color: Colors.PrimaryText1}}>
              {data.MOBILE_NUMBER}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: Sizes.Radius,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="mars"
              type="FontAwesome"
              size={21}
              style={{flex: 0.2, marginLeft: 3}}
            />
            <Text
              style={{...Fonts.Medium2, flex: 0.8, color: Colors.PrimaryText1}}>
              {data.GENDER == 'M' ? 'Male' : 'Female'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: Sizes.Radius,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="users" type="Feather" size={23} style={{flex: 0.2}} />
            <Text
              style={{...Fonts.Medium2, flex: 0.8, color: Colors.PrimaryText1}}>
              {type == 'A' ? data.TEMP_CLASS_NAME : data.CLASS_NAME}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: Colors.PrimaryText1,
            marginVertical: Sizes.ScreenPadding,
          }}
        />
        {/* bottom part */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            // alignItems: 'center',
            marginLeft: Sizes.Padding * 2,
            marginRight: Sizes.Padding,
          }}>
          <Icon name="map-pin" type="Feather" size={25} style={{flex: 0.2}} />
          <Text
            textBreakStrategy="balanced"
            style={{
              ...Fonts.Medium2,
              flex: 0.8,
              color: Colors.PrimaryText1,
              marginLeft: -Sizes.Base,
            }}>
            {data.ADDRESS ? data.ADDRESS : 'Not mentioned'}
          </Text>
        </View>

        {/* button */}
        <TextButton
          label={type == 'A' ? 'Approve the student' : 'Close'}
          loading={loading}
          onPress={() => {
            type == 'A' ? approveStudent() : onClose();
          }}
          style={{marginTop: Sizes.ScreenPadding}}
        />
      </View>
    </Modal>
  );
};

export default StudentDetailsModal;
