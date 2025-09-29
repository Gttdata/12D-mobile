import React, {useState} from 'react';
import {View, Text, ImageStyle, Image} from 'react-native';
import {BASE_URL} from '../Modules';
import {emptyImg} from '../../assets';

interface CheckImageProps {
  url: string;
  style?: ImageStyle;
}
const CheckImage: React.FC<CheckImageProps> = ({url, style}) => {
  const [error, setError] = useState(false);
  return (
    <Image
      source={error || !url ? emptyImg : {uri: BASE_URL + 'static/' + url}}
      onError={() => {
        setError(true);
      }}
      loadingIndicatorSource={emptyImg}
      style={{...style, tintColor: error || !url ? '#7d7d7d50' : undefined}}
    />
  );
};
export default CheckImage;
