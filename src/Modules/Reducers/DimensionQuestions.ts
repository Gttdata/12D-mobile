import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {TRACK_BOOK_QUESTION_OPTION_INTERFACE} from '../interface';
interface AppState {
  selectedDimensionOptionData: TRACK_BOOK_QUESTION_OPTION_INTERFACE[];
  selectedDimensionYesOptions: {[key: string]: string};
}
const initialState: AppState = {
  selectedDimensionOptionData: [],
  selectedDimensionYesOptions: {},
};
export const AppSlice = createSlice({
  name: 'dimensionQuestion',
  initialState,
  reducers: {
    setSelectedDimensionOptionData: (state, {payload}) => {
      const newItem: TRACK_BOOK_QUESTION_OPTION_INTERFACE = payload;
      if (payload.length == 0) {
        state.selectedDimensionOptionData = [];
      } else {
        switch (newItem.QUESTION_TYPE) {
          case 1:
            state.selectedDimensionOptionData =
              state.selectedDimensionOptionData.filter(
                item => item.QUESTION_ID !== newItem.QUESTION_ID,
              );
            state.selectedDimensionOptionData.push(newItem);
            break;

          case 2:
            const existingIndex = state.selectedDimensionOptionData.findIndex(
              (item: any) =>
                Object.keys(item).every(key => item[key] === newItem[key]),
            );
            if (existingIndex !== -1) {
              state.selectedDimensionOptionData.splice(existingIndex, 1);
            } else {
              state.selectedDimensionOptionData.push(newItem);
            }
            break;

          case 3:
            state.selectedDimensionOptionData =
              state.selectedDimensionOptionData.filter(
                item => item.QUESTION_ID !== newItem.QUESTION_ID,
              );
            state.selectedDimensionOptionData.push(newItem);
            break;

          default:
            // console.log('Unknown question type.');
        }
      }
    },
    setSelectedDimensionNoOptions: (state, {payload}) => {
      if (payload.length === 0) {
        state.selectedDimensionOptionData = [];
      } else {
        payload.forEach((newItem: TRACK_BOOK_QUESTION_OPTION_INTERFACE) => {
          if (newItem.LABEL === 'NO') {
            state.selectedDimensionOptionData =
              state.selectedDimensionOptionData.filter(
                item => item.QUESTION_ID !== newItem.QUESTION_ID,
              );
          } else {
            state.selectedDimensionOptionData =
              state.selectedDimensionOptionData.filter(
                item => item.QUESTION_ID !== newItem.ID,
              );
          }
        });

        if (
          payload.some(
            (item: TRACK_BOOK_QUESTION_OPTION_INTERFACE) => item.LABEL === 'NO',
          )
        ) {
          state.selectedDimensionOptionData = [
            ...state.selectedDimensionOptionData,
            ...payload,
          ];
        }
      }
    },
    setSelectedDimensionYesOptions: (
      state,
      {
        payload,
      }: PayloadAction<{
        item: TRACK_BOOK_QUESTION_OPTION_INTERFACE | any;
        optionKey: string;
      }>,
    ) => {
      const {item, optionKey} = payload;
      if (item.ID == undefined) {
        state.selectedDimensionYesOptions = {};
      } else {
        state.selectedDimensionYesOptions = {
          ...state.selectedDimensionYesOptions,
          [item.ID]: optionKey,
        };
      }
    },
  },
});
export const {
  setSelectedDimensionOptionData,
  setSelectedDimensionNoOptions,
  setSelectedDimensionYesOptions,
} = AppSlice.actions;
export default AppSlice.reducer;
