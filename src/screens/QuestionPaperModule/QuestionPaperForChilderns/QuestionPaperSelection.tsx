import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Button,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {Header, Modal, TextInput} from '../../../Components';
import {StackProps} from '../../../routes';
import {useSelector} from '../../../Modules';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {useTranslation} from 'react-i18next';
import {noData} from '../../../../assets';
import SelectQuestionTypeComp from './SelectQuestionTypeComp';
import AddAndWrite from './ChildernQuestionsComp/AddAndWrite';
import ViewShot from 'react-native-view-shot';
import WriteAndDescribe from './ChildernQuestionsComp/WriteAndDescribe';

type Props = StackProps<'QuestionPaperSelection'>;
interface Question {
  QUESTION_NAME: string;
  KEY: string;
  QUESTION_TYPE: string;
  index: number;
  QUESTION_DATA: any[];
  // Add any other properties you need
}
const QuestionPaperSelection: React.FC<Props> = ({navigation, route}) => {
  const {Item} = route.params;
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {t} = useTranslation();
  const [BottomSheet, setBottomSheet] = useState(false);
  const [data, setData] = useState<Question[]>([]);

  const viewShotRefs = useRef<(ViewShot | null)[]>([]);

  const captureScreenshots = async () => {
    try {
      const screenshotPromises = viewShotRefs.current.map(
        async (ref, index) => {
          if (ref) {
            const uri = await ref.capture();
            // console.log(`Screenshot ${index + 1} URI:`, uri);
            // Save or process the screenshot URI as needed
          }
        },
      );

      await Promise.all(screenshotPromises);
    } catch (error) {
      console.error('Error capturing screenshots:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label={'Question Selection'}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <LinearGradient
        colors={['#f6d365', '#fda085']}
        style={{
          margin: Sizes.Padding,
          elevation: 5,
          shadowColor: Colors.Primary,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: Sizes.Radius,
        }}>
        <TouchableOpacity
          onPress={() => {
            setBottomSheet(true);
          }}>
          <LottieView
            source={require('../../../../assets/LottieAnimation/AssignTask.json')}
            style={{
              height: 100,
              width: 140,
              alignSelf: 'center',
              borderRadius: Sizes.Radius,
            }}
            colorFilters={[
              {
                keypath: 'mark Outlines',
                color: 'black',
              },
              {
                keypath: 'Path 1',
                color: 'black',
              },
              {
                keypath: 'bg green',
                color: 'black',
              },
            ]}
            autoPlay={true}
            loop={true}
          />

          <Text
            style={{
              color: Colors.White,
              ...Fonts.Medium3,
              textAlign: 'center',
            }}>
            {`Add Questions`}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={{flex: 1, margin: Sizes.Padding}}>
        <FlatList
          data={data} // Your data array
          removeClippedSubviews={false}
          renderItem={({item, index}) => {
            let renderItemComponent;
            switch (item.KEY) {
              case '1':
                renderItemComponent = (
                  <ViewShot
                    ref={ref => (viewShotRefs.current[index] = ref)}
                    options={{format: 'jpg', quality: 0.9}}>
                    <AddAndWrite
                      onPress={() => {}}
                      CopyQuestion={Copy => {
                        setData([
                          ...data,
                          {
                            QUESTION_NAME: '',
                            KEY: Copy.KEY,
                            QUESTION_TYPE: '',
                            index: 0,
                            QUESTION_DATA: Copy.QUESTION_DATA,
                          },
                        ]);
                      }}
                    />
                  </ViewShot>
                );
                break;
              case '2':
                renderItemComponent = <WriteAndDescribe onPress={() => {}} />;
                break;
              // Add more cases as needed for other KEY values

              default:
                renderItemComponent = null;
                break;
            }

            return renderItemComponent;
          }}
          ItemSeparatorComponent={() => <View style={{height: Sizes.Base}} />} // Separator component
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <SelectQuestionTypeComp
        setData={setData}
        Data={data}
        isVisible={BottomSheet}
        onClose={() => {
          setBottomSheet(false);
        }}
      />

      {/* <View style={{flex: 1, padding: Sizes.Padding}}></View> */}
    </View>
  );
};

export default QuestionPaperSelection;
