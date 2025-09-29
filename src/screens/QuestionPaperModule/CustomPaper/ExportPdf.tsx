import {View, Image, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {StackProps} from '../../../routes';
import {Header, Icon, TextButton, TextInput, Toast} from '../../../Components';
import {useSelector} from '../../../Modules';
import DatePicker from '../../../Components/DatePicker';
import moment from 'moment';
import {TimeLogo} from '../../../../assets';
import Modal from '../../../Components/Modal';
import TitleComponent from '../../../Components/TitleComponent';
import {useTranslation} from 'react-i18next';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';

type Props = StackProps<'ExportPdf'>;
type dataState = {
  Time: string;
  TotalMarks: string;
  Date: string;
  TestName: string;
  InstituteName: string;
  Medium: string;
  PaperFormat: any[];
};
const ExportPdf: React.FC<Props> = ({navigation, route}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const {t} = useTranslation();
  const [Data, setData] = useState<dataState>({
    Time: '',
    TotalMarks: '',
    Date: moment(new Date()).format('YYYY-MM-DD'),
    InstituteName: 'Institute Name',
    TestName: '',
    Medium: '',
    PaperFormat: [],
  });
  const {Item, Type} = route.params;
  const {SUBJECT_SELECTED}: any = useSelector(state => state.QuestionPaperType);
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
        label={t('QuestionPaperModule.exportQuestionPaper')}
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
          autoFocus={true}
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
              style={{height: Sizes.Field}}
            />
          </View>

          <View style={{width: Sizes.Padding}} />
          <View style={{flex: 1}}>
            <TextInput
              imp
              onChangeText={time => setData({...Data, Time: time})}
              value={Data.Time}
              style={{borderWidth: 0, elevation: 10, minHeight: Sizes.Field}}
              leftChild={
                <View style={{paddingStart: Sizes.Base}}>
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}
                    source={TimeLogo}
                  />
                </View>
              }
              keyboardType="number-pad"
              placeholder={'Total Time(min)'}
              autoFocus={false}
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
              autoFocus={false}
            />
          </View>
        </View>
        <View style={{height: Sizes.ScreenPadding}} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          padding: Sizes.ScreenPadding,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          <TextButton
            style={{flex: 1}}
            label={'Generate'}
            onPress={async () => {
              if (validateDetails()) {
                return;
              } else {
                requestMultiple([
                  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                ]).then(result => {
                  if (RESULTS.GRANTED) {
                    navigation.navigate('ExportPdfData', {
                      Data: Data,
                      Item: Item,
                      Type: Type,
                    });
                  } else {
                    Toast('Storage permission not granted');
                  }
                });
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

export default ExportPdf;
