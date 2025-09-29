import {createSlice} from '@reduxjs/toolkit';
import {TASK_DATA} from '../interface2';
import {TRACK_BOOK_QUESTION_OPTION_INTERFACE} from '../interface';
interface AppState {
  selectedDimensionNoOptions: TRACK_BOOK_QUESTION_OPTION_INTERFACE[];
}
const initialState: AppState = {
  selectedDimensionNoOptions: [],
};
export const AppSlice = createSlice({
  name: 'dimensionQuestionNoOptions',
  initialState,
  reducers: {
    setSelectedDimensionNoOptions: (state, {payload}) => {
      if (payload.length == 0) {
        state.selectedDimensionNoOptions = [];
      } else {
        const newItem = payload;
        const existingIndex = state.selectedDimensionNoOptions.findIndex(
          (item: any) =>
            Object.keys(item).every(key => item[key] === newItem[key]),
        );
        if (existingIndex !== -1) {
          // state.selectedDimensionNoOptions.splice(existingIndex, 1);
        } else {
          state.selectedDimensionNoOptions.push(newItem);
        }
      }
    },
  },
});
export const {setSelectedDimensionNoOptions} = AppSlice.actions;
export default AppSlice.reducer;
