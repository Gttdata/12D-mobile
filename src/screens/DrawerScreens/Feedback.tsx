import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from '../../Modules';
import {Header, Icon, TextButton, TextInput} from '../../Components';
import {StackProps} from '../../routes';
type Props = StackProps<'Feedback'>;
const Feedback = ({navigation}: Props) => {
  const {Colors, Sizes, Fonts} = useSelector(state => state.app);
  const [feedback, setFeedback] = useState({
    message: '',
    loading: false,
  });
  const [selectedEmoji, setSelectedEmoji] = useState({
    selected: true,
    data: 'Excelent',
  });

  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header label="Feedback" onBack={() => navigation.goBack()}></Header>
      <View style={{flex: 1, margin: Sizes.ScreenPadding}}>
        <Text
          style={{
            color: Colors.PrimaryText1,
            ...Fonts.Medium2,
            textAlign: 'center',
            marginBottom: Sizes.Padding,
          }}>
          Time is most valuable resource.We are here to get this right for you.
        </Text>

        <View
          style={{
            alignContent: 'center',
            flexDirection: 'row',
            // width: '100%',

            alignSelf: 'center',
            alignItems: 'center',
            //  justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setSelectedEmoji({selected: true, data: 'Excelent'})}
            style={{flex: 1, alignItems: 'center'}}>
            <Icon
              name="smiley"
              type="Fontisto"
              size={40}
              color={
                selectedEmoji.data == 'Excelent' && selectedEmoji.selected
                  ? Colors.Primary
                  : Colors.Primary2+99
              }></Icon>
            <Text
              style={{
                marginTop: Sizes.Base,
                color:
                  selectedEmoji.selected && selectedEmoji.data == 'Excelent'
                    ? Colors.Primary
                    : Colors.PrimaryText1,
                ...Fonts.Medium3,
              }}>
              Excellent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedEmoji({selected: true, data: 'Good'})}
            style={{flex: 1, alignItems: 'center'}}>
            <Icon
              color={
                selectedEmoji.data == 'Good' && selectedEmoji.selected ? Colors.Primary : Colors.Primary2+99
              }
              name="slightly-smile"
              type="Fontisto"
              size={40}></Icon>
            <Text
              style={{
                marginTop: Sizes.Base,
                color:
                  selectedEmoji.selected && selectedEmoji.data == 'Good'
                    ? Colors.Primary
                    : Colors.PrimaryText1,
                ...Fonts.Medium3,
              }}>
              Good
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedEmoji({selected: true, data: 'Medium'})}
            style={{flex: 1, alignItems: 'center'}}>
            <Icon
              color={
                selectedEmoji.data == 'Medium' && selectedEmoji.selected
                  ? Colors.Primary
                  : Colors.Primary2+99
              }
              name="neutral"
              type="Fontisto"
              size={40}></Icon>
            <Text
              style={{
                marginTop: Sizes.Base,
                color:
                  selectedEmoji.selected && selectedEmoji.data == 'Medium'
                    ? Colors.Primary
                    : Colors.PrimaryText1,

                ...Fonts.Medium3,
              }}>
              Medium
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedEmoji({selected: true, data: 'Poor'})}
            style={{flex: 1, alignItems: 'center'}}>
            <Icon
              color={
                selectedEmoji.data == 'Poor' && selectedEmoji.selected ? Colors.Primary : Colors.Primary2+99
              }
              name="expressionless"
              type="Fontisto"
              size={40}></Icon>
            <Text
              style={{
                marginTop: Sizes.Base,
                color:
                  selectedEmoji.selected && selectedEmoji.data == 'Poor'
                    ? Colors.Primary
                    : Colors.PrimaryText1,

                ...Fonts.Medium3,
              }}>
              Poor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedEmoji({selected: true, data: 'bad'})}
            style={{flex: 1, alignItems: 'center'}}>
            <Icon 
              color={
                selectedEmoji.data == 'bad' && selectedEmoji.selected ? Colors.Primary : Colors.Primary2+99
              }
              name="frowning"
              type="Fontisto"
              size={40}></Icon>
            <Text
              style={{
                marginTop: Sizes.Base,
                color:
                  selectedEmoji.selected && selectedEmoji.data == 'bad'
                    ? Colors.Primary
                    : Colors.PrimaryText1,

                ...Fonts.Medium3,
              }}>
              Very bad
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          labelStyle={{marginTop: Sizes.Padding}}
          label="Feedback"
          style={{}}
          onChangeText={(txt) => {setFeedback({...feedback,message:txt})}}
          value={feedback.message}
          multiline
          placeholder="Great App..."></TextInput>
      </View>
      <View style={{margin: Sizes.ScreenPadding}}>
        <TextButton
          label="Send Feedback"
          loading={feedback.loading}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default Feedback;
