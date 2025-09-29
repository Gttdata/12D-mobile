import {View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from '../../../Modules';
import {Header, Modal, TextButton} from '../../../Components';
import Dropdown from '../../../Components/Dropdown';

const SizeData = [
  {
    school: '22px',
    board: '20px',
    class: '16px',
    type: '16px',
    question: '14px',
  },
  {
    school: '24px',
    board: '22px',
    class: '18px',
    type: '18px',
    question: '16px',
  },
  {
    school: '26px',
    board: '24px',
    class: '20px',
    type: '20px',
    question: '18px',
  },
  {
    school: '28px',
    board: '26px',
    class: '22px',
    type: '22px',
    question: '20px',
  },
  {
    school: '30px',
    board: '28px',
    class: '24px',
    type: '24px',
    question: '22px',
  },
];
const fontFamilyData = [
  {label: 'Arial', value: `'Arial', sans-serif`},
  {label: 'Merriweather', value: `'Merriweather', serif`},
  {label: 'Poppins', value: `'Poppins', sans-serif`},
  {label: 'Lora', value: `'Lora', serif`},
  {label: 'Raleway', value: `'Raleway', sans-serif`},
  {label: 'Rubik', value: `'Rubik', sans-serif`},
];
interface Props {
  isVisible: boolean;
  onClose: () => void;
  fontSize: any;
  fontFamily: any;
  onSuccess: ({fontSize, fontFamily}: any) => void;
}
const AddFontSizeFilter = ({
  isVisible,
  onClose,
  fontSize,
  fontFamily,
  onSuccess,
}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const [size, setSize] = useState(fontSize);
  const [family, setFamily] = useState(fontFamily);
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      style={{margin: 0, padding: 0, height: '100%'}}>
      <View style={{backgroundColor: Colors.White, flex: 1}}>
        <Header
          label={'Change font style'}
          onBack={async () => {
            onClose();
          }}
        />
        <View
          style={{
            marginHorizontal: Sizes.Padding,
            marginVertical: Sizes.ScreenPadding,
            flex: 1,
          }}>
          <View style={{width: '100%', marginTop: Sizes.ScreenPadding}}>
            <Dropdown
              label="Font Size"
              data={SizeData}
              value={size}
              onChange={item => {
                setSize(item);
              }}
              labelField="question"
              valueField="question"
              labelStyle={{fontSize: 11}}
            />
          </View>
          <View style={{marginTop: Sizes.ScreenPadding}}>
            <Dropdown
              label="Font Family"
              data={fontFamilyData}
              value={family}
              onChange={item => {
                setFamily(item);
              }}
              labelField="label"
              valueField="value"
              labelStyle={{fontSize: 11}}
            />
          </View>
        </View>
        <View
          style={{
            margin: Sizes.Padding,
          }}>
          <TextButton
            label="Apply"
            loading={false}
            onPress={() => {
              onSuccess({
                fontSize: size,
                fontFamily: family,
              });
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddFontSizeFilter;
