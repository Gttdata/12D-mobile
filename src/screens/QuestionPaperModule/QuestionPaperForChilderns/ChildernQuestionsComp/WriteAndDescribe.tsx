import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from '../../../../Modules';
import ShowAndClickImage from '../../../../Components/ShowAndClickImage';
import {TextInput as TextField} from '../../../../Components';
interface WriteAndDescribe {
  onPress: (data: TileData) => void;
  CopyQuestion?: (data: {KEY: string; QUESTION_DATA: any[]}) => void;
}

interface TileData {
  KEY: string;
  QUESTION_NAME: string;
  QUESTION_DATA: {
    image1: string;
    ANS: string;
    InputQuestions: string;
    isLongPress: boolean;
  };
}
const WriteAndDescribe: React.FC<WriteAndDescribe> = ({
  onPress,
  CopyQuestion,
}) => {
  const [tiles, setTiles] = useState<TileData[]>([
    {
      KEY: '2',
      QUESTION_NAME: 'Q2. Write a sentence to describe the picture',
      QUESTION_DATA: {
        image1: '',
        ANS: '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
        InputQuestions: 'robin The nest is in the',
        isLongPress: false,
      },
    },
  ]);

  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(tiles[0]);
      }}
      style={{flex: 1}}>
      <Text>{tiles[0].QUESTION_NAME}</Text>
      <View style={{borderWidth: 1, padding: Sizes.Base}}>
        <View
          style={{
            flexDirection: 'row',
            height: 130,
          }}>
          <View style={{width: 150}}>
            <ShowAndClickImage
              onPress={uri => {
                const updatedTiles = [...tiles];
                tiles[0].QUESTION_DATA.image1 = uri;
                setTiles(updatedTiles);
              }}
              style={{justifyContent: 'flex-start'}}
              ImageStyle={{width: 150, height: 100, marginTop: Sizes.Base}}
              imageUri={tiles[0].QUESTION_DATA.image1}
            />
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={{
                minHeight: 100,
                textAlign: 'justify',
              }}
              value={tiles[0].QUESTION_DATA.ANS}
              numberOfLines={10}
              onChangeText={() => {}}
              multiline
            />
          </View>
        </View>
        <TextField
          value={tiles[0].QUESTION_DATA.InputQuestions}
          onChangeText={text => {
            setTiles({
              ...tiles,
              [0]: {
                ...tiles[0],
                QUESTION_DATA: {
                  ...tiles[0].QUESTION_DATA,
                  InputQuestions: text,
                },
              },
            });
          }}
          style={{borderWidth: 1, borderColor: Colors.Black}}
        />
      </View>
    </TouchableOpacity>
  );
};

export default WriteAndDescribe;
