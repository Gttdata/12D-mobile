import React, {useState} from 'react';
import {View, Text, ImageStyle, Image} from 'react-native';
import {BASE_URL} from '../Modules';
import {emptyImg, noData} from '../../assets';

interface CheckImageProps {
  url: string;
  style?: ImageStyle;
}
const CheckImage2: React.FC<CheckImageProps> = ({url, style}) => {
  const [error, setError] = useState(false);
  return (
    <Image
      source={error || !url ? noData : {uri: url}}
      onError={() => {
        setError(true);
      }}
      loadingIndicatorSource={noData}
      style={{...style, tintColor: error || !url ? '#7d7d7d50' : undefined}}
    />
  );
};
export default CheckImage2;
