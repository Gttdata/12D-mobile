import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {MEMBER_INTERFACE, YEAR, SUBJECT_INTERFACE} from '../interface';
import {ImageSourcePropType} from 'react-native';
import {emptyImg} from '../../../assets';
interface AppState {
  member: MEMBER_INTERFACE | null;
  appUserData: Array<MEMBER_INTERFACE>;
  location: string;
  profile: ImageSourcePropType;
  yearMaster: YEAR[] | null;
  subjectMaster: SUBJECT_INTERFACE[] | null;
}
const initialState: AppState = {
  member: null,
  appUserData: [],
  location: '',
  profile: emptyImg,
  yearMaster: null,
  subjectMaster: null,
};
export const AppSlice = createSlice({
  name: 'Member',
  initialState,
  reducers: {
    setMember: (
      state,
      {
        payload,
      }: PayloadAction<{
        user: MEMBER_INTERFACE;
        location: string;
        profile: ImageSourcePropType;
      }>,
    ) => {
      state.member = payload.user;
      state.location = payload.location;
      state.profile = payload.profile;
    },
    setAppUserData: (state, {payload}) => {
      state.appUserData = payload;
    },
    setYearMaster: (state, {payload}) => {
      state.yearMaster = payload;
    },
    setSubjectMaster: (state, {payload}) => {
      state.subjectMaster = payload;
    },
    onLogout: (state, {}) => {
      state.member = null;
    },
  },
});
export const {
  setMember,
  setAppUserData,
  setYearMaster,
  setSubjectMaster,
  onLogout,
} = AppSlice.actions;
export default AppSlice.reducer;
