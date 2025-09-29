import {View, Text, FlatList} from 'react-native';
import React from 'react';
import {useSelector} from '../../Modules';
import {Modal} from '../../Components';
import {YEAR} from '../../Modules/interface';

interface Props {
  visible: boolean;
  onClose: () => void;
  data: any;
}
type flatListProps = {
  item: YEAR;
  index: number;
};
const SelectYearModal = ({visible, onClose, data}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
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
            return (
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                  marginBottom: Sizes.Base,
                }}>
                {item.YEAR}
              </Text>
            );
          }}
        />
      </View>
    </Modal>
  );
};

export default SelectYearModal;
