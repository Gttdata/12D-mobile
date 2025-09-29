import {NavigationContainer} from '@react-navigation/native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import React from 'react';
import TabNavigation from './TabNavigation';
import Dashboard from './screens/Dashboard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import StudentList from './screens/Teacher/StudentList';
import StudentListDetails from './screens/Teacher/StudentListDetails';
import Assignment from './screens/Teacher/Assignment';
import AssignmentDetails from './screens/Teacher/AssignmentDetails';
import SubjectScreen from './screens/QuestionPaperModule/SubjectScreen';
import CustomPaper from './screens/QuestionPaperModule/CustomPaper/CustomPaper';
import ExportPdf from './screens/QuestionPaperModule/CustomPaper/ExportPdf';
import Drawer from './screens/Drawer';
import CreateQuestionPapers from './screens/QuestionPaperModule/CreateQuestionsPapers/CreateQuestionPapers';
import {
  CUSTOM_HEAD_CATEGORY,
  DIMENSION_INTERFACE,
  FEE_DETAILS_INTERFACE,
  HEALTH_FITNESS_ACTIVITY,
  HEATH_FATTENS_ACTIVITY,
  HEATH_FATTENS_CATEGORY,
  PERIOD_TRACKING_RECORD,
  SCHOOL_INFO,
  STUDENT_CLASS_MAPPING,
  TEACHER_CLASS_TASK,
  TRACK_BOOK_QUESTION_INTERFACE,
  WEEKLY_PLANNER_INTERFACE,
  selectData,
} from './Modules/interface';

import StudentTask from './screens/Student/StudentTask';
import QuestionTypeList from './screens/QuestionPaperModule/CreateQuestionsPapers/QuestionTypeList';
import AddTaskForm from './screens/Tasks/AddTaskForm';
import Tasks from './screens/Tasks/Tasks';
import CustomCalendar from './screens/Tasks/Calender';
import SchoolRegistration from './auth/SchoolRegistration/SchoolRegistration';
import StatusList from './auth/SchoolRegistration/StatusList';
import StudentRegistrationScreen from './screens/StudentRegistration/StudentRegistrationScreen';
import TeacherRegistrationScreen from './screens/TeacherRegistration/TeacherRegistrationScreen';
import RegistrationScreen from './auth/SchoolRegistration/RegistrationScreen';
import StudentAttendanceShow from './screens/Attendance/StudentAttendanceShow';
import ClassTeacherAttendance from './screens/Attendance/ClassTeacherAttendance';
import SubjectTeachAttendance from './screens/Attendance/SubjectTeacherAttendance';
import Profile from './screens/Profile';
import Community from './screens/Community/Community';
import PrivacyPolicy from './screens/DrawerScreens/PrivacyPolicy';
import TermsAndCondition from './screens/DrawerScreens/TermsAndCondition';
import StudentTaskCalender from './screens/Student/StudentTaskCalender';
import SubjectSelectionScreen from './screens/QuestionPaperModule/SubjectSelectionScreen';
import Settings from './screens/DrawerScreens/Settings';
import Demo from './AnimationDemo/Demo';
import TimeDemo from './AnimationDemo/TimeDemo';
import {SUBJECT_TEACHER_MASTER} from './Modules/interface';
import SelectionComponent from './Components/SelectionComponent';
import TeacherStudentApproveList from './screens/Teacher/TeacherStudentApproveList';
import AddQuestion from './screens/QuestionPaperModule/AddingQuestions/AddQuestion';
import ChildrenClassSection from './screens/QuestionPaperModule/QuestionPaperForChilderns/ChildrenClassSection';
import QuestionPaperSelection from './screens/QuestionPaperModule/QuestionPaperForChilderns/QuestionPaperSelection';
import ExamDetails from './screens/QuestionPaperModule/QuestionPaperForChilderns/ExamDetails';
import ChildrenSubjectSelection from './screens/QuestionPaperModule/QuestionPaperForChilderns/ChildrenSubjectSelection';
import {
  BOARD_SUBJECT_INTERFACE,
  GET_BOARD_CLASS,
  TASK_DATA,
} from './Modules/interface2';
import WeekPlanAddTask from './screens/Tasks/WeeklyPlanner/WeekPlanAddTask';
import WeeklyCalender from './screens/Tasks/WeeklyPlanner/WeeklyCalender';
import WeeklyTask from './screens/Tasks/WeeklyPlanner/WeeklyTask';
import HealthAndFitnessHome from './screens/HealthAndFitnessModule/HealthAndFitnessHome';
import PremiumHome from './screens/GetPremium/PremiumHome';
import WorkoutList from './screens/HealthAndFitnessModule/WorkoutList';
import WorkoutDetails from './screens/HealthAndFitnessModule/WorkoutDetails';
import StartWorkout from './screens/HealthAndFitnessModule/StartWorkout';
import CompletionScreen from './screens/HealthAndFitnessModule/CompletionScreen';
import AnimationBoard from './screens/AnimationBoard';
import Task from './screens/TrackModule/Task';
import Dimensions from './screens/TrackModule/Dimensions';
import TrackBookQuestions from './screens/TrackModule/TrackBookQuestions';
import DimensionQuestions from './screens/TrackModule/DimensionQuestions';
import SelectChallenges from './screens/TrackModule/SelectChallenges';
import Questionnaires from './screens/TrackModule/Questionnaires';
import GetTasks from './screens/TrackModule/GetTasks';
import RewardScreen from './screens/TrackModule/RewardScreen';
import CreatecustomList from './screens/HealthAndFitnessModule/CustomActivity/CreatecustomList';
import SelectActivities from './screens/HealthAndFitnessModule/CustomActivity/SelectActivities';
import CustomList from './screens/HealthAndFitnessModule/CustomActivity/CustomList';
import TodoList from './screens/TodoList/TodoList';
import DigitalDetoxConfig from './screens/DigitalDetox/DigitalDetoxConfig';
import CustomWorkoutList from './screens/HealthAndFitnessModule/CustomActivity/CustomWorkoutList';
import NotificationHome from './screens/Notifications/NotificationHome';
import Feedback from './screens/DrawerScreens/Feedback';
import SubTaskList from './screens/TodoList/SubTaskList';
import TodoCalenderFilter from './screens/TodoList/TodoCalenderFilter';
import ColorTagFilter from './screens/Tasks/WeeklyPlanner/ColorTagFilter';
import DigitalWellBing from './screens/DigitalDetox/DigitalWellBing';
import CreateAttendance from './screens/CreateAttendance/CreateAttendance';
import UpdateCustomActivities from './screens/HealthAndFitnessModule/CustomActivity/UpdateCustomActivities';
import Disclaimer from './screens/DrawerScreens/Disclaimer';
import HelpAndSupport from './screens/DrawerScreens/HelpAndSupport';
import SelectTaskType from './screens/TrackModule/SelectTaskType';
import TimePeriodQuestionary from './screens/TimePeriod/TimePeriodQuestionary';
import UpdateData from './screens/TimePeriod/UpdateData';
import NeverMenstruate from './screens/TimePeriod/NeverMenstruated';
import ShortMenstruatedDelay from './screens/TimePeriod/ShortMenstruatedDelay';
import SignificantMenstruatedDelay from './screens/TimePeriod/SignificantMenstruatedDelay';
import OvulationDuringPregnancy from './screens/TimePeriod/OvulationDuringPregnancy';
import SymptomsOfOvulation from './screens/TimePeriod/SymptomsOfOvulation';
import BreastCancerPrevention from './screens/TimePeriod/BreastCancerPrevention';
import CircleCalender from './screens/TimePeriod/CircleCalender';
import ScrollCalender from './screens/TimePeriod/ScrollCalender';
import DescriptionActivity from './screens/HealthAndFitnessModule/CustomActivity/DescriptionActivity';
import BmiQuestions from './screens/HealthAndFitnessModule/BmiCalculator/BmiQuestions';
import BmiCompeted from './screens/HealthAndFitnessModule/BmiCalculator/BmiCompeted';
import ExportPdfData from './screens/QuestionPaperModule/CustomPaper/ExportPdfData';
import BMI_CALCULATOR from './screens/HealthAndFitnessModule/BmiCalculator/BMI_CALCULATOR';
import ClassSelectionScreen from './screens/QPModule/ClassSelectionScreen';
import ErpDashboard from './screens/ErpDashboard';
import AppInfo from './screens/DrawerScreens/AppInfo';
import FeeStructure from './screens/Student/FeeStructure';
import TrackTermsAndConditions from './screens/TrackModule/TrackTermsAndConditions';
import HolidayShow from './screens/Holiday/HolidayShow';

type dataState = {
  Time: string;
  TotalMarks: string;
  Date: string;
  TestName: string;
  InstituteName: string;
  Medium: string;
  PaperFormat: any[];
  SUBJECT_SELECTED: BOARD_SUBJECT_INTERFACE;
};
export type StackParams = {
  SchoolRegistration: {
    schoolInfo: SCHOOL_INFO | any;
  };

  Demo: undefined;
  DigitalDetoxConfig: undefined;
  RewardScreen: undefined;
  AnimationBoard: undefined;
  PremiumHome: undefined;
  DigitalWellBing: undefined;
  TimeDemo: undefined;
  CustomPaper: undefined;
  Dashboard: undefined;
  ErpDashboard: undefined;
  StudentList: undefined;
  BmiQuestions: undefined;
  BMI_CALCULATOR: undefined;
  ExamDetails: undefined;
  GetTasks: {type: string};
  StatusList: undefined;
  TeacherStudentApproveList: {
    filter: SUBJECT_TEACHER_MASTER;
  };
  StudentListDetails: {
    feeData: FEE_DETAILS_INTERFACE;
    studentData: STUDENT_CLASS_MAPPING;
  };

  TrackBookQuestions: undefined;
  DescriptionActivity: {
    Item: HEALTH_FITNESS_ACTIVITY[];
    CURRANT_ITEM: HEALTH_FITNESS_ACTIVITY;
  };
  Dimensions: undefined;
  DimensionQuestions: {
    itemData: DIMENSION_INTERFACE;
    call: string;
    headID: TRACK_BOOK_QUESTION_INTERFACE;
  };
  Assignment: undefined;
  AssignmentDetails: {
    item: TEACHER_CLASS_TASK;
  };
  SubjectScreen: undefined;
  ExportPdf: {
    Item: any;
    Type: any;
  };
  ExportPdfData: {
    Type: any;
    Data: any;
    Item: any;
  };
  CreateQuestionPapers: undefined;
  StudentTask: undefined;
  StudentAttendance: undefined;
  QuestionTypeList: undefined;
  AddTaskForm: {
    item: WEEKLY_PLANNER_INTERFACE | null;
    type: string;
    pageType: string;
  };
  WeekPlanAddTask: {
    item: WEEKLY_PLANNER_INTERFACE | null;
    type: string;
    selectedDateArray: any;
  };
  Tasks: undefined;
  Task: {
    type: string;
  };
  WeeklyTask: undefined;
  CustomCalendar: {animation: string};
  WeeklyCalender: {animation: string};
  ClassTeacherAttendance: {
    item: SUBJECT_TEACHER_MASTER;
    Teacher: string;
  };
  StudentAttendanceShow: undefined;
  CreateAttendance: {
    Filter: selectData;
    Teacher: string;
  };

  SubjectTeachAttendance: {
    item: SUBJECT_TEACHER_MASTER;
    Teacher: string;
  };
  RegistrationScreen: {
    schoolInfo: SCHOOL_INFO | any;
    email: string;
  };
  TeacherRegistrationScreen: undefined;
  Community: undefined;
  StudentTaskCalender: {
    studentClassId: any;
  };
  PrivacyPolicy: undefined;
  TermsAndCondition: undefined;
  StudentRegistrationScreen: undefined;
  Profile: undefined;
  ChildrenClassSection: undefined;
  ChildrenSubjectSelection: {item: GET_BOARD_CLASS};
  Drawer: undefined;
  TabNavigation: undefined;
  SubjectSelectionScreen: undefined;
  Settings: undefined;
  SelectionComponent: undefined;
  SelectChallenges: undefined;
  AddQuestion: undefined;
  HealthAndFitnessHome: undefined;
  WorkoutList: {
    index: number;
    Item: HEATH_FATTENS_CATEGORY;
  };
  CustomWorkoutList: {
    Item: HEATH_FATTENS_CATEGORY;
    index: number;
  };

  StartWorkout: {
    Item: HEATH_FATTENS_ACTIVITY[];
    prevWorkPerentage: number;
    TotalActivity: HEATH_FATTENS_ACTIVITY[];
    masterId: any;
    tabName: string;
    REST_TIME: any;
    ACTIVITY_TYPE: string
  };
  WorkoutDetails: {
    Item: HEATH_FATTENS_ACTIVITY[] | any;
    CURRANT_ITEM: HEATH_FATTENS_ACTIVITY | any;
  };
  CompletionScreen: undefined;
  Questionnaires: {Item: TASK_DATA};
  QuestionPaperSelection: {Item: dataState};
  CreatecustomList: {
    data: any[];
    type: string;
    HEAD_ID: any;
  };
  SelectActivities: {
    Item: HEATH_FATTENS_ACTIVITY;
  };
  CustomList: undefined;
  TodoList: undefined;
  NotificationHome: undefined;
  Feedback: undefined;
  SubTaskList: {
    item: WEEKLY_PLANNER_INTERFACE;
  };
  TodoCalenderFilter: undefined;
  ColorTagFilter: undefined;
  UpdateCustomActivities: {
    Item: HEATH_FATTENS_ACTIVITY | any;
  };
  Disclaimer: undefined;
  HelpAndSupport: undefined;
  SelectTaskType: undefined;
  TimePeriodQuestionary: {
    type: string;
    item: PERIOD_TRACKING_RECORD;
  };
  CircleCalender: {openPopUp: boolean};
  ScrollCalender: undefined;
  UpdateData: {item: PERIOD_TRACKING_RECORD};
  NeverMenstruate: undefined;
  ShortMenstruatedDelay: undefined;
  SignificantMenstruatedDelay: undefined;
  OvulationDuringPregnancy: undefined;
  SymptomsOfOvulation: undefined;
  BreastCancerPrevention: undefined;
  BmiCompeted: {BMI: number};
  ClassSelectionScreen: undefined;
  AppInfo: undefined;
  FeeStructure: undefined;
  TrackTermsAndConditions: undefined;
  HolidayShow: undefined;
};
const stack = createSharedElementStackNavigator<StackParams>();

export type StackProps<ScreenName extends keyof StackParams> =
  NativeStackScreenProps<StackParams, ScreenName>;

const route = (): JSX.Element => {
  return (
    <NavigationContainer>
      <stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{headerShown: false}}>
        <stack.Screen name="Dashboard" component={Dashboard} />
        <stack.Screen name="ErpDashboard" component={ErpDashboard} />
        <stack.Screen
          name="CreateQuestionPapers"
          component={CreateQuestionPapers}
        />
        <stack.Screen name="ExportPdf" component={ExportPdf} />
        <stack.Screen name="ExportPdfData" component={ExportPdfData} />
        <stack.Screen name="RewardScreen" component={RewardScreen} />
        <stack.Screen name="Task" component={Task} />
        <stack.Screen name="GetTasks" component={GetTasks} />
        <stack.Screen
          name="DigitalDetoxConfig"
          component={DigitalDetoxConfig}
        />
        <stack.Screen name="AnimationBoard" component={AnimationBoard} />
        <stack.Screen name="ExamDetails" component={ExamDetails} />
        <stack.Screen name="StudentTask" component={StudentTask} />
        <stack.Screen name="CustomPaper" component={CustomPaper} />
        <stack.Screen name="Tasks" component={Tasks} />
        <stack.Screen name="WeeklyTask" component={WeeklyTask} />
        <stack.Screen
          name="ChildrenClassSection"
          component={ChildrenClassSection}
        />
        <stack.Screen
          name="ChildrenSubjectSelection"
          component={ChildrenSubjectSelection}
        />
        <stack.Screen name="TabNavigation" component={TabNavigation} />
        <stack.Screen name="StudentList" component={StudentList} />
        <stack.Screen name="CompletionScreen" component={CompletionScreen} />
        <stack.Screen name="StartWorkout" component={StartWorkout} />
        <stack.Screen name="WorkoutDetails" component={WorkoutDetails} />
        <stack.Screen name="PremiumHome" component={PremiumHome} />
        <stack.Screen name="WorkoutList" component={WorkoutList} />
        <stack.Screen
          name="TeacherStudentApproveList"
          component={TeacherStudentApproveList}
        />
        <stack.Screen
          name="AddTaskForm"
          component={AddTaskForm}
          options={{presentation: 'transparentModal'}}
        />
        <stack.Screen
          name="WeekPlanAddTask"
          component={WeekPlanAddTask}
          options={{presentation: 'transparentModal'}}
        />
        <stack.Screen name="SubjectScreen" component={SubjectScreen} />
        <stack.Screen
          name="HealthAndFitnessHome"
          component={HealthAndFitnessHome}
        />
        <stack.Screen
          name="TrackBookQuestions"
          component={TrackBookQuestions}
        />
        <stack.Screen name="Dimensions" component={Dimensions} />
        <stack.Screen
          name="DimensionQuestions"
          component={DimensionQuestions}
        />
        <stack.Screen name="CustomCalendar" component={CustomCalendar} />
        <stack.Screen name="WeeklyCalender" component={WeeklyCalender} />
        <stack.Screen name="QuestionTypeList" component={QuestionTypeList} />
        <stack.Screen
          name="StudentListDetails"
          component={StudentListDetails}
        />
        <stack.Screen name="Assignment" component={Assignment} />
        <stack.Screen name="AssignmentDetails" component={AssignmentDetails} />
        <stack.Screen
          name="SchoolRegistration"
          component={SchoolRegistration}
        />
        <stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
        />
        <stack.Screen name="StatusList" component={StatusList} />
        <stack.Screen
          name="StudentRegistrationScreen"
          component={StudentRegistrationScreen}
        />
        <stack.Screen
          name="TeacherRegistrationScreen"
          component={TeacherRegistrationScreen}
        />
        <stack.Screen
          name="Drawer"
          component={Drawer}
          options={{presentation: 'transparentModal'}}
        />
        <stack.Screen name="Profile" component={Profile} />
        <stack.Screen
          name="QuestionPaperSelection"
          component={QuestionPaperSelection}
        />
        <stack.Screen name="CreateAttendance" component={CreateAttendance} />
        <stack.Screen
          name="StudentAttendanceShow"
          component={StudentAttendanceShow}
        />
        <stack.Screen
          name="SubjectSelectionScreen"
          component={SubjectSelectionScreen}
        />
        <stack.Screen
          name="SubjectTeachAttendance"
          component={SubjectTeachAttendance}
        />
        <stack.Screen
          name="ClassTeacherAttendance"
          component={ClassTeacherAttendance}
        />
        <stack.Screen
          name="StudentTaskCalender"
          component={StudentTaskCalender}
        />
        <stack.Screen name="Community" component={Community} />
        <stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
        <stack.Screen name="Settings" component={Settings} />
        <stack.Screen name="DigitalWellBing" component={DigitalWellBing} />
        <stack.Screen name="Demo" component={Demo} />
        <stack.Screen name="TimeDemo" component={TimeDemo} />
        <stack.Screen
          name="SelectionComponent"
          component={SelectionComponent}
        />
        <stack.Screen name="SelectChallenges" component={SelectChallenges} />
        <stack.Screen name="AddQuestion" component={AddQuestion} />
        <stack.Screen name="Questionnaires" component={Questionnaires} />
        <stack.Screen name="CreatecustomList" component={CreatecustomList} />
        <stack.Screen name="SelectActivities" component={SelectActivities} />
        <stack.Screen name="CustomList" component={CustomList} />
        <stack.Screen name="TodoList" component={TodoList} />
        <stack.Screen name="CustomWorkoutList" component={CustomWorkoutList} />
        <stack.Screen
          name="DescriptionActivity"
          component={DescriptionActivity}
        />
        <stack.Screen name="NotificationHome" component={NotificationHome} />
        <stack.Screen name="Feedback" component={Feedback} />
        <stack.Screen name="SubTaskList" component={SubTaskList} />
        <stack.Screen
          name="TodoCalenderFilter"
          component={TodoCalenderFilter}
        />
        <stack.Screen name="ColorTagFilter" component={ColorTagFilter} />
        <stack.Screen
          name="UpdateCustomActivities"
          component={UpdateCustomActivities}
        />
        <stack.Screen name="Disclaimer" component={Disclaimer} />
        <stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
        <stack.Screen name="SelectTaskType" component={SelectTaskType} />
        <stack.Screen
          name="TimePeriodQuestionary"
          component={TimePeriodQuestionary}
        />
        <stack.Screen name="CircleCalender" component={CircleCalender} />
        <stack.Screen name="ScrollCalender" component={ScrollCalender} />
        <stack.Screen name="UpdateData" component={UpdateData} />
        <stack.Screen name="NeverMenstruate" component={NeverMenstruate} />
        <stack.Screen
          name="ShortMenstruatedDelay"
          component={ShortMenstruatedDelay}
        />
        <stack.Screen
          name="SignificantMenstruatedDelay"
          component={SignificantMenstruatedDelay}
        />
        <stack.Screen
          name="OvulationDuringPregnancy"
          component={OvulationDuringPregnancy}
        />
        <stack.Screen
          name="SymptomsOfOvulation"
          component={SymptomsOfOvulation}
        />
        <stack.Screen
          name="BreastCancerPrevention"
          component={BreastCancerPrevention}
        />
        //Bmi Module
        <stack.Screen name="BmiQuestions" component={BmiQuestions} />
        <stack.Screen name="BmiCompeted" component={BmiCompeted} />
        <stack.Screen name="BMI_CALCULATOR" component={BMI_CALCULATOR} />
        <stack.Screen
          name="ClassSelectionScreen"
          component={ClassSelectionScreen}
        />
        <stack.Screen name="AppInfo" component={AppInfo} />
        <stack.Screen name="FeeStructure" component={FeeStructure} />
        <stack.Screen name='TrackTermsAndConditions' component={TrackTermsAndConditions}/>
        <stack.Screen name='HolidayShow' component={HolidayShow}/>
      </stack.Navigator>
    </NavigationContainer>
  );
};

export default route;
