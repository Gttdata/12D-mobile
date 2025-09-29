import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from '../../../Modules';
import {TextInput} from '../../../Components';
import {QUESTION_TYPE_WISE_LIST} from '../../../Modules/interface2';

interface QuestionCreationRenderItemProps {
  item: QUESTION_TYPE_WISE_LIST;
  SelectOutOfQuestion: (
    OUT_OF_QUESTIONS: number,
    ID: number,
    SELECTED_QUESTIONS: number,
    WANT_TO_ASK_QUESTIONS: number,
  ) => void;
  SelectAskedQuestion: (
    OUT_OF_QUESTIONS: number,
    ID: number,
    SELECTED_QUESTIONS: number,
    WANT_TO_ASK_QUESTIONS: number,
  ) => void;
}

const QuestionCreationRenderItem: React.FC<QuestionCreationRenderItemProps> = ({
  item,
  SelectOutOfQuestion,
  SelectAskedQuestion,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  return (
    <View
      style={{
        padding: Sizes.Padding,
        marginHorizontal: Sizes.Base,
        marginVertical: Sizes.Base,
        backgroundColor: Colors.Background,
        borderRadius: Sizes.Radius,
        elevation: 5,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            ...Fonts.Medium1,
            color: Colors.Black,
            fontSize: 16,
          }}>{`${item.LABEL}`}</Text>
        <Text
          style={{
            ...Fonts.Medium1,
            color: Colors.Black,
            fontSize: 16,
          }}>{`Marks 0 `}</Text>
      </View>
      <Text
        style={{
          ...Fonts.Regular1,
          color: Colors.Black,
          textAlign: 'right',
          fontSize: 14,
        }}>{`${item.questions.length} Questions`}</Text>
      <View style={{height: Sizes.Base}} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <TouchableOpacity
          onPress={() => {
            SelectAskedQuestion(
              item.questions.length,
              item.ID,
              item.OUT_OF_QUESTIONS,
              item.WANT_TO_ASK_QUESTIONS,
            );
          }}
          activeOpacity={1}
          style={{flex: 1}}>
          <TextInput
            label="Ask Questions"
            value={item.WANT_TO_ASK_QUESTIONS.toString()}
            disable
            labelStyle={{...Fonts.Medium1, fontSize: 14}}
            onChangeText={value => {}}
          />
        </TouchableOpacity>
        <View style={{width: Sizes.Padding}} />
        <TouchableOpacity
          onPress={() => {
            SelectOutOfQuestion(
              item.questions.length,
              item.ID,
              item.OUT_OF_QUESTIONS,
              item.WANT_TO_ASK_QUESTIONS,
            );
          }}
          activeOpacity={1}
          style={{flex: 1}}>
          <TextInput
            label="Out Of Questions"
            value={item.OUT_OF_QUESTIONS.toString()}
            disable
            labelStyle={{...Fonts.Medium1, fontSize: 14}}
            onChangeText={value => {}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuestionCreationRenderItem;
