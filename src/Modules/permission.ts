import {Platform} from 'react-native';
import {
  PERMISSIONS,
  Permission,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';

const camera = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};
const image = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
};
const location = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};
// const readImages = {
//   ios: null,
//   android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
// };
const readExternal = {
  ios: null,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};
const location1 = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
};
// const readAudio = {
//   ios: null,
//   android: PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
// };

const notification = {
  ios: null,
  android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
};

const AllPermission = {
  // camera,
  image,
  location,
  location1,
  // readImages,
  readExternal,
  notification,
 
};

type RequestPermissions =
  // | 'camera'
  | 'image'
  | 'location'
  // | 'readImages'
  | 'readExternal'
  | 'location1'
  | 'notification'
 

class PermissionClass {
  checkAndRequest: (type: RequestPermissions) => Promise<boolean> =
    async type => {
      const permission =
        AllPermission[type][Platform.OS === 'ios' ? 'ios' : 'android'];
      if (!permission) {
        return true;
      }
      try {
        const result = await check(permission);
        if (result === RESULTS.GRANTED) {
          return true;
        } else {
          return await this.Request(permission);
        }
      } catch (error) {
        console.warn('Error in Checking Permission', error);
        return false;
      }
    };
  Request: (permission: Permission) => Promise<boolean> = async permission => {
    try {
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.warn('Error while Requesting Permission', error);
      return false;
    }
  };
  requestMultiple: (type: RequestPermissions[]) => Promise<boolean> = async (
    types: RequestPermissions[],
  ) => {
    try {
      const results = [];
      for (const type of types) {
        const permission =
          AllPermission[type][Platform.OS === 'ios' ? 'ios' : 'android'];
        if (permission) {
          results.push(await this.checkAndRequest(type));
        }
      }
      for (const result of results) {
        if (!result) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.warn('Error in Requesting Multiple Permissions', error);
      return false;
    }
  };
  requestAll: () => Promise<boolean> = async () => {
    try {
      const types: RequestPermissions[] = Object.keys(AllPermission);
      const results = [];
      for (const type of types) {
        const permission =
          AllPermission[type][Platform.OS === 'ios' ? 'ios' : 'android'];
        if (permission) {
          results.push(await this.checkAndRequest(type));
        }
      }
      return true;
    } catch (error) {
      console.warn('Error in Requesting Multiple Permissions', error);
      return false;
    }
  };
}
const Permissions = new PermissionClass();
export default Permissions;
