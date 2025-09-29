import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from '../../Modules';
import {Header} from '../../Components';
import {StackProps} from '../../routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
  {name: 'common.english', code: 'en'},
  {name: 'common.marathi', code: 'mar'},
];
type Props = StackProps<'Settings'>;
const Settings = ({navigation}: Props): JSX.Element => {
  const {Colors, Sizes, Fonts} = useSelector(state => state.app);
  const [showLanguagesList, setOpenLanguagesList] = useState(false);

  const {t, i18n} = useTranslation();

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label={(t("Setting.Setting"))}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <TouchableNativeFeedback
        onPress={() => {
          setOpenLanguagesList(!showLanguagesList);
          LayoutAnimation.configureNext(
            LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'),
          );
        }}>
        <View style={styles.button}>
          <Text style={{color: 'red'}}>{t('common.changeLanguage')}</Text>
        </View>
      </TouchableNativeFeedback>
      {showLanguagesList && (
        <>
          {languages.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, {paddingHorizontal: 24}]}
              onPress={() => {
                changeLanguage(item.code);
              }}>
              <Text style={{color: 'red'}}>{t(item.name)}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 28,
    color: 'red',
  },
});