import { NativeModules } from 'react-native';

const { AlarmModule } = NativeModules;

export function startAlarm() {
  AlarmModule.startAlarm();
}

export function stopAlarm() {
  AlarmModule.stopAlarm();
}
