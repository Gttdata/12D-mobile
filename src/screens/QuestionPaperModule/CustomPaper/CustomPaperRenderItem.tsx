import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from '../../../Modules';
import {Header, Icon, Modal} from '../../../Components';
import {QUESTION_TYPE} from '../../../Modules/interface';

interface CustomPaperRenderItemProps {
  item: QUESTION_TYPE;
  isSelected: number | null;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setQuestionType: React.Dispatch<React.SetStateAction<number>> | any;
  setQuestionTypeName: React.Dispatch<React.SetStateAction<string>>;
  setIsQuestionSelected: React.Dispatch<React.SetStateAction<number[]>>;
  SelectChap: (chapterId: number | null) => void;
  SelectChapItem: any;
}
const CustomPaperRenderItem: React.FC<CustomPaperRenderItemProps> = ({
  item,
  isSelected,
  setModalVisible,
  SelectChap,
  SelectChapItem,
  setQuestionType,
  setQuestionTypeName,
  setIsQuestionSelected,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  let totalSelectedCount = 0;
  item.QUESTIONS.forEach(item => {
    if (Array.isArray(item.IS_QUESTION_SELECTED)) {
      totalSelectedCount += item.IS_QUESTION_SELECTED.length;
    }
  });
  // console.log('item...', item.QUESTIONS[0].SELECTED_QUESTIONS);
  return (
    <View
      style={{
        borderRadius: Sizes.Radius,
        justifyContent: 'space-between',
        backgroundColor: Colors.White,
        marginVertical: Sizes.Base,
        marginHorizontal: 3,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={async () => {
          await SelectChapItem(item);
          await SelectChap(item.CHAPTER_ID);
          // await setModalVisible(true);
        }}
        style={{
          flexDirection: 'row',
          marginBottom: isSelected == item.CHAPTER_ID ? Sizes.Base : 0,
          padding: Sizes.Radius,
          backgroundColor: Colors.White,
          borderRadius: Sizes.Radius,
          elevation: 3,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View style={{flex: 0.9}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                ...Fonts.Bold1,
                fontSize: 16,
                color: Colors.PrimaryText1,
                marginLeft: Sizes.Base,
              }}>
              {`${item.CHAPTER_ID}   ${item.CHAPTER_NAME}`}
            </Text>
          </View>
        </View>
        <View style={{width: Sizes.Base}} />
        <View
          style={{
            justifyContent: 'center',
            flex: 0.1,
          }}>
          <Icon
            name={
              isSelected == item.CHAPTER_ID
                ? 'chevron-small-up'
                : 'chevron-small-down'
            }
            type="Entypo"
            size={30}
            color={Colors.Primary}
            style={{alignSelf: 'flex-start'}}
          />
        </View>
      </TouchableOpacity>

      {isSelected == item.CHAPTER_ID ? (
        <View
          style={{
            marginHorizontal: Sizes.Base,
            paddingHorizontal: Sizes.Padding,
            backgroundColor: Colors.White,
            borderRadius: Sizes.Base,
            borderBottomRightRadius: Sizes.Radius,
            borderBottomLeftRadius: Sizes.Radius,
          }}>
          <FlatList
            data={item.QUESTIONS}
            keyExtractor={question => question.QUESTION_TYPE}
            renderItem={({item: question, index}) => (
              <TouchableOpacity
                onLongPress={() => {}}
                onPress={() => {
                  setQuestionType(parseInt(question.QUESTION_TYPE));
                  setQuestionTypeName(question.QUESTION_TYPE_NAME);
                  if (
                    question.IS_QUESTION_SELECTED &&
                    question.IS_QUESTION_SELECTED.length > 0
                  ) {
                    setIsQuestionSelected(question.IS_QUESTION_SELECTED);
                  }
                  setModalVisible(true);
                }}
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: item.QUESTIONS.length - 1 == index ? 0 : 1,
                  borderBottomColor: Colors.Primary,
                  paddingVertical: Sizes.Base,
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      ...Fonts.Medium1,
                      fontSize: 14,
                      color: Colors.PrimaryText1,
                    }}>{`${question.QUESTION_TYPE}. `}</Text>
                  <Text
                    style={{
                      ...Fonts.Medium1,
                      fontSize: 14,
                      color: Colors.PrimaryText1,
                    }}>{`${question.QUESTION_TYPE_NAME}`}</Text>
                </View>

                <Text
                  style={{
                    ...Fonts.Medium1,
                    fontSize: 14,
                    color: Colors.PrimaryText1,
                    marginEnd: Sizes.ScreenPadding,
                  }}>{`  ${
                  question.IS_QUESTION_SELECTED.length < 10
                    ? '0' + question.IS_QUESTION_SELECTED.length
                    : question.IS_QUESTION_SELECTED.length
                }`}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
    </View>
  );
};

export default CustomPaperRenderItem;
