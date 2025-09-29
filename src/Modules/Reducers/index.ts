import {updateTheme, setShowSplash} from './app';
import {
  setMember,
  setYearMaster,
  setSubjectMaster,
  setAppUserData,
} from './member';
import {setStudentClassMapping, setTeacherClassMapping} from './teacher';
import {
  setQUESTION_TYPE,
  setQUESTION_SERIES,
  setQUESTIONS_SELECTED,
  setSUBJECT_SELECTED,
} from './QuestionPaperType';
import {
  setAnimationVideoData,
  setAnimationVideoTime,
  setAniVideoButtonStatus,
  setSelectedChallengeData,
  setSelectedTrackData,
} from './TrackModule';
import {
  setSelectedDimensionNoOptions,
  setSelectedDimensionOptionData,
  setSelectedDimensionYesOptions,
} from './DimensionQuestions';
import {setSelectedActivities} from './CustomActivities';
class AllReducer {
  updateTheme = updateTheme;
  setShowSplash = setShowSplash;
  setMember = setMember;
  setAppUserData = setAppUserData;
  setApp = setMember;
  setTeacherClassMapping = setTeacherClassMapping;
  setStudentClassMapping = setStudentClassMapping;
  setYearMaster = setYearMaster;
  setQUESTION_TYPE = setQUESTION_TYPE;
  setQUESTION_SERIES = setQUESTION_SERIES;
  setQUESTIONS_SELECTED = setQUESTIONS_SELECTED;
  setSUBJECT_SELECTED = setSUBJECT_SELECTED;
  setSubjectMaster = setSubjectMaster;
  setSelectedTrackData = setSelectedTrackData;
  setSelectedChallengeData = setSelectedChallengeData;
  setSelectedDimensionOptionData = setSelectedDimensionOptionData;
  setSelectedActivities = setSelectedActivities;
  setSelectedDimensionNoOptions = setSelectedDimensionNoOptions;
  setSelectedDimensionYesOptions = setSelectedDimensionYesOptions;
  setAniVideoButtonStatus = setAniVideoButtonStatus;
  setAnimationVideoData = setAnimationVideoData;
  setAnimationVideoTime = setAnimationVideoTime;
}
const Reducers = new AllReducer();
export default Reducers;
