import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  BOARD_SUBJECT_INTERFACE,
  QUESTION_SERIES,
  QUESTION_TYPE,
  QUESTIONS_SELECTED,
} from '../interface';

interface AppState {
  QUESTION_TYPE: QUESTION_TYPE[] | null;
  QUESTION_SERIES: QUESTION_SERIES[] | null;
  QUESTIONS_SELECTED: QUESTIONS_SELECTED[] | null;
  SUBJECT_SELECTED: BOARD_SUBJECT_INTERFACE | null;
}
const initialState: AppState = {
  QUESTION_TYPE: [],
  QUESTION_SERIES: null,
  QUESTIONS_SELECTED: null,
  SUBJECT_SELECTED: null,
};
export const AppSlice = createSlice({
  name: 'QuestionType',
  initialState,
  reducers: {
    setQUESTION_TYPE: (state, {payload}) => {
      state.QUESTION_TYPE = payload;
    },
    setQUESTION_SERIES: (state, {payload}) => {
      state.QUESTION_SERIES = payload;
    },
    setQUESTIONS_SELECTED: (state, {payload}) => {
      state.QUESTIONS_SELECTED = payload;
    },
    setSUBJECT_SELECTED: (state, {payload}) => {
      state.SUBJECT_SELECTED = payload;
    },
  },
});
export const {
  setQUESTION_TYPE,
  setQUESTION_SERIES,
  setQUESTIONS_SELECTED,
  setSUBJECT_SELECTED,
} = AppSlice.actions;
export default AppSlice.reducer;
