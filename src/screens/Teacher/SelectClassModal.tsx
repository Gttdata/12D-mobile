import {View, Text, FlatList} from 'react-native';
import React from 'react';
import {useSelector} from '../../Modules';
import {Modal} from '../../Components';
import {CLASS_TEACHER_MAPPING} from '../../Modules/interface';

interface Props {
  visible: boolean;
  onClose: () => void;
  data: any;
}
type flatListProps = {
  item: CLASS_TEACHER_MAPPING;
  index: number;
};
const SelectClassModal = ({visible, onClose, data}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  // console.log('data....', data);
  return (
    <Modal
      isVisible={visible}
      onClose={onClose}
      style={{
        paddingLeft: Sizes.ScreenPadding,
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FlatList
          data={data}
          ItemSeparatorComponent={() => <View style={{height: Sizes.Base}} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}: flatListProps) => {
            // console.log('fgxhsj,z.', item);
            return (
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                  marginBottom: Sizes.Base,
                }}>
                {item.CLASS_NAME}
              </Text>
            );
          }}
        />
      </View>
    </Modal>
  );
};

export default SelectClassModal;
