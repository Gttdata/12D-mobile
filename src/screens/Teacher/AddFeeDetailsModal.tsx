import {View, Text, FlatList} from 'react-native';
import React, {useState} from 'react';
import Animated, {SlideInRight, SlideOutLeft} from 'react-native-reanimated';
import {Modal, TextButton, TextInput, Toast} from '../../Components';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {FEE_DETAILS_INTERFACE} from '../../Modules/interface';
import {useTranslation} from 'react-i18next';

interface modalProps {
  visible: boolean;
  onClose: () => void;
  feeData: Array<FEE_DETAILS_INTERFACE>;
  onSuccess: () => void;
}
type flatListProps = {
  item: FEE_DETAILS_INTERFACE;
  index: number;
};
const AddFeeDetailsModal = ({
  visible,
  onClose,
  feeData: initialFeeData,
  onSuccess,
}: modalProps) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {t} = useTranslation();
  const [fee, setFee] = useState('');
  const [feeData, setFeeData] =
    useState<Array<FEE_DETAILS_INTERFACE>>(initialFeeData);
  const [loader, setLoader] = useState({
    loading: false,
    isDone: false,
  });

  const checkValidation = () => {
    if (fee.trim() == '') {
      Toast('Please enter fee');
      return true;
    } else {
      return false;
    }
  };
  const addFeeDetails = async (data: any) => {
    const updateData = data.map((item: FEE_DETAILS_INTERFACE) => {
      return {
        ...item,
      };
    });
    try {
      let body = {
        CLASS_ID: feeData[0].CLASS_ID,
        YEAR_ID: feeData[0].YEAR_ID,
        STUDENT_ID: feeData[0].STUDENT_ID,
        DIVISION_ID: feeData[0].DIVISION_ID,
        feeDetails: updateData,
      };
      const res = await apiPost('api/studentFeeDetails/addBulk', body);
      if (res && res.code == 200) {
        // onSuccess();
        setLoader({...loader, loading: false, isDone: true});
        Toast('Fee add successfully');
      }
    } catch (error) {
      console.log('error...', error);
    }
  };

  const updateFeeData = (txt: any) => {
    if (checkValidation()) {
      return;
    }
    // setFee(txt);
    const inputValue = parseInt(txt) || 0;
    const totalPendingFees = feeData.reduce(
      (total, item) => total + item.PENDING_FEE,
      0,
    );
    if (inputValue > totalPendingFees) {
      Toast('Entered fee is greater than the total sum of pending fees.');
      return;
    }
    setLoader({...loader, loading: true});
    let remainingPayment = inputValue;
    let updatedFeeData = [...feeData];

    for (let i = 0; i < updatedFeeData.length; i++) {
      const item = updatedFeeData[i];
      const remaining = Math.max(0, item.TOTAL_FEE - item.PAID_FEE);
      const paidFeeIncrement = Math.min(remainingPayment, remaining);
      updatedFeeData[i] = {
        ...item,
        PAID_FEE: item.PAID_FEE + paidFeeIncrement,
        PENDING_FEE: item.TOTAL_FEE - (item.PAID_FEE + paidFeeIncrement),
      };

      remainingPayment -= paidFeeIncrement;
      if (remainingPayment === 0) {
        break;
      }
    }
    setFeeData(updatedFeeData);
    addFeeDetails(updatedFeeData);
  };

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <Modal
        title=" "
        isVisible={visible}
        onClose={loader.isDone ? onSuccess : onClose}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          borderRadius: 0,
          width: '100%',
        }}
        containerStyle={{justifyContent: 'flex-end'}}>
        <View>
          <View style={{marginVertical: Sizes.Base}}>
            <FlatList
              data={feeData}
              renderItem={({item, index}: flatListProps) => {
                return (
                  <View style={{marginTop: Sizes.Base}}>
                    <Text
                      style={{...Fonts.Medium2, color: Colors.PrimaryText1}}>
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

          <View
            style={{
              justifyContent: 'center',
              marginTop: Sizes.Base,
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
              }}>
              {`${t('studentListDetails.addFee')} :`}
            </Text>
            <TextInput
              onChangeText={txt => {
                setFee(txt);
                // updateFeeData(txt);
              }}
              value={fee}
              keyboardType="number-pad"
              placeholder={t('studentListDetails.addFee')}
              maxLength={7}
            />
          </View>

          {/* Button */}
          <TextButton
            label={t('common.add')}
            loading={loader.loading}
            onPress={() => {
              updateFeeData(fee);
            }}
            style={{marginTop: Sizes.Padding * 2}}
          />
        </View>
      </Modal>
    </Animated.View>
  );
};

export default AddFeeDetailsModal;
