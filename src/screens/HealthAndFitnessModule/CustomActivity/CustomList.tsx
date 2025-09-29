import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from '../../../Modules';
import {Header} from '../../../Components';

const CustomList = ({navigation}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label="Customized Activities"
        onBack={() => navigation.goBack()}></Header>
      <Text>CustomList</Text>
    </View>
  );
};

export default CustomList;
