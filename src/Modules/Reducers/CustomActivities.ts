import {createSlice} from '@reduxjs/toolkit';
import {HEALTH_FITNESS_ACTIVITY} from '../interface';
interface AppState {
  selectedActivities: HEALTH_FITNESS_ACTIVITY[];
}
const initialState: AppState = {
  selectedActivities: [],
};
export const AppSlice = createSlice({
  name: 'customActivity',
  initialState,
  reducers: {
    setSelectedActivities: (state, {payload}) => {
      const newItem = payload;
      if (payload.length == 0) {
        state.selectedActivities = [];
      } else {
        const existingIndex = state.selectedActivities.findIndex(
          (item: any) =>
            item.ID === newItem.ID &&
            item.ACTIVITY_CATEGORY_ID === newItem.ACTIVITY_CATEGORY_ID,
        );
        if (existingIndex !== -1) {
          state.selectedActivities.splice(existingIndex, 1);
        } else {
          state.selectedActivities.push(newItem);
        }
      }
    },
  },
});
export const {setSelectedActivities} = AppSlice.actions;
export default AppSlice.reducer;
