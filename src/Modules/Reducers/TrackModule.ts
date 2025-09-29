import {createSlice} from '@reduxjs/toolkit';
import {TASK_DATA} from '../interface2';
interface VideoInterface {
  startTime: number;
  endTime: number;
  seqNo: null;
}
interface AppState {
  selectedTrackData: TASK_DATA[];
  selectedChallengeData: TASK_DATA[];
  aniVideoButtonStatus: boolean;
  animationVideoData: any;
  animationVideoTime: VideoInterface;
}
const initialState: AppState = {
  selectedTrackData: [],
  selectedChallengeData: [],
  aniVideoButtonStatus: false,
  animationVideoData: {},
  animationVideoTime: {
    startTime: 0,
    endTime: 0,
    seqNo: null,
  },
};
export const AppSlice = createSlice({
  name: 'trackModule',
  initialState,
  reducers: {
    setSelectedTrackData: (state, {payload}) => {
      //   state.selectedTrackData.push(payload);
      if (payload.length == 0) {
        state.selectedTrackData = [];
      } else {
        const newItem = payload;
        const existingIndex = state.selectedTrackData.findIndex((item: any) =>
          Object.keys(item).every(key => item[key] === newItem[key]),
        );
        if (existingIndex !== -1) {
          state.selectedTrackData.splice(existingIndex, 1);
        } else {
          state.selectedTrackData.push(newItem);
        }
      }
    },
    setSelectedChallengeData: (state, { payload: newItem }) => {
      // If you dispatch with null (or undefined) to clear:
      if (!newItem) {
        state.selectedChallengeData = [];
        return;
      }
    
      // Is this the one already selected?
      const isSelected =
        state.selectedChallengeData.length > 0 &&
        state.selectedChallengeData[0].ID === newItem.id;
    
      if (isSelected) {
        // toggle off
        state.selectedChallengeData = [];
      } else {
        // select this one (clearing any previous)
        state.selectedChallengeData = [newItem];
      }
    },
    
    setAniVideoButtonStatus: (state, {payload}) => {
      state.aniVideoButtonStatus = payload;
    },
    setAnimationVideoData: (state, {payload}) => {
      state.animationVideoData = payload;
    },
    setAnimationVideoTime: (state, {payload}) => {
      state.animationVideoTime.startTime = parseFloat(payload.START_DURATION);
      state.animationVideoTime.endTime = parseFloat(payload.END_DURATION);
      state.animationVideoTime.seqNo = payload.SEQ_NO;
    },
  },
});
export const {
  setSelectedTrackData,
  setSelectedChallengeData,
  setAniVideoButtonStatus,
  setAnimationVideoData,
  setAnimationVideoTime,
} = AppSlice.actions;
export default AppSlice.reducer;
