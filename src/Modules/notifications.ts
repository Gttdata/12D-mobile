import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import { Toast } from '../Components';
import { apiPost, apiPut } from './service';
import moment from 'moment';
import { PERIOD_TRACKING_RECORD } from './interface';

// const { AlarmModule } = NativeModules;

let notificationData = {};
export const setNotificationData = (data: any) => {
  notificationData = data;
};
export const getNotificationData = () => {
  return notificationData;
};


async function requestAlarmPermissions() {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'App needs notification permission to show alarms',
            buttonPositive: 'OK',
          }
        );
      }

      if (Platform.Version >= 31) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SCHEDULE_EXACT_ALARM,
          {
            title: 'Alarm Permission',
            message: 'App needs permission to set exact alarms',
            buttonPositive: 'OK',
          }
        );
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  }
}

notifee.onBackgroundEvent(async ({ type, detail }: any) => {
  if (type === EventType.ACTION_PRESS) {
    console.log('Background press:', detail.pressAction.id);

    // Cancel the notification first to stop the sound
    await notifee.cancelNotification(detail.notification.id);

    if (detail.pressAction.id === 'snooze') {
      handleSnoozeAction();
    } else if (detail.pressAction.id === 'done') {
      handleDoneAction();
    } else if (detail.pressAction.id === 'yes') {
      UpdatePeriodTrackingRecord();
    }
  }
});

notifee.onForegroundEvent(async ({ type, detail }: any) => {
  if (type === EventType.ACTION_PRESS) {
    console.log('Foreground press:', detail.pressAction.id);

    // Cancel the notification first to stop the sound
    await notifee.cancelNotification(detail.notification.id);

    if (detail.pressAction.id === 'snooze') {
      handleSnoozeAction();
    } else if (detail.pressAction.id === 'done') {
      handleDoneAction();
    } else if (detail.pressAction.id === 'yes') {
      UpdatePeriodTrackingRecord();
    }
  }
});

const handleSnoozeAction = async () => {
  await notifee.cancelAllNotifications();

  const data: any = getNotificationData();
  const currentRemindDatetime = JSON.parse(data.data2).REMIND_DATETIME;
  const newRemindDatetime = moment(currentRemindDatetime).add(5, 'minutes').format('YYYY-MM-DD HH:mm');
  const updatedData = { ...JSON.parse(data.data2), REMIND_DATETIME: newRemindDatetime };

  try {
    const res = await apiPut('api/memberTodo/update', updatedData);
    if (res && res.code == 200) {
      Toast('Snoozed');
    }
  } catch (err) {
    console.log(err);
  }
};

const handleDoneAction = async () => {

  await notifee.cancelAllNotifications();

  const data: any = getNotificationData();
  const updatedData = { ...JSON.parse(data.data2), IS_COMPLETED: 1, STATUS: 1 };

  try {
    const res = await apiPut('api/memberTodo/update', updatedData);
    if (res && res.code == 200) {
      Toast('Done');
    }
  } catch (err) {
    console.log(err);
  }
};


const UpdatePeriodTrackingRecord = async () => {
  const data: any = getNotificationData();
  let currentItem = JSON.parse(data.data2);
  const updatedData = {
    ...currentItem,
    IS_DONE: 1,
  };
  try {
    const res = await apiPut('api/periodTracking/update', updatedData);
    if (res && res.code == 200) {
      Toast('Done');
      createNewPeriodTrackingRecord(currentItem);
    }
  } catch (error) {
    console.log('err,,,', error);
  }
};

const createNewPeriodTrackingRecord = async (item: PERIOD_TRACKING_RECORD) => {
  const dayReminderDate = moment().add(item.CYCLE_LENGTH, 'days').format('YYYY-MM-DD 00:00:00');
  const dayReminderEndDate = moment(dayReminderDate).add(7, 'days').format('YYYY-MM-DD 00:00:00');
  const remindDateTime = moment(dayReminderDate).subtract(item.REMIND_DATE_COUNT, 'days').format('YYYY-MM-DD');
  const lastPeriod = moment();
  const cycleLengthDays = parseInt(item.CYCLE_LENGTH, 10);
  const periodDays = parseInt(item.PERIOD_DAYS_LENGTH, 10);

  const nextPeriodStart = lastPeriod.clone().add(cycleLengthDays, 'days');
  const nextPeriodEnd = nextPeriodStart.clone().add(periodDays - 1, 'days');
  const nextOvulationDay = nextPeriodStart.clone().subtract(14, 'days');
  const nextOvulationStart = nextOvulationDay.clone();
  const nextOvulationEnd = nextOvulationDay.clone().add(1, 'day');
  const nextFertileStart = nextOvulationDay.clone().subtract(5, 'days');
  const nextFertileEnd = nextOvulationDay.clone().add(1, 'day');
  const nextSafeStart = nextFertileEnd.clone().add(1, 'day');
  const nextSafeEnd = nextPeriodStart.clone().subtract(1, 'day');

  try {
    const body = {
      USER_ID: item.USER_ID,
      MONTH: moment().format('MM'),
      YEAR: moment().format('YYYY'),
      PERIOD_DAYS_LENGTH: item.PERIOD_DAYS_LENGTH,
      CYCLE_LENGTH: item.CYCLE_LENGTH,
      LAST_PERIOD_DATE: moment().format('YYYY-MM-DD'),
      IS_REGULAR_STATUS: item.IS_REGULAR_STATUS,
      IS_REMIND: item.IS_REMIND,
      REMIND_DATE_TIME: remindDateTime + ' ' + moment(item.REMIND_DATE_TIME).format('HH:mm:00'),
      REMIND_DATE_COUNT: item.REMIND_DATE_COUNT,
      DAY_REMINDER_DATE: dayReminderDate,
      DAY_REMINDER_END_DATE: dayReminderEndDate,
      IS_DONE: 0,
      CLIENT_ID: 1,
      PERIOD_START_DATE: nextPeriodStart.format('YYYY-MM-DD 00:00:00'),
      PERIOD_END_DATE: nextPeriodEnd.format('YYYY-MM-DD 00:00:00'),
      FERTILE_START_DATE: nextFertileStart.format('YYYY-MM-DD 00:00:00'),
      FERTILE_END_DATE: nextFertileEnd.format('YYYY-MM-DD 00:00:00'),
      OVULATION_START_DATE: nextOvulationStart.format('YYYY-MM-DD 00:00:00'),
      OVULATION_END_DATE: nextOvulationEnd.format('YYYY-MM-DD 00:00:00'),
      SAFE_START_DATE: nextSafeStart.format('YYYY-MM-DD 00:00:00'),
      SAFE_END_DATE: nextSafeEnd.format('YYYY-MM-DD 00:00:00'),
      IS_QUESTIONARY_COMPLETE: 1,
    };
    await apiPost('api/periodTracking/create', body);
  } catch (error) {
    console.log('error...', error);
  }
};

export const Notification = async (notification: FirebaseMessagingTypes.RemoteMessage) => {
  try {
    const { title, body }: any = notification.notification;
    const { data1, data2, data3, data4, data5 }: any = notification.data;
    setNotificationData({ data1, data2, data3, data4, data5 });

    await notifee.deleteChannel('default');

    const channelId = await notifee.createChannel({
      id: 'custom',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: data1 === 'A' ? 'alarm_sound' : data1 === 'DPT' ? 'ticktac' : 'blank',
      visibility: AndroidVisibility.PUBLIC,
      vibration: true,
      vibrationPattern: [500, 500, 500, 500],
      lights: true,
      lightColor: '#FF0000',
      bypassDnd: true
    });

    const rawActions = notification.data?.notificationActions
      ? JSON.parse(notification.data.notificationActions)
      : [];

    const mappedActions = rawActions.map((action: any) => ({
      title: action.title,
      pressAction: {
        id: action.id === 'stop' ? 'done' : action.id, 
      },
    }));

    await notifee.displayNotification({
      title,
      body,
      data: notification.data, // Make sure to include all data
      android: {
        channelId,
        sound: data1 === 'A' ? 'alarm_sound' : data1 === 'DPT' ? 'ticktac' : 'blank',
        smallIcon: 'ic_launcher',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        pressAction: { id: 'default' },
        showTimestamp: true,
        timestamp: Date.now(),
        ...(data1 === 'A' && {
          ongoing: true,
          fullScreenAction: { id: 'default' },
          timeoutAfter: 60000,
          loopSound: true,
          vibrationPattern:[200,500]
        }),
        actions: mappedActions,
      },
    });

  } catch (err) {
    console.warn(err);
  }
};
