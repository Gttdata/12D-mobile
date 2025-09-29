import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  TextInput as InputText,
} from 'react-native';
import {apiPut, useSelector} from '../../Modules';
import {Header, Icon, TextInput, Toast} from '../../Components';
import {Checkbox} from 'react-native-paper';
import {StackProps} from '../../routes';
import moment from 'moment';

type Props = StackProps<'SubTaskList'>;
const SubTaskList = ({navigation, route}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const {item} = route.params;
  const inputRefs = useRef<any>([]);
  const [inputs, setInputs] = useState(
    item?.DESCRIPTION ? JSON.parse(item.DESCRIPTION) : [],
  );
  const sortedInputs = useMemo(
    () => [...inputs].sort((a, b) => a.status - b.status),
    [inputs],
  );
  const [currentInput, setCurrentInput] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleInputChange = useCallback(
    (text: string, index: number) => {
      const newInputs = inputs.map((input: any, i: any) =>
        i === index ? {...input, text} : input,
      );
      setInputs(newInputs);
    },
    [inputs],
  );

  const currentInputRef = useRef<any>(null);

  // const handleDone = () => {
  //   if (currentInput.trim()) {
  //     setInputs([...inputs, {status: 0, text: currentInput.trim()}]);
  //     setCurrentInput('');
  //   }
  // };

  const handleDone = useCallback(() => {
    if (currentInput.trim()) {
      setInputs([...inputs, {status: 0, text: currentInput.trim()}]);
      setCurrentInput('');
      setTimeout(() => {
        currentInputRef.current.focus();
      }, 100);
    }
  }, [currentInput, inputs]);

  const deleteInput = useCallback(
    (index: number) => {
      // if (sortedInputs.length > 1) {
      //   const newInputs = sortedInputs.filter((_: any, i: any) => i !== index);
      //   setInputs(newInputs);
      //   setTimeout(() => {
      //     if (index > 0) {
      //       inputRefs.current[index - 1].focus();
      //     } else {
      //       inputRefs.current[0].focus();
      //     }
      //   }, 100);
      // }
      const newInputs = sortedInputs.filter((_, i) => i !== index);
      setInputs(newInputs);
    },
    [sortedInputs],
  );

  //  const handleKeyPress = (event: any, index: any) => {
  //   if (event.nativeEvent.key === 'Backspace' && inputs[index].text === '') {
  //     deleteInput(index);
  //   }
  // };

  const toggleDateSelection = useCallback((item: any) => {
    setInputs((prevData: any[]) => {
      return prevData.map(it =>
        it.text === item.text ? {...it, status: it.status === 1 ? 0 : 1} : it,
      );
    });
  }, []);

  const CompleteTask = useCallback(async () => {
    const updateStatus =
      inputs.length > 0
        ? inputs.every((item: any) => item.status === 1)
        : false;
    try {
      let body = {
        MEMBER_ID: member?.ID,
        ID: item.ID,
        CREATED_DATETIME: moment(item?.CREATED_DATETIME ? item?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
//        CREATED_DATETIME: item.CREATED_DATETIME,
        TITLE: item.TITLE,
        DESCRIPTION: inputs.length == 0 ? '' : JSON.stringify(inputs),
        IS_REMIND: item.IS_REMIND,
        REMIND_DATETIME: moment(item.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
        REMIND_TYPE: item.REMIND_TYPE,
        IS_COMPLETED: updateStatus ? 1 : 0,
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: item.TYPE,
        IS_SUB_TASK: 1,
      };
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        navigation.goBack();
      } else {
        Toast('Something Wrong..Please try again..!');
      }
    } catch (error) {
      console.log('err,,,....', error);
    }
  }, [inputs, item, member, navigation]);
  useEffect(() => {
    const backAction = () => {
      CompleteTask();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [CompleteTask]);

  const filteredInputs = useMemo(
    () =>
      sortedInputs.filter(input =>
        input.text.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [sortedInputs, searchText],
  );

  return (
    <View style={{flex: 1, backgroundColor: '#EAEDED'}}>
      <Header
        label={item.TITLE}
        onBack={() => {
          CompleteTask();
        }}
        onSearch={(txt: any) => {
          setSearchText(txt);
        }}
      />
      <View
        style={{
          flex: 1,
          margin: Sizes.Padding,
          marginVertical: Sizes.ScreenPadding,
        }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 3,
              marginTop: Sizes.Base,
              marginBottom: Sizes.Padding,
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: Colors.Background,
                marginRight: Sizes.Radius,
                borderRadius: Sizes.Base,
                elevation: 5,
                paddingLeft: Sizes.Radius,
                flex: 1,
              }}>
              <InputText
                ref={currentInputRef}
                style={{
                  ...Fonts.Medium3,
                  fontSize: 10,
                  height: 35,
                  flex: 1,
                  textAlignVertical: 'center',
                  justifyContent: 'center',
                  color: Colors.PrimaryText1,
                  marginTop: 3,
                }}
                placeholder={'Create sub task'}
                value={currentInput}
                onChangeText={setCurrentInput}
                returnKeyType="done"
                // onSubmitEditing={handleDone}
                autoFocus={true}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
              onPress={() => handleDone()}>
              <Icon
                name="pluscircleo"
                type="AntDesign"
                size={24}
                onPress={() => handleDone()}
              />
            </TouchableOpacity>
          </View>
          {filteredInputs.map((input, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  input.status === 1 ? '#EBF5FB' : Colors.Background,
                marginBottom: Sizes.Radius,
                paddingTop: 4,
                borderRadius: Sizes.Base,
                elevation: 5,
                margin: 2,
                paddingLeft: 4,
                paddingRight: Sizes.Radius,
              }}>
              <View
                style={{
                  transform: [{scale: 1}],
                  marginBottom: Sizes.Base,
                }}>
                <Checkbox
                  uncheckedColor={Colors.PrimaryText1}
                  color={Colors.Primary}
                  onPress={() => {
                    toggleDateSelection(input);
                  }}
                  status={input.status == 1 ? 'checked' : 'unchecked'}
                />
              </View>
              <InputText
                ref={ref => (inputRefs.current[index] = ref)}
                style={{
                  ...Fonts.Medium3,
                  fontSize: 12,
                  height: 38,
                  flex: 1,
                  alignItems: 'center',
                  textAlignVertical: 'center',
                  justifyContent: 'center',
                  color:
                    input.status === 1 ? Colors.Primary : Colors.PrimaryText1,
                }}
                placeholder={index == 0 ? 'Enter sub task name' : ''}
                value={input.text}
                onChangeText={text => handleInputChange(text, index)}
                // onKeyPress={event => handleKeyPress(event, index)}
                returnKeyType="next"
              />
              <Icon
                name="close"
                type="AntDesign"
                size={18}
                color={'#E74C3C'}
                onPress={() => deleteInput(index)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default SubTaskList;
