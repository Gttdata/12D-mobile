interface MEMBER_INTERFACE {
  APP_USER_ID: number | null;
  ADDRESS: string;
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CLASS_ID: any;
  CITY_NAME: string;
  CREATED_MODIFIED_DATE: string;
  DOB: string;
  EMAIL_ID: string;
  GENDER: string;
  ID: number;
  MOBILE_NUMBER: string;
  NAME: string;
  PASSWORD: string;
  READ_ONLY: string;
  REJECT_BLOCKED_REMARK: string | null;
  ROLE_ID: number;
  SCHOOL_ID: number | null;
  SCHOOL_NAME: string | null;
  SEQ_NO: number;
  STATUS: number;
  TEACHER_STATUS: string | null;
  TEMP_CLASS_ID: string;
  TEMP_SUBJECT_ID: number | null;
  YEAR_ID: number | null;
  PROFILE_PHOTO: '';
}
interface SCHOOL_INFO {
  DESCRIPTION: string;
  ADDRESS: string;
  ARCHIVE_FLAG: string;
  BOARD_ID: number;
  BOARD_MEDIUM_ID: number | null;
  BOARD_MEDIUM_NAME: string | null;
  BOARD_NAME: string;
  CITY_ID: number | null;
  CLIENT_ID: number;
  COUNTRY_ID: number;
  COUNTRY_NAME: string;
  CREATED_MODIFIED_DATE: string;
  DISTRICT_ID: number;
  DISTRICT_NAME: string;
  EMAIL_ID: string;
  ID: number;
  PASSWORD: string;
  PHONE_NUMBER: string;
  PINCODE: string;
  PRINCIPLE_ID: number | null;
  PRINCIPLE_NAME: string | null;
  READ_ONLY: string;
  REJECT_BLOCKED_REMARK: string | null;
  SCHOOL_NAME: string;
  SCHOOL_STATUS: string;
  SEQ_NO: number | null;
  STATE_ID: number;
  STATE_NAME: string;
  STATUS: number;
  UPI_ID: string | null;
  YEAR: string;
  YEAR_ID: number;
}
interface AttendanceRecord {
  ARCHIVE_FLAG: string;
  ATTENDANCE_ID: number;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DATE: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  ID: number;
  IS_CLASS_ATTENDANCE: number;
  LECTURE_TIME: string;
  READ_ONLY: string;
  SCHOOL_ID: number;
  STATUS: string;
  STUDENT_ID: number;
  STUDENT_NAME: string;
  SUBJECT_ID: number;
  SUBJECT_NAME: string;
  TEACHER_ID: number;
}
interface BMI_QUESTIONS {
  USER_ID: number;
  WEIGHT: number;
  WEIGHT_UNIT:string;
  HEIGHT: number;
  HEIGHT_UNIT:number;
  BMI: number;
  CREATED_DATETIME: string;
}
interface PermissionState  {
  Usages: boolean;
  DisplayOver: boolean;
};

interface APP_USER_INTERFACE {
  ADDRESS: string | null;
  APP_USER_ID: number;
  ARCHIVE_FLAG: string;
  CITY_ID: number | null;
  CLASS_ID: number;
  CLIENT_ID: number;
  COUNTRY_ID: number | null;
  COUNTRY_NAME: string | null;
  CREATED_MODIFIED_DATE: string;
  DISTRICT_ID: number | null;
  DISTRICT_NAME: string | null;
  DOB: string | null;
  EMAIL_ID: string | null;
  GENDER: string;
  ID: number;
  IDENTITY_NUMBER: string;
  IS_VERIFIED: number;
  MOBILE_NUMBER: string;
  NAME: string;
  PASSWORD: string;
  PROFILE_PHOTO: string | null;
  READ_ONLY: string;
  REJECT_BLOCKED_REMARK: string | null;
  ROLE_ID: number;
  SCHOOL_ID: number;
  SCHOOL_NAME: string;
  SEQ_NO: number;
  STATE_ID: number | null;
  STATE_NAME: string | null;
  STATUS: number;
  STUDENT_STATUS: string;
  TEMP_CLASS_ID: number | null;
  TEMP_DIVISION_ID: number | null;
  TEMP_MEDIUM_ID: number | null;
  TEMP_ROLL_NO: number | null;
  YEAR_ID: number;
}

interface SUBJECT_TEACHER_MASTER {
  ARCHIVE_FLAG: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  ID: number;
  READ_ONLY: string;
  STATUS: number;
  SUBJECT_ID: number;
  SUBJECT_NAME: string | any;
  TEACHER_ID: number;
  TEACHER_NAME: string;
  YEAR_ID: number;
}
interface CLASS_TEACHER_MAPPING {
  ARCHIVE_FLAG: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  READ_ONLY: string;
  SCHOOL_ID: number;
  STATUS: number;
  TEACHER_ID: number;
}
interface QUESTIONS {
  QUESTION_TYPE: string;
  QUESTION_TYPE_NAME: string;
  IS_QUESTION_SELECTED: number[];
  MARK_OF_QUESTION: string;
  SELECTED_QUESTIONS: QUESTION_SERIES[];
}
interface CHAPTER_LIST {
  CHAPTER_ID: number;
  CHAPTER_NAME: string;
  QUESTION_TYPE: string;
  QUESTION_TYPE_NAME: string;
  QUESTION_TYPE_SEQ_NO: string;
}

interface QUESTIONS_SELECTED {
  SELECTED_QUESTIONS: QUESTION_PRINT[];
}
interface QUESTION_TYPE {
  CHAPTER_ID: number;
  CHAPTER_NAME: string;
  QUESTIONS: QUESTIONS[];
}
interface STUDENT_CLASS_MAPPING {
  ARCHIVE_FLAG: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  GENDER: string;
  ID: number;
  MEDIUM_ID: number;
  MEDIUM_NAME: string;
  MOBILE_NUMBER: string;
  PROFILE_PHOTO: string | null;
  READ_ONLY: string;
  ROLL_NUMBER: number;
  SCHOOL_ID: number;
  STATUS: number;
  STUDENT_ID: number;
  STUDENT_NAME: string;
  YEAR: string;
  YEAR_ID: number;
}
interface YEAR {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
  YEAR: number;
}

interface QuestionOption {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  IS_CORRECT: number;
  OPTION_IMAGE_URL: string;
  OPTION_TEXT: string;
  QUESTION_ID: number;
  READ_ONLY: string;
  SEQ_NO: number | null; // Assuming SEQ_NO can be null
  STATUS: number;
}
interface QUESTION_SERIES {
  ANSWER: string;
  ANSWER_IMAGE: string | null;
  ARCHIVE_FLAG: string;
  CHAPTER_ID: number;
  CHAPTER_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DESCRIPTION: string;
  ID: number;
  MARKS: number;
  QUESTION: string;
  QUESTION_IMAGE: string | null;
  QUESTION_TYPE: number;
  QUESTION_TYPE_NAME: string;
  QUESTION_TYPE_SEQ_NO: number;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
  QuestionOption: QuestionOption[];
}
interface QUESTION_PRINT {
  ANSWER: string;
  ANSWER_IMAGE: string | null;
  CHAPTER_ID: number;
  CHAPTER_NAME: string;
  CREATED_MODIFIED_DATE: string;
  DESCRIPTION: string;
  ID: number;
  MARKS: number;
  QUESTION: string;
  QUESTION_IMAGE: string | null;
  QUESTION_TYPE: number;
  QUESTION_TYPE_NAME: string;
  QUESTION_TYPE_SEQ_NO: number;
  SEQ_NO: number;
  STATUS: number;
  QuestionOption: QuestionOption[];
}
interface STUDENT_DATA_INTERFACE {
  ADDRESS: null | string;
  ARCHIVE_FLAG: string;
  CITY_ID: null | number;
  CLIENT_ID: number;
  COUNTRY_ID: null | number;
  COUNTRY_NAME: null | string;
  CREATED_MODIFIED_DATE: string;
  DISTRICT_ID: null | number;
  DISTRICT_MASTER: null | string;
  DOB: null | string;
  EMAIL_ID: null | string;
  GENDER: string;
  ID: number;
  IDENTITY_NUMBER: string;
  IS_VERIFIED: number;
  MOBILE_NUMBER: string;
  NAME: string;
  PASSWORD: string;
  PROFILE_PHOTO: null | string;
  READ_ONLY: string;
  ROLE_ID: number;
  SCHOOL_ID: null | number;
  SEQ_NO: number;
  STATE_ID: null | number;
  STATE_NAME: null | string;
  STATUS: number;
}
interface TEACHER_CLASS_TASK {
  APPLIED_TIME: string;
  ARCHIVE_FLAG: string;
  ATTACMENT: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DATE: string;
  DESCRIPTION: string;
  ID: number;
  READ_ONLY: string;
  STATUS: string;
  SUBJECT_ID: number | null;
  SUBJECT_NAME: string | null;
  SUBMISSION_DATE: string | null;
  TEACHER_ID: number;
  TYPE: string | null;
  YEAR: number | null;
  YEAR_ID: number | null;
}
interface SUBJECT_INTERFACE {
  ARCHIVE_FLAG: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  NAME: string;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
}
interface FEE_DETAILS_INTERFACE {
  ARCHIVE_FLAG: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  HEAD_ID: number;
  HEAD_NAME: string;
  ID: number;
  PAID_FEE: number;
  PENDING_FEE: number;
  READ_ONLY: string;
  SCHOOL_ID: number;
  STATUS: number;
  STUDENT_ID: number;
  STUDENT_NAME: string;
  TOTAL_FEE: number;
  YEAR: string;
  YEAR_ID: number;
}
interface STUDENT_DETAILS_INTERFACE {
  ARCHIVE_FLAG: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  GENDER: string;
  ID: number;
  MOBILE_NUMBER: string;
  READ_ONLY: string;
  ROLL_NUMBER: string | null;
  STATUS: number;
  STUDENT_ID: number;
  STUDENT_NAME: string;
  YEAR: string;
  YEAR_ID: number;
  PAID_FEE: number;
  PENDING_FEE: number;
  TOTAL_FEE: number;
}
interface COUNTRY_INTERFACE {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  NAME: string;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
}
interface STATE_INTERFACE {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  COUNTRY_ID: number;
  COUNTRY_NAME: string;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  NAME: string;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
}
interface DISTRICT_INTERFACE {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  NAME: string;
  READ_ONLY: string;
  SEQ_NO: number;
  STATE_ID: number;
  STATE_NAME: string;
  STATUS: number;
}
interface STUDENT_TASK_DATA_INTERFACE {
  ARCHIVE_FLAG: string;
  ASSIGNED_DATE: string;
  CLASS_ID: number | null;
  CLIENT_ID: number;
  COMPLETION_DATE_TIME: string | null;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  READ_ONLY: string;
  SELECTED: boolean;
  STUDENT_ID: number;
  STUDENT_NAME: string;
  SUBJECT_NAME: string | null;
  TASK: string;
  TASK_ID: number;
  ATTACMENT: string;
  SUBMISSION_DATE: string;
  TYPE: string;
  STATUS: string;
}
interface GET_STUDENT_LIST {
  ADDRESS: string;
  APP_USER_ID: number;
  ARCHIVE_FLAG: string;
  CITY_ID: number | null;
  CLASS_ID: number | null;
  CLIENT_ID: number;
  COUNTRY_ID: number | null;
  COUNTRY_NAME: string | null;
  CREATED_MODIFIED_DATE: string;
  DISTRICT_ID: number | null;
  DISTRICT_NAME: string | null;
  DOB: string;
  EMAIL_ID: string;
  GENDER: string;
  ID: number;
  IDENTITY_NUMBER: string | null;
  IS_VERIFIED: number;
  MOBILE_NUMBER: string;
  NAME: string;
  PASSWORD: string | null;
  PROFILE_PHOTO: string;
  READ_ONLY: string;
  REJECT_BLOCKED_REMARK: string | null;
  ROLE_ID: number;
  SCHOOL_ID: number | null;
  SEQ_NO: number | null;
  STATE_ID: number | null;
  STATE_NAME: string | null;
  STATUS: number;
  STUDENT_STATUS: string | null;
  TEMP_CLASS_ID: number;
  TEMP_DIVISION_ID: number;
  TEMP_MEDIUM_ID: number;
}
interface selectData {
  className: CLASS_TEACHER_MAPPING;

  item: SUBJECT_TEACHER_MASTER;
}

interface QUESTION_TYPE_WISE_LIST {
  ID: number;
  LABEL: string;
  OUT_OF_QUESTIONS: number;
  WANT_TO_ASK_QUESTIONS: number;
  questions: {
    ANSWER: string;
    ANSWER_IMAGE: string;
    ARCHIVE_FLAG: string;
    CHAPTER_ID: number;
    CHAPTER_NAME: string;
    CLASS_ID: number;
    CLIENT_ID: number;
    CREATED_MODIFIED_DATE: string;
    DESCRIPTION: string;
    ID: number;
    MARKS: number;
    QUESTION: string;
    QUESTION_IMAGE: string;
    QUESTION_TYPE: number;
    QUESTION_TYPE_NAME: string;
    QUESTION_TYPE_SEQ_NO: number;
    READ_ONLY: string;
    SEQ_NO: number;
    STATUS: number;
  }[];
}
interface ATTENDANCE_LIST {
  ARCHIVE_FLAG: string;
  ROLE_ID: number;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DATE: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  ID: number;
  IS_CLASS_ATTENDENCE: number;
  READ_ONLY: string;
  STUDENT_ID: number;
  STUDENT_NAME: string;
}
interface SUBJECT_WISE_ATTENDANCE {
  ABSENT: number;
  PRESENT: number;
  SUBJECT_NAME: string;
  TOTAL: number;
  SUBJECT_ID: number;
}
interface GET_BOARD_CLASS {
  ARCHIVE_FLAG: string;
  BOARD_ID: number;
  BOARD_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  NAME: string;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
}
interface BOARD_SUBJECT_INTERFACE {
  ARCHIVE_FLAG: string;
  BOARD_ID: number | null;
  BOARD_NAME: string | null;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  NAME: string;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
}
interface SELECTED_QUESTIONS_ARRAY {
  ANSWER: string;
  ANSWER_IMAGE: string | null;
  ARCHIVE_FLAG: string;
  CHAPTER_ID: number;
  CHAPTER_NAME: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DESCRIPTION: string | null;
  DIRECTION: string | null;
  ID: number;
  MARKS: number;
  QUESTION: string;
  QUESTION_IMAGE: string | null;
  QUESTION_TYPE: number;
  QUESTION_TYPE_NAME: string;
  QUESTION_TYPE_SEQ_NO: number;
  READ_ONLY: string;
  SCHOOL_ID: number;
  SEQ_NO: number;
  STATUS: number;
  SUBJECT_ID: number;
  SUBJECT_NAME: string;
}
interface GET_ALL_SUBJECTS {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  IS_FEE_MAPPED: number;
  MEDIUM_ID: number | null;
  NAME: string;
  QUESTION_CLASS_ID: number | null;
  READ_ONLY: string;
  SCHOOL_ID: number;
  SCHOOL_NAME: string;
  SEQ_NO: number;
  STATUS: number;
  TOTAL_FEES: number;
  YEAR_ID: number;
}
interface TASK_DATA {
  ALERT_MSG: string;
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DEPARTMENT_ID: number;
  DESCRIPTION: string;
  ID: number;
  IMAGE_URL: string | null;
  IS_LAST: number;
  IS_LAST_STATUS: string;
  ORG_ID: number;
  PARENT_ID: number;
  PARENT_VALUE: string;
  PRIORITY: string;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
  TASK_ASSIGN_DAYS: number | null;
  TASK_ASSIGN_TYPE: string;
  TICKET_GROUP_STATUS: string;
  TYPE: string;
  URL: string;
  VALUE: string;
  SELECTED_TASK: number;
}
interface REWARD_SCREEN_INTERFACE {
  ANIMATION_DETAILS_ID: number;
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  READ_ONLY: string;
  REWARD_ID: number;
  REWARD_IMG_URL: string;
  REWARD_NAME: string;
  SEQ_NO: number;
  STATUS: any;
  SUBSCRIPTION_DETAILS_ID: number;
  USER_ANIMATION_DETAIL_ID: number;
}

export type {
  ATTENDANCE_LIST,
  TASK_DATA,
  SUBJECT_WISE_ATTENDANCE,
  MEMBER_INTERFACE,
  CLASS_TEACHER_MAPPING,
  STUDENT_DATA_INTERFACE,
  TEACHER_CLASS_TASK,
  SUBJECT_INTERFACE,
  BOARD_SUBJECT_INTERFACE,
  FEE_DETAILS_INTERFACE,
  GET_BOARD_CLASS,
  STUDENT_DETAILS_INTERFACE,
  SELECTED_QUESTIONS_ARRAY,
  COUNTRY_INTERFACE,
  STATE_INTERFACE,
  DISTRICT_INTERFACE,
  STUDENT_TASK_DATA_INTERFACE,
  STUDENT_CLASS_MAPPING,
  QUESTION_TYPE,
  YEAR,
  QUESTION_SERIES,
  QUESTIONS_SELECTED,
  QUESTIONS,
  QuestionOption,
  CHAPTER_LIST,
  SUBJECT_TEACHER_MASTER,
  GET_STUDENT_LIST,
  QUESTION_TYPE_WISE_LIST,
  selectData,
  APP_USER_INTERFACE,
  SCHOOL_INFO,
  GET_ALL_SUBJECTS,
  AttendanceRecord,
  REWARD_SCREEN_INTERFACE,
  BMI_QUESTIONS,
  PermissionState,
};
