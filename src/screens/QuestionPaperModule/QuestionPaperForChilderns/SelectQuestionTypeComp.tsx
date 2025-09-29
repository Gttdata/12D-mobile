import React from 'react';
import {View, ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import {Modal, TextInput} from '../../../Components';
import {useSelector} from '../../../Modules';
import {noData} from '../../../../assets';
import AddAndWrite from './ChildernQuestionsComp/AddAndWrite';
import ShowAndClickImage from '../../../Components/ShowAndClickImage';
import WriteAndDescribe from './ChildernQuestionsComp/WriteAndDescribe';
interface SelectQuestionTypeComp {
  isVisible: boolean;
  setData: React.Dispatch<React.SetStateAction<Question[]>>;
  Data: Question[]; // Corrected type definition
  onClose: () => void;
}

interface Question {
  QUESTION_NAME: string;
  KEY: string;
  QUESTION_TYPE: string;
  index: number;
  QUESTION_DATA: any[];
  // Add any other properties you need
}
const SelectQuestionTypeComp = ({
  isVisible,
  onClose,
  setData,
  Data,
}: SelectQuestionTypeComp) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  return (
    <Modal
      style={{
        margin: 0,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        borderRadius: 0,
        borderTopRightRadius: Sizes.ScreenPadding,
        borderTopLeftRadius: Sizes.ScreenPadding,
        maxHeight: Sizes.Height / 2,
      }}
      isVisible={isVisible}
      onClose={onClose}>
      <View style={{}}>
        <View
          style={{
            width: 70,
            height: 4,
            borderRadius: 2,
            backgroundColor: Colors.Primary2,
            marginTop: -5,
            alignSelf: 'center',
          }}></View>

        <ScrollView
          contentContainerStyle={{}}
          style={{marginTop: Sizes.Padding}}>
          <AddAndWrite
            onPress={data => {
              setData([
                ...Data,
                {
                  QUESTION_NAME: '', // Set appropriate values
                  KEY: data.KEY,
                  QUESTION_TYPE: '',
                  index: 0,
                  QUESTION_DATA: data.QUESTION_DATA,
                  // Add any other properties you need
                },
              ]);
              onClose();
            }}
          />
          <WriteAndDescribe
            onPress={data => {
              setData([
                ...Data,
                {
                  QUESTION_NAME: '', // Set appropriate values
                  KEY: data.KEY,
                  QUESTION_TYPE: '',
                  index: 0,
                  QUESTION_DATA: data.QUESTION_DATA,
                  // Add any other properties you need
                },
              ]);
              onClose();
            }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default SelectQuestionTypeComp;
