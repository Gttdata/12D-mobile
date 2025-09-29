import {View, Text, Image} from 'react-native';
import React from 'react';
import {StackProps} from '../../routes';
import {useSelector} from '../../Modules';
import {Header} from '../../Components';
import {comingSoon} from '../../../assets';

type Props = StackProps<'HelpAndSupport'>;
const HelpAndSupport = ({navigation}: Props) => {
  const {Colors, Sizes, Fonts} = useSelector(state => state.app);
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label="Help And Support"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={comingSoon}
          style={{
            height: 150,
            width: 150,
          }}
        />
      </View>
    </View>
  );
};

export default HelpAndSupport;
