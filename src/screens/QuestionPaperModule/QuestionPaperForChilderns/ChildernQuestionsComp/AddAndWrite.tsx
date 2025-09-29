import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ShowAndClickImage from '../../../../Components/ShowAndClickImage';
import Box from '../../../../Components/BoxComponent';
import {Icon} from '../../../../Components';
import {useSelector} from '../../../../Modules';

interface AddAndWriteProps {
  onPress: (data: TileData) => void;
  CopyQuestion?: (data: {KEY: string; QUESTION_DATA: any[]}) => void;
}

interface TileData {
  KEY: string;
  QUESTION_NAME: string;

  QUESTION_DATA: {
    image1: string;
    image2: string;
    image3: string;
    isLongPress: boolean;
    SELECTED_SIGN: string;
  };
}

const AddAndWrite: React.FC<AddAndWriteProps> = ({onPress, CopyQuestion}) => {
  const [tiles, setTiles] = useState<TileData[]>([
    {
      KEY: '1',
      QUESTION_NAME: 'Q1. Add and Write the answers',
      QUESTION_DATA: {
        image1: '',
        image2: '',
        image3: '',
        isLongPress: false,
        SELECTED_SIGN: '+',
      },
    },
  ]);

  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [isLongPress, setIsLongPress] = useState(false);

  const CopyQuestions = () => {
    const imagesArray = [image1, image2, image3, isLongPress];
    CopyQuestion && CopyQuestion({KEY: '1', QUESTION_DATA: imagesArray});
  };

  const CopyTile = (index: number) => {
    const newTile: TileData = {
      KEY: '1',
      QUESTION_DATA: {
        image1,
        image2,
        image3,
        isLongPress,
        SELECTED_SIGN: '+',
      },
      QUESTION_NAME: 'Q1. Add and Write the answers',
    };
    const updatedTiles = [...tiles];
    updatedTiles[index].QUESTION_DATA.isLongPress = false; // Set the fourth element to true
    setTiles(updatedTiles);
    setTiles([...updatedTiles, newTile]);
  };

  const signs = [
    {index: 0, sign: '+'},
    {index: 1, sign: '-'},
    {index: 2, sign: '*'},
    {index: 3, sign: '%'},
  ];

  const changeSign = (index: number) => {
    const currentSignIndex = signs.findIndex(
      item => item.sign === tiles[index].QUESTION_DATA.SELECTED_SIGN,
    ); // Find index of current sign
    const nextSignIndex = (currentSignIndex + 1) % signs.length; // Calculate index of next sign

    const updatedTiles = [...tiles];
    updatedTiles[index].QUESTION_DATA.SELECTED_SIGN = signs[nextSignIndex].sign; // Update SELECTED_SIGN to next sign
    setTiles(updatedTiles);
  };
  const renderItem = ({item, index}: {item: TileData; index: number}) =>
    item.QUESTION_DATA.isLongPress ? (
      <TouchableOpacity
        style={{
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
        }}>
        <Text onPress={() => CopyTile(index)}>Add</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        key={index}
        // onLongPress={() => {
        //   const updatedTiles = [...tiles];
        //   updatedTiles[index].QUESTION_DATA.isLongPress = true; // Set the fourth element to true
        //   setTiles(updatedTiles);
        // }}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
        style={{}}>
        <View
          style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
          }}>
          <Icon
            style={{
              alignSelf: 'flex-end',
              paddingHorizontal: Sizes.Base,
              paddingBottom: Sizes.Base,
            }}
            onPress={() => CopyTile(index)}
            name="copy"
            type="Fontisto"
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <ShowAndClickImage
                onPress={uri => {
                  const updatedTiles = [...tiles];
                  updatedTiles[index].QUESTION_DATA.image1 = uri;
                  setTiles(updatedTiles);
                }}
                ImageStyle={{marginBottom: Sizes.Base}}
                imageUri={item.QUESTION_DATA.image1}
              />

              <Box
                style={{
                  borderWidth: 0.8,
                  borderRadius: 0,
                  borderColor: 'black',
                  width: 70,
                  alignSelf: 'center',
                }}
                value=""
                onChangeText={() => {}}
              />
            </View>
            <View
              style={{
                height: Sizes.Field,
                alignSelf: 'flex-end',
                justifyContent: 'center',
              }}>
              <Text
                onPress={() => {
                  changeSign(index);
                }}
                style={{
                  color: 'black',
                  alignSelf: 'flex-end',
                  fontSize: 20,
                }}>
                {item.QUESTION_DATA.SELECTED_SIGN}
              </Text>
            </View>
            <View>
              <ShowAndClickImage
                ImageStyle={{marginBottom: Sizes.Base}}
                onPress={uri => {
                  const updatedTiles = [...tiles];
                  updatedTiles[index].QUESTION_DATA.image2 = uri;
                  setTiles(updatedTiles);
                }}
                imageUri={item.QUESTION_DATA.image2}
              />
              <Box
                style={{
                  borderWidth: 0.8,
                  borderRadius: 0,
                  borderColor: 'black',
                  width: 70,
                  alignSelf: 'center',
                }}
                value=""
                onChangeText={() => {}}
              />
            </View>
            <View
              style={{
                height: Sizes.Field,
                alignSelf: 'flex-end',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  alignSelf: 'center',
                  fontSize: 20,
                }}>{`=`}</Text>
            </View>
            <View>
              <ShowAndClickImage
                ImageStyle={{marginBottom: Sizes.Base}}
                onPress={uri => {
                  const updatedTiles = [...tiles];
                  updatedTiles[index].QUESTION_DATA.image3 = uri;
                  setTiles(updatedTiles);
                }}
                imageUri={item.QUESTION_DATA.image3}
              />
              <Box
                style={{
                  borderWidth: 0.8,
                  borderRadius: 0,
                  borderColor: 'black',
                  width: 70,
                  alignSelf: 'center',
                }}
                value=""
                onChangeText={() => {}}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

  return (
    <View style={{}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>{tiles[0].QUESTION_NAME}</Text>
        {/* <Icon onPress={CopyQuestions} name="copy" type="Fontisto" /> */}
      </View>

      <FlatList
        data={tiles}
        renderItem={renderItem}
        ItemSeparatorComponent={() => {
          return <View style={{height: Sizes.Base}} />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default AddAndWrite;
