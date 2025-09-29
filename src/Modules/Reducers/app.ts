import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Dimensions, TextStyle} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();
interface colorInterface {
  Primary: string;
  Primary2: string;
  Secondary: string;
  QuestionPaperBackground: string;
  Secondary2: string;
  mixed: string;
  White: string;
  Black: string;
  PrimaryText: string;
  PrimaryText1: string;
  PrimaryText2: string;
  Disable: string;
  BorderColor: string;
  Background: string;
  Rating: string;
  modalBackground: string;
  error: string;
  success: string;
}
const lightColor: colorInterface = {
  Primary: '#DB1E4E',
  Primary2: '#FA8682',
  Secondary: '#FF9374',
  QuestionPaperBackground: '#E3E4E6',
  Secondary2: '#FEDBDA',
  mixed: '#F3719B',
  White: '#FFFFFF',
  Black: '#000000',
  PrimaryText: '#6A6A6A',
  PrimaryText1: '#9E9E9E',
  PrimaryText2: '#828282',
  Disable: '#D9D9D9',
  BorderColor: '#000000',
  Background: '#FFFFFF',
  Rating: '#FFBB1D',
  modalBackground: 'rgba(0,0,0,0.5)',
  error: '#D70040',
  success: '#228B22',
};
const darkColor: colorInterface = {
  Primary: '#DB1E4E',
  Primary2: '#FA8682',
  Secondary: '#FF9374',
  Secondary2: '#FEDBDA',
  QuestionPaperBackground: '#E3E4E6',
  Disable: '#D9D9D9',
  BorderColor: '#000000',
  mixed: '#F3719B',
  White: '#FFFFFF',
  Black: '#000000',
  PrimaryText: '#6A6A6A',
  PrimaryText1: '#9E9E9E',
  PrimaryText2: '#828282',
  Background: '#FFFFFF',
  Rating: '#FFBB1D',
  modalBackground: 'rgba(0,0,0,0.5)',
  error: '#D70040',
  success: '#228B22',
};
interface AppState {
  Colors: colorInterface;
  Sizes: {
    Width: number;
    Height: number;
    ScreenPadding: number;
    Padding: number;
    Radius: number;
    Base: number;
    LowBase: number;
    header: number;
    Field: number;
    HighBase: number;
    Scale: number;
    Header: number;
  };
  Fonts: {
    Bold1: TextStyle;
    Bold2: TextStyle;
    Bold3: TextStyle;
    Bold4: TextStyle;
    Medium1: TextStyle;
    Medium2: TextStyle;
    Medium3: TextStyle;
    Medium4: TextStyle;
    Regular1: TextStyle;
    Regular2: TextStyle;
    Regular3: TextStyle;
  };
  showSplashScreen: boolean;
}
const initialState: AppState = {
  Colors: {
    Primary: '#0075CB',
    Primary2: '#47B2FF',
    Secondary: '#a1d7f0',
    QuestionPaperBackground: '#E3E4E6',
    Secondary2: '#FEDBDA',
    mixed: '#F3719B',
    White: '#FFFFFF',
    Black: '#000000',
    Disable: '#D9D9D9',
    BorderColor: '#000000',
    PrimaryText: '#6A6A6A',
    PrimaryText1: '#343434',
    PrimaryText2: '#9E9E9E',
    Background: '#f8f8ff',
    Rating: '#FFBB1D',
    modalBackground: 'rgba(0,0,0,0.5)',
    error: '#D70040',
    success: '#228B22',
  },
  Sizes: {
    Width: Dimensions.get('screen').width,
    Height: Dimensions.get('screen').height,
    Scale: Dimensions.get('screen').fontScale,
    ScreenPadding: wp(5),
    Padding: wp(4),
    Radius: wp(3),
    Base: wp(2),
    LowBase: wp(1),
    header: wp(12.4),
    Field: wp(11),
    HighBase: wp(4),
    Header: isTablet ? 70 : 50,
  },
  Fonts: {
    Bold1: {
      fontSize: wp(5),
      fontFamily: 'Poppins-Bold',
      letterSpacing: 0.59,
    },
    Bold2: {
      fontSize: wp(4),
      fontFamily: 'Poppins-Bold',
      letterSpacing: 0.59,
    },
    Bold3: {
      fontSize: wp(3),
      fontFamily: 'Poppins-Bold',
      letterSpacing: 0.59,
    },
    Bold4: {
      fontSize: wp(3.5),
      fontFamily: 'Poppins-Bold',
      letterSpacing: 0.59,
    },
    Medium1: {
      fontSize: wp(5),
      fontFamily: 'Poppins-Medium',
      letterSpacing: 0.59,
    },
    Medium2: {
      fontSize: wp(4),
      fontFamily: 'Poppins-Medium',
      letterSpacing: 0.59,
    },
    Medium3: {
      fontSize: wp(3),
      fontFamily: 'Poppins-Medium',
      letterSpacing: 0.59,
    },
    Medium4: {
      fontSize: wp(3.5),
      fontFamily: 'Poppins-Medium',
      letterSpacing: 0.59,
    },
    Regular1: {
      fontSize: wp(5),
      fontFamily: 'Poppins-Regular',
      letterSpacing: 0.59,
    },
    Regular2: {
      fontSize: wp(4),
      fontFamily: 'Poppins-Regular',
      letterSpacing: 0.59,
    },
    Regular3: {
      fontSize: wp(3),
      fontFamily: 'Poppins-Regular',
      letterSpacing: 0.59,
    },
  },
  showSplashScreen: true,
};
export const AppSlice = createSlice({
  name: 'App',
  initialState,
  reducers: {
    updateTheme: (state, {payload}: PayloadAction<'light' | 'dark'>) => {
      state.Colors = payload === 'light' ? lightColor : darkColor;
    },
    setShowSplash: (state, {payload}: PayloadAction<boolean>) => {
      state.showSplashScreen = payload;
    },
  },
});
export const {updateTheme, setShowSplash} = AppSlice.actions;
export default AppSlice.reducer;
