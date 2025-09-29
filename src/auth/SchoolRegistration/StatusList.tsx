import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts} from '../../Modules/Modules';
import {apiPost} from '../../Modules';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatusList = () => {
  const [applicationStatus, setApplicationStatus] = useState({
    schoolName: '',
    status: '',
    remark: '',
    year: '',
  });

  useEffect(() => {
    getStatus();
  }, []);
  const getStatus = async () => {
    const schoolId = await AsyncStorage.getItem('SCHOOL_ID');
    try {
      const res = await apiPost('api/school/get', {
        filter: ` AND ID = ${schoolId} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setApplicationStatus({
          ...applicationStatus,
          schoolName: res.data[0].SCHOOL_NAME,
          status: res.data[0].SCHOOL_STATUS=='P'? "Pending": res.data[0].SCHOOL_STATUS=='R'? "Rejected":'Approved' ,
          remark: res.data[0].REJECT_BLOCKED_REMARK,
          year: res.data[0].REJECT_BLOCKED_REMARK,
        });
      }
    } catch (error) {
      console.log('error..', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: Colors.text, ...Fonts.B1}}>
        {applicationStatus.schoolName}
      </Text>
      <Text style={{color: Colors.text, ...Fonts.B1}}>
          {`status of your application is ${applicationStatus.status}`}
      </Text>
    {applicationStatus=='Rejected' && <View>
     <Text style={{color: Colors.text, ...Fonts.B1}}>
          {`because of ${applicationStatus.remark}`}
      </Text>
     </View>}
     
    </View>
  );
};

export default StatusList;
