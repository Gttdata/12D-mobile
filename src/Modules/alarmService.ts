import BackgroundService from 'react-native-background-actions';
import Sound from 'react-native-sound';

// Set up sound player
Sound.setCategory('Playback');

const playAlarmSound = async (taskData: any) => {
  return new Promise<void>(async (resolve) => {
    // Load and play sound
    const alarmSound = new Sound('alarm_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
      
      // Play sound in loop
      const playLoop = () => {
        alarmSound.play((success) => {
          if (success && BackgroundService.isRunning()) {
            playLoop(); // Continue looping while service runs
          } else {
            alarmSound.release();
          }
        });
      };
      
      playLoop();
    });

    // Keep service running
    while (BackgroundService.isRunning()) {
      await new Promise(resolveDelay => setTimeout(resolveDelay, 1000));
    }
    
    resolve();
  });
};

export const startAlarmService = async () => {
  await BackgroundService.start(playAlarmSound, {
    taskName: 'AlarmService',
    taskTitle: 'Alarm is ringing',
    taskDesc: 'Your alarm is playing',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourapp://alarm',
    parameters: {
      delay: 1000,
    },
  });
};

export const stopAlarmService = async () => {
  await BackgroundService.stop();
};