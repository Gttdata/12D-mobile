import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from '../../../Modules';
import {Header, Icon, Modal} from '../../../Components';
import {CHAPTER_LIST, QUESTION_TYPE} from '../../../Modules/interface';
import {Checkbox} from 'react-native-paper';

interface CustomPaperRenderItemProps {
  item: CHAPTER_LIST;
  isSelected: number[];
  SelectChap: (chapterId: number) => void;
}
const CreateQuestionsRenderItem: React.FC<CustomPaperRenderItemProps> = ({
  item,
  isSelected,
  SelectChap,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const handlePress = () => {
    SelectChap(item.CHAPTER_ID);
  };
  return (
    <View
      style={{
        borderRadius: Sizes.Radius,
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          flexDirection: 'row',
          margin: Sizes.Base,
          padding: Sizes.Padding,
          backgroundColor: Colors.White,
          borderRadius: Sizes.Radius,
          elevation: 3,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View style={{flex: 0.9}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{...Fonts.Bold1, fontSize: 16, color: Colors.Black}}>
              {`Chap ${item.CHAPTER_ID}`}
            </Text>
          </View>
          <Text>{item.CHAPTER_NAME}</Text>
        </View>
        <View style={{width: Sizes.Base}} />
        <View
          style={{
            justifyContent: 'center',
            flex: 0.1,
          }}>
          <Checkbox
            status={
              isSelected.includes(item.CHAPTER_ID) ? 'checked' : 'unchecked'
            }
            color={Colors.Primary}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CreateQuestionsRenderItem;
