import {
  View,
  Text,
  ScrollView,
  TextInput as InputText,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Icon, Modal, TextButton, TextInput, Toast} from '../../Components';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {Checkbox, Switch} from 'react-native-paper';
import moment from 'moment';
import {WEEKLY_PLANNER_INTERFACE} from '../../Modules/interface';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: WEEKLY_PLANNER_INTERFACE;
}
const AddTodoTask = ({visible, onClose, onSuccess, item}: ModalProps) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [tabIndex, setTabIndex] = useState(
    item?.IS_SUB_TASK ? (item.IS_SUB_TASK == 1 ? 2 : 1) : 1,
  );
  const [inputs, setInputs] = useState(
    item?.IS_SUB_TASK == 1
      ? item?.DESCRIPTION
        ? JSON.parse(item.DESCRIPTION)
        : []
      : [],
  );
  const [description, setDescription] = useState(
    item?.IS_SUB_TASK == 0 ? item?.DESCRIPTION : '',
  );

  const [title, setTitle] = useState(item ? item.TITLE : '');
  const [currentInput, setCurrentInput] = useState('');
  const [isSubPoints, setIsSubPoints] = useState(
    item?.DESCRIPTION ? true : true,
  );
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<any>([]);
  const {member} = useSelector(state => state.member);

  const handleInputChange = (text: string, index: number) => {
    const newInputs = inputs.map((input: any, i: any) =>
      i === index ? {...input, text} : input,
    );
    setInputs(newInputs);
  };
  const focusNextInput = (index: number) => {
    if (index < inputs.length - 1) {
      inputRefs.current[index + 1].focus();
    } else {
      addInput();
      setTimeout(() => {
        inputRefs.current[index + 1].focus();
      }, 100);
    }
  };
  const addInput = () => {
    setInputs([...inputs, {status: 0, text: ''}]);
  };
  const deleteInput = (index: number) => {
    // if (inputs.length > 1) {
    //   const newInputs = inputs.filter((_: any, i: any) => i !== index);
    //   setInputs(newInputs);
    //   setTimeout(() => {
    //     if (index > 0) {
    //       inputRefs.current[index - 1].focus();
    //     } else {
    //       inputRefs.current[0].focus();
    //     }
    //   }, 100);
    // }
    const newInputs = inputs.filter((_: any, i: any) => i !== index);
    setInputs(newInputs);
  };
  const handleKeyPress = (event: any, index: any) => {
    if (event.nativeEvent.key === 'Backspace' && inputs[index].text === '') {
      deleteInput(index);
    }
  };
  const validate = () => {
    if (title.trim() == '') {
      Toast('Please Enter Title');
      return true;
    } else {
      return false;
    }
  };
  const creteTask = async () => {
    if (validate()) {
      return;
    }
    setLoading(true);
    try {
      const subPointsData = inputs.filter(
        (it: any) => typeof it === 'object' && it !== '' && it.text,
      );
      let body = {
        MEMBER_ID: member?.ID,
        CREATED_DATETIME:
          moment(new Date()).format('YYYY-MM-DD') +
          ' ' +
          moment(new Date()).format('HH:mm'),
        TITLE: title,
        DESCRIPTION:
          tabIndex == 1
            ? description
              ? description
              : ''
            : subPointsData.length > 0
            ? JSON.stringify(subPointsData)
            : '',
        IS_REMIND: false,
        REMIND_DATETIME: null,
        IS_COMPLETED: 0,
        REMIND_TYPE: 'P',
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: 'TD',
        IS_SUB_TASK: tabIndex == 1 ? (description ? 0 : 1) : 1,
      };
      // console.log('\n\n\n..body..', body);
      const res = await apiPost('api/memberTodo/create', body);
      if (res && res.code == 200) {
        setLoading(false);
        Toast('Task Added Successfully');
        onSuccess();
      }
    } catch (error) {
      setLoading(false);
      console.log('err,,,', error);
    }
  };
  const UpdateTask = async () => {
    setLoading(true);
    try {
      const subPointsData = inputs.filter(
        (it: any) => typeof it === 'object' && it !== '' && it.text,
      );
      let body = {
        MEMBER_ID: member?.ID,
        ID: item?.ID,
        CREATED_DATETIME:
          moment(new Date()).format('YYYY-MM-DD') +
          ' ' +
          moment(new Date()).format('HH:mm'),
        TITLE: title,
        // DESCRIPTION: isSubPoints ? JSON.stringify(subPointsData) : '',
        DESCRIPTION:
          tabIndex == 1
            ? description
              ? description
              : ''
            : subPointsData.length > 0
            ? JSON.stringify(subPointsData)
            : '',
        IS_REMIND: false,
        REMIND_DATETIME: null,
        IS_COMPLETED: 0,
        REMIND_TYPE: 'P',
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: 'TD',
        IS_SUB_TASK: tabIndex == 1 ? (description ? 0 : 1) : 1,
      };
      console.log('\n\n\n..body..', body);
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        setLoading(false);
        Toast('Task Updated Successfully');
        onSuccess();
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };

  const currentInputRef = useRef<any>(null);
  const handleDone = useCallback(() => {
    if (currentInput.trim()) {
      setInputs([...inputs, {status: 0, text: currentInput.trim()}]);
      setCurrentInput('');
      setTimeout(() => {
        currentInputRef.current.focus();
      }, 100);
    }
  }, [currentInput, inputs]);
  return (
    <Modal
      isVisible={visible}
      onClose={onClose}
      title="Add New Task"
      containerStyle={{
        justifyContent: 'flex-end',
      }}
      style={{
        margin: 0,
        borderRadius: Sizes.Radius,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        flex: 1,
        maxHeight: 560,
      }}>
      <View style={{marginTop: Sizes.ScreenPadding, flex: 1, maxHeight: 560}}>
        <TextInput
          label="Task Name"
          labelStyle={{fontSize: 11}}
          placeholder="Enter task name"
          onChangeText={value => {
            setTitle(value);
          }}
          value={title}
          autoFocus={false}
          style={{
            elevation: 5,
          }}
        />
        <View style={{height: Sizes.ScreenPadding}} />

        {/**TABS**/}
        <View
          style={{
            height: 33,
            borderRadius: Sizes.Padding * 2,
            elevation: 4,
            shadowColor: Colors.Primary2,
            flexDirection: 'row',
            backgroundColor: Colors.Background,
            marginHorizontal: 20,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setInputs([]);
              setTabIndex(1);
            }}
            style={{
              width: '50%',
              height: '100%',
              borderTopLeftRadius: Sizes.Padding * 2,
              borderBottomLeftRadius: Sizes.Padding * 2,
              backgroundColor: tabIndex == 1 ? Colors.Primary2 : Colors.White,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: tabIndex == 1 ? Colors.White : Colors.Primary2,
              }}>
              Description
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              setTabIndex(2);
              setDescription('');
            }}
            style={{
              width: '50%',
              height: '100%',
              borderTopRightRadius: Sizes.Padding * 2,
              borderBottomRightRadius: Sizes.Padding * 2,
              backgroundColor: tabIndex == 2 ? Colors.Primary2 : Colors.White,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: tabIndex == 2 ? Colors.White : Colors.Primary2,
              }}>
              SubTask
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{height: Sizes.Padding}} />

        {tabIndex == 1 && (
          <View style={{marginBottom: Sizes.Padding, marginTop: Sizes.Base}}>
            <TextInput
              label="Description"
              value={description}
              onChangeText={txt => {
                setDescription(txt);
              }}
              placeholder="Enter description"
              multiline
              labelStyle={{
                fontSize: 11,
              }}
            />
          </View>
        )}

        {tabIndex == 2 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: Sizes.Padding,
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: Colors.Background,
                borderBottomWidth: 1,
                borderBottomColor: Colors.Primary,
                paddingLeft: Sizes.Radius,
                flex: 1,
                alignItems: 'center',
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
                autoFocus={true}
              />
              <Icon
                name="pluscircleo"
                type="AntDesign"
                size={21}
                onPress={() => handleDone()}
              />
            </View>
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: Sizes.Padding,
          }}
          style={{flexGrow: 1}}>
          {inputs.map((input: any, index: number) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.Background,
                marginBottom: -Sizes.Base,
              }}>
              <View
                style={{
                  transform: [{scale: 0.9}],
                }}>
                <Checkbox
                  uncheckedColor={Colors.PrimaryText1}
                  color={Colors.Primary}
                  onPress={() => {}}
                  status={'unchecked'}
                  disabled={true}
                />
              </View>
              <InputText
                ref={ref => (inputRefs.current[index] = ref)}
                style={{
                  ...Fonts.Medium3,
                  fontSize: 11,
                  height: 37,
                  flex: 1,
                  marginTop: 5,
                  alignItems: 'center',
                  textAlignVertical: 'center',
                  justifyContent: 'center',
                  color: Colors.PrimaryText1,
                }}
                placeholder={''}
                value={input.text}
                onChangeText={(text: string) => handleInputChange(text, index)}
                returnKeyType="next"
              />
              <Icon
                name="close"
                type="AntDesign"
                size={17}
                color={'#E74C3C'}
                onPress={() => {
                  deleteInput(index);
                }}
              />
            </View>
          ))}
        </ScrollView>

        <View style={{marginTop: Sizes.Padding}}>
          <TextButton
            label="Done"
            loading={loading}
            // disable={loading ? true : false}
            onPress={() => {
              item ? UpdateTask() : creteTask();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddTodoTask;
