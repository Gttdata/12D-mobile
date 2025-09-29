import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {Modal, TextButton} from '../../Components';
import {trackInfo} from '../../../assets';
import {useSelector} from '../../Modules';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TrackInfoProps {
  onClose: () => void;
}
const TrackInfo: React.FC<TrackInfoProps> = ({onClose}) => {
  useEffect(() => {
    AsyncStorage.setItem('InfoSlideShown', 'true');
  }, []);
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <Modal
      isVisible={true}
      onClose={onClose}
      title=" "
      style={{
        alignItems: 'center',
        margin: 0,
        height: '100%',
        borderRadius: 0,
      }}>
      <Image
        source={trackInfo}
        style={{
          width: Sizes.Width * 0.5,
          height: Sizes.Width * 0.6,
          marginBottom: -Sizes.ScreenPadding * 2,
          marginTop: -Sizes.ScreenPadding,
        }}
      />
      <Text
        style={{
          ...Fonts.Bold1,
          color: Colors.Primary,
          marginBottom: Sizes.Padding,
        }}>
        {'Task Book'}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText1,
            textAlign: 'justify',
            fontSize: 12,
          }}>
          Task book is a unique premium feature of this app which encourages
          users for a disciplined lifestyle, personal growth, and holistic
          self-development. It provides a curated collection of age-appropriate
          tasks and challenges (from child to adult) to overcome their
          weaknesses scattered within 12 life dimensions like physical,
          psychological, spiritual, intellectual, occupational, environmental,
          technological, financial, social, parental, ethical, and habitual.
        </Text>
        <Text
          style={{
            ...Fonts.Medium3,
            color: Colors.PrimaryText1,
            textAlign: 'justify',
            marginTop: Sizes.Base,
            marginBottom: Sizes.Padding,
            fontSize: 12,
          }}>
          Task book begins with a specific questionnaire in each life dimension,
          helping users assess their current state and needs. Users can select a
          single dimension or answer questionnaires from multiple dimensions.
          Based on the strengths and weaknesses detected in their answers,
          special tasks and challenges are recommended to guide their growth and
          development. Users must select a minimum of 5 tasks or at least 1
          challenge from the list of tasks. They also need to select a locked,
          incomplete animation video containing various hidden virtual rewards.
          Completing the selected tasks sincerely unlocks several reward pieces
          that gradually build a unique animation video with a social message.
          Users must complete all selected tasks to unlock the full animated
          video. Only upon completing all tasks is the full animation revealed,
          celebrating the user's progress and achievements. The revealed
          animation also creates social awareness among users about current
          burning social issues.
        </Text>
      </ScrollView>
      <TextButton label="Got it" loading={false} onPress={onClose} />
    </Modal>
  );
};
export default TrackInfo;
const styles = StyleSheet.create({});
