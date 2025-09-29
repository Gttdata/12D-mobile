import {configureStore} from '@reduxjs/toolkit';
import AppReducer from './app';
import MemberReducer from './member';
import TeacherReducer from './teacher';
import QuestionPaperType from './QuestionPaperType';
import {
  useDispatch as useAppDispatch,
  useSelector as AppSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import TrackModule from './TrackModule';
import DimensionQuestions from './DimensionQuestions';
import CustomActivities from './CustomActivities';

export const store = configureStore({
  reducer: {
    app: AppReducer,
    member: MemberReducer,
    teacher: TeacherReducer,
    QuestionPaperType: QuestionPaperType,
    trackModule: TrackModule,
    dimensionQuestion: DimensionQuestions,
    customActivity: CustomActivities,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = AppSelector;
