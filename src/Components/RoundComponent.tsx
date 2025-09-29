import {View, Text} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from '../Modules';
import {Approved} from '../../assets';

interface SubjectScreen {
  onBack?: () => void;
  ImageProp?: any;
  Subject: string;
}
const RoundCompo: React.FC<SubjectScreen> = ({ImageProp, Subject}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Background,
        }}>
        {ImageProp ? ImageProp : null}
        <Approved />
      </TouchableOpacity>
      <View style={{height: Sizes.Base}} />
      <Text
        style={{
          ...Fonts.Bold3,
          color: 'black',
          textAlign: 'center',
        }}>
        {Subject}
      </Text>
    </View>
  );
};

export default SubjectScreen;
