import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  CLASS_TEACHER_MAPPING,
  MEMBER_INTERFACE,
  STUDENT_CLASS_MAPPING,
} from '../interface';

interface AppState {
  teacherClassMapping: CLASS_TEACHER_MAPPING[] | null;
  studentClassMapping: STUDENT_CLASS_MAPPING[] | null;
}
const initialState: AppState = {
  teacherClassMapping: null,
  studentClassMapping: null,
};
export const AppSlice = createSlice({
  name: 'Teacher',
  initialState,
  reducers: {
    setTeacherClassMapping: (state, {payload}) => {
      state.teacherClassMapping = payload;
    },
    setStudentClassMapping: (state, {payload}) => {
      state.studentClassMapping = payload;
    },
  },
});
export const {setTeacherClassMapping, setStudentClassMapping} =
  AppSlice.actions;
export default AppSlice.reducer;
