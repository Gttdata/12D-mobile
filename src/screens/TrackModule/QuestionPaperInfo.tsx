import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Modal} from '../../Components';
import {questionPaperInfo} from '../../../assets';
import {useSelector} from '../../Modules';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuestionPaperInfoProps {
  onClose: () => void;
  onOpen: () => void;
}
const QuestionPaperInfo: React.FC<QuestionPaperInfoProps> = ({
  onClose,
  onOpen,
}) => {
  useEffect(() => {
    AsyncStorage.setItem('QuestionPaperShown', 'true');
  }, []);
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <Modal
      isVisible={true}
      onClose={onClose}
      title=" "
      style={{alignItems: 'center'}}>
      <Image
        source={questionPaperInfo}
        style={{width: Sizes.Width * 0.5, height: Sizes.Width * 0.5}}
      />
      <Text style={{...Fonts.Bold1, color: Colors.Primary}}>
        {'Question Paper'}
      </Text>
      <Text style={{...Fonts.Regular3, color: Colors.PrimaryText}}>
        {
          'Create custom question papers effortlessly with our Question Paper Generator! Select the class, board, medium, and division to instantly generate tailored, ready-to-use question papers—saving time and simplifying assessments for educators.'
        }
      </Text>
    </Modal>
  );
};
export default QuestionPaperInfo;
const styles = StyleSheet.create({});
