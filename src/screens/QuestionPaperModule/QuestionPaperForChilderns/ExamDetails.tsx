import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from '../../../Modules';
import {Header, Icon, TextButton, TextInput, Toast} from '../../../Components';
import {StackProps} from '../../../routes';
import {useTranslation} from 'react-i18next';
import TitleComponent from '../../../Components/TitleComponent';
import moment from 'moment';
import DatePicker from '../../../Components/DatePicker';
import {TimeLogo} from '../../../../assets';
import {BOARD_SUBJECT_INTERFACE} from '../../../Modules/interface2';
type Props = StackProps<'ExamDetails'>;
type dataState = {
  Time: string;
  TotalMarks: string;
  Date: string;
  TestName: string;
  InstituteName: string;
  Medium: string;
  PaperFormat: any[];
  SUBJECT_SELECTED: BOARD_SUBJECT_INTERFACE;
};
const ExamDetails: React.FC<Props> = ({navigation}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {t} = useTranslation();
  const {SUBJECT_SELECTED}: any = useSelector(state => state.QuestionPaperType);
  const [Data, setData] = useState<dataState>({
    Time: '',
    TotalMarks: '',
    Date: moment(new Date()).format('YYYY-MM-DD'),
    InstituteName: 'Institute Name',
    TestName: '',
    Medium: '',
    PaperFormat: [],
    SUBJECT_SELECTED: SUBJECT_SELECTED,
  });

  const validateDetails = () => {
    if (Data.Time == '') {
      Toast(t('QuestionPaperModule.EnterExamTime'));
      return true;
    } else if (Data.TestName == '') {
      Toast(t('QuestionPaperModule.EnterTestName'));
      return true;
    } else if (Data.Date == '') {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.QuestionPaperBackground}}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        label={t('QuestionPaperModule.SelectExamDetails')}
      />

      <View
        style={{
          paddingHorizontal: Sizes.Padding,
          paddingTop: Sizes.ScreenPadding,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TitleComponent
            label={SUBJECT_SELECTED.CLASS_NAME}
            style={{flex: 0.5}}
            onPress={() => {}}
            ViewStyle={{borderRadius: Sizes.Base}}
            isBorder={true}
            textStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
            loading={false}
          />
          <View style={{width: Sizes.Padding}} />

          <TitleComponent
            label={SUBJECT_SELECTED.NAME}
            style={{flex: 0.5}}
            onPress={() => {}}
            ViewStyle={{borderRadius: Sizes.Base}}
            isBorder={true}
            textStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
            loading={false}
          />
        </View>

        <View style={{height: Sizes.Padding}} />

        <TextInput
          placeholder={t('QuestionPaperModule.EnterTestName')}
          value={Data.TestName}
          onChangeText={TextName => {
            setData({...Data, TestName: TextName});
          }}
          style={{borderWidth: 0, elevation: 10}}
          textStyle={{...Fonts.Medium2}}
        />

        <View style={{height: Sizes.ScreenPadding}} />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <DatePicker
              imp
              value={Data.Date}
              onChangeText={date =>
                setData({...Data, Date: moment(date).format('YYYY-MM-DD')})
              }
              type="date"
              containerStyle={{borderWidth: 0, elevation: 10}}
              leftChild={
                <Icon
                  type="AntDesign"
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingStart: Sizes.Base,
                  }}
                  name="calendar"
                  color={'black'}
                />
              }
            />
          </View>

          <View style={{width: Sizes.Padding}} />
          <View style={{flex: 1}}>
            <TextInput
              imp
              onChangeText={time => setData({...Data, Time: time})}
              value={Data.Time}
              style={{borderWidth: 0, elevation: 10}}
              leftChild={
                <View style={{paddingStart: Sizes.Base}}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}
                    source={TimeLogo}
                  />
                </View>
              }
              keyboardType="number-pad"
              placeholder={t('QuestionPaperModule.EnterExamTime')}
            />
          </View>
        </View>
        <View style={{height: Sizes.ScreenPadding}} />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <TextInput
              imp
              onChangeText={marks => setData({...Data, TotalMarks: marks})}
              value={Data.TotalMarks}
              style={{borderWidth: 0, elevation: 10}}
              textStyle={{...Fonts.Regular2, fontSize: 15}}
              keyboardType="number-pad"
              placeholder={t('QuestionPaperModule.TotalExamMarks')}
            />
          </View>
        </View>

        <View style={{height: Sizes.ScreenPadding}} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          padding: Sizes.Padding,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          <TextButton
            style={{flex: 1}}
            label={t('common.Cancel')}
            onPress={() => {
              navigation.goBack();
            }}
            textStyle={{...Fonts.Bold2}}
            loading={false}
          />
        </View>
        <View style={{width: Sizes.Base}} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          <TextButton
            style={{flex: 1}}
            label={t('QuestionPaperModule.Next')}
            onPress={() => {
              if (validateDetails()) {
                return;
              } else {
                navigation.navigate('QuestionPaperSelection', {Item: Data});
              }
            }}
            textStyle={{...Fonts.Bold2}}
            loading={false}
          />
        </View>
      </View>
    </View>
  );
};

export default ExamDetails;
