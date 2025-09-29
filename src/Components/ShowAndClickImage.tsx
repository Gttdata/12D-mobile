import React from 'react';
import {
  TouchableOpacity,
  Image,
  Alert,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'; // Import image picker library
import {noData} from '../../assets';
import {useSelector} from '../Modules';

interface ShowAndClickImageProps {
  imageUri: string | null;
  style?: ViewStyle;
  ImageStyle?: ImageStyle;
  onPress: (uri: string) => void; // Callback function for onPress event
}

const ShowAndClickImage: React.FC<ShowAndClickImageProps> = ({
  imageUri,
  onPress,
  style,
  ImageStyle,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  const openImagePicker = () => {
    Alert.alert(
      'Select Image Source',
      'Choose the source of the image',
      [
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const openGallery = async () => {
    try {
      const selectedImage = await ImagePicker.openPicker({
        mediaType: 'photo',
      });
      onPress(selectedImage.path); // Call onPress with the selected image URI
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const openCamera = async () => {
    try {
      const capturedImage = await ImagePicker.openCamera({
        mediaType: 'photo',
      });
      onPress(capturedImage.path); // Call onPress with the captured image URI
    } catch (error) {
      console.log('Error capturing image:', error);
    }
  };

  return (
    <TouchableOpacity style={{flex: 1, ...style}} onPress={openImagePicker}>
      <Image
        source={imageUri ? {uri: imageUri} : noData}
        style={{
          width: 100,
          height: 100,
          borderRadius: Sizes.Radius,
          ...ImageStyle,
        }}
      />
    </TouchableOpacity>
  );
};

export default ShowAndClickImage;
