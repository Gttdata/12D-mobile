// SelectedQuestionModal.js

import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Header, Icon, Modal, TextButton} from '../../../Components';
import {apiPost, useSelector} from '../../../Modules';
import {Checkbox} from 'react-native-paper';
import {QUESTION_SERIES} from '../../../Modules/interface';
import CheckImage from '../../../Components/CheckImage';
import {noData} from '../../../../assets';

interface SelectedQuestionModalProps {
  modalVisible: boolean;
  data: QUESTION_SERIES[];
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const CheckedQuestionModal: React.FC<SelectedQuestionModalProps> = ({
  modalVisible,
  setModalVisible,
  data,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [loading, setloading] = useState(false);

  return (
    <Modal
      style={{flex: 1, margin: 0, borderRadius: 0, padding: 0}}
      onClose={() => {
        setModalVisible(false);
      }}
      isVisible={modalVisible}>
      <View style={{flex: 1, backgroundColor: Colors.QuestionPaperBackground}}>
        <Header
          onBack={() => {
            setModalVisible(false);
          }}
          label="Custom Paper"
        />
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          style={{
            padding: Sizes.Padding,
            backgroundColor: Colors.White,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Bold1,
              fontSize: 14,
              color: Colors.Black,
            }}>{`${data.length} Questions Selected`}</Text>
          <Icon
            name="keyboard-arrow-down"
            type="MaterialIcons"
            color={Colors.Black}
            size={30}
            style={{}}
          />
        </TouchableOpacity>
        <View
          style={{
            height: 0,
            borderBottomColor: Colors.BorderColor,
            borderBottomWidth: 0.8,
          }}
        />

        {loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : data.length == 0 ? (
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
          <View style={{flex: 1}}>
            <FlatList
              data={data}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.Primary,
                    paddingVertical: Sizes.Base,
                    margin: Sizes.Base,
                    borderRadius: Sizes.Radius,
                    backgroundColor: Colors.White,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox color={Colors.Primary} status={'checked'} />
                    <Text
                      style={{
                        ...Fonts.Regular1,
                        fontSize: 14,
                        color: Colors.Black,
                        textAlign: 'justify',
                      }}>{`${item.SEQ_NO} .`}</Text>
                    <Text
                      style={{
                        ...Fonts.Regular1,
                        fontSize: 14,
                        color: Colors.Black,
                        flex: 1,
                      }}>{`${item.QUESTION} ?`}</Text>
                  </View>

                  {item.QUESTION_IMAGE ? (
                    <CheckImage
                      url={'itemImages/' + item.QUESTION_IMAGE}
                      style={{
                        height: 50,
                        width: 100,
                        borderRadius: Sizes.Radius,
                        resizeMode: 'contain',
                        marginStart: Sizes.ScreenPadding * 2,
                      }}
                    />
                  ) : null}

                  {item.QuestionOption
                    ? item.QuestionOption.map((option, index) => (
                        <View
                          // key={`${item.SEQ_NO}_${index}`} // Using a combination of SEQ_NO and index
                          style={{
                            marginStart: Sizes.ScreenPadding,
                            flexDirection: 'row',
                            padding: Sizes.Base,
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              ...Fonts.Regular1,
                              fontSize: 14,
                              color: Colors.Black,
                              textAlign: 'justify',
                            }}>
                            {`${option.SEQ_NO} .`}
                          </Text>
                          <Text
                            style={{
                              ...Fonts.Regular1,
                              fontSize: 14,
                              color: Colors.Black,
                              textAlign: 'justify',
                            }}>
                            {`${option.OPTION_TEXT} .`}
                          </Text>
                          {option.OPTION_IMAGE_URL ? (
                            <CheckImage
                              url={'itemImages/' + option.OPTION_IMAGE_URL}
                              style={{
                                height: 50,
                                width: 100,
                                borderRadius: Sizes.Radius,
                                resizeMode: 'contain',
                                marginStart: Sizes.ScreenPadding * 2,
                              }}
                            />
                          ) : null}
                        </View>
                      ))
                    : null}
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CheckedQuestionModal;
