interface MEMBER_INTERFACE {
  ADDRESS: string | null;
  APPROVAL_STATUS: string | null;
  ARCHIVE_FLAG: string;
  BOARD_ID: number | string | null;
  CITY_ID: number;
  CITY_NAME: string | null;
  CLASS_ID: string | null;
  CLASS_NAME: string | null;
  CLIENT_ID: number;
  CLOUD_ID: string;
  COUNTRY_ID: string | null;
  COUNTRY_NAME: string | null;
  CREATED_MODIFIED_DATE: string;
  C_TEACHER_ATTENDANCE_ENABLED: number | null;
  DISTRICT_ID: string | null;
  DISTRICT_NAME: string | null;
  DIVISION_ID: string | null;
  DIVISION_NAME: string | null;
  DOB: string;
  EMAIL_ID: string;
  GENDER: string;
  ID: number;
  IDENTITY_NUMBER: string | null;
  IS_ERP_MAPPED: number | null;
  IS_REGISTERED: number;
  IS_VERIFIED: number;
  MOBILE_NUMBER: string;
  NAME: string;
  PASSWORD: string | null;
  PINCODE: string | null;
  PROFILE_PHOTO: string | null;
  READ_ONLY: string;
  REJECT_BLOCKED_REMARK: string | null;
  ROLE: string;
  SCHOOL_ID: string | null;
  SCHOOL_NAME: string | null;
  STATE_ID: string | null;
  STATE_NAME: string | null;
  STATUS: number;
  SUBSCRIPTION_EXPIRE_DATE: string | null;
  S_TEACHER_ATTENDANCE_ENABLED: number | null;
  TEMP_CLASS_ID: string | null;
  TEMP_DIVISION_ID: string | null;
  TEMP_MEDIUM_ID: string | null;
  TEMP_ROLL_NO: string | null;
  TEMP_SUBJECT_ID: string | null;
  YEAR: string | null;
  YEAR_ID: string | null;
  INSTITUTE_LOGO: string | null;
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
  EMAIL_ID: string | null | any;
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
  LECTURE_TIME: string;
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
  QUESTION_COUNT: number;
}
interface STUDENT_CLASS_MAPPING {
  ARCHIVE_FLAG: string;
  CLASS_ID: number;
  CLASS_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  DOB: string;
  EMAIL_ID: string;
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
  SR_NO: number;
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
  SHOW_ANSWER: any;
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
  STATUS: string;
  ABSENT: number;
  PRESENT: number;
  SUBJECT_NAME: string;
  TOTAL: number;
  SUBJECT_ID: number;
}
interface STUDENT_LIST_INTERFACE {
  ADDRESS: string | null;
  APP_USER_ID: number;
  ARCHIVE_FLAG: string;
  CITY_ID: number | null;
  CITY_NAME: string | null;
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
  PROFILE_PHOTO: string | null;
  READ_ONLY: string;
  REJECT_BLOCKED_REMARK: string | null;
  ROLE_ID: number;
  SCHOOL_ID: number;
  SCHOOL_NAME: string;
  SEQ_NO: number | null;
  SR_NO: number;
  STATE_ID: number | null;
  STATE_NAME: string | null;
  STATUS: number;
  STUDENT_STATUS: string;
  TEMP_CLASS_ID: number;
  TEMP_CLASS_NAME: string;
  TEMP_DIVISION_ID: number;
  TEMP_DIVISION_NAME: string;
  TEMP_MEDIUM_ID: number;
  TEMP_MEDIUM_NAME: string;
  TEMP_ROLL_NO: string;
  YEAR: string;
  YEAR_ID: number;

  CLASS_NAME: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  MEDIUM_ID: number;
  MEDIUM_NAME: string;
  ROLL_NUMBER: number;
  STUDENT_ID: number;
  STUDENT_NAME: string;
}
interface WEEKLY_PLANNER_INTERFACE {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_DATETIME: string;
  CREATED_MODIFIED_DATE: string;
  DESCRIPTION: any;
  ID: number | any;
  IS_COMPLETED: number | any;
  IS_REMIND: number | any;
  MEMBER_ID: number | any;
  READ_ONLY: string;
  REMIND_DATETIME: string;
  REMIND_TYPE: string;
  STATUS: number | any;
  TITLE: string;
  GROUP_NO: number | any;
  TYPE: string;
  COLOR_TAG: string;
  IS_SUB_TASK: number;
}
interface HEATH_FATTENS_CATEGORY {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  HEAD_IMAGE: string;
  HEAD_NAME: string;
  ID: number;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
}
interface CUSTOM_HEAD_CATEGORY {
  ARCHIVE_FLAG: string;
  CATEGORY_IMAGE: string;
  CATEGORY_NAME: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
}

interface HEATH_FATTENS_ACTIVITY {
  ACTIVITY_GIF: string;
  ACTIVITY_NAME: string;
  ACTIVITY_SET: string;
  ACTIVITY_TIMING: string;
  ACTIVITY_VALUE: string;
  DESCRIPTION: string;
  ACTIVITY_ID: number;
  ACTIVITY_TYPE: 'S' | 'T' | 'D' | 'W';
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  index: number;
  CREATED_MODIFIED_DATE: string;
  HEAD_ID: number;
  HEAD_NAME: string;
  ID: number;
  READ_ONLY: string;
}
interface DIMENSION_INTERFACE {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  NAME: string;
  READ_ONLY: string;
  DESCRIPTION: string;
  SEQ_NO: number;
  STATUS: number;
  IMAGE_URL: any;
}
interface TRACK_BOOK_QUESTION_INTERFACE {
  AGE_GROUP: number;
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DESCRIPTION: string;
  DIAMENTION_ID: number;
  ID: number;
  IS_CHILD_AVAILABLE: number;
  IS_COMMON: number;
  LABEL: string;
  QUESTION_HEAD_ID: number;
  QUESTION_TYPE: number;
  READ_ONLY: string;
  SEQ_NO: number | null;
  STATUS: number;
  QUESTION_ID: number;
  RANGES: any;
  RATE: any;
}
interface TRACK_BOOK_QUESTION_OPTION_INTERFACE {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  ID: number;
  LABEL: string;
  QUESTION_ID: number;
  RANGES: any;
  READ_ONLY: string;
  STATUS: number;
  QUESTION_TYPE: number;
}
interface TRACK_BOOK_TASK_DATA {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DATE_DIFFERENCE: number;
  DIAMENTION_ID: number;
  DISABLE_TIME: any;
  ENABLE_TIME: any;
  ID: number;
  OPTION_ID: number;
  QUESTION_HEAD_ID: number;
  QUESTION_ID: number;
  READ_ONLY: string;
  TASK_ID: number;
  TASK_IMAGE_URL: string;
  TASK_LABEL: string;
  TASK_DESCRIPTIONS: string;
  STATUS: any;
  TASK_PRIORITY: string;
}
interface PLAN_INTERFACE {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DAYS: number;
  DESCRIPTION: string | null;
  DISCOUNT: number;
  ID: number;
  IS_ERP_AVAILBALE: number;
  IS_QUESTION_PAPER_AVAILABLE: number;
  IS_TRACKBOOK_AVAILABLE: number;
  LABEL: string;
  PRICE: number;
  READ_ONLY: string;
  STATUS: number;
  TYPE: string;
}
interface DAILY_TRACK_BOOK_TASK {
  ARCHIVE_FLAG: string;
  ASSIGNED_DATE: string;
  CLIENT_ID: number;
  COMPLETED_DATE: string;
  CREATED_MODIFIED_DATE: string;
  DATE_DIFFERENCE: number;
  DESCRIPTIONS: string;
  DIAMENTION_ID: number;
  DISABLE_TIMING: any;
  ENABLE_TIME: any;
  FITNESS_ACTIVITY_ID: number;
  ID: number;
  IMAGE_URL: string | null;
  IS_SUNDAY_OFF: boolean | null;
  LABEL: string;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: any;
  SUBSCRIPTION_DETAILS_ID: number;
  SUBSCRIPTION_END_DATE: string | null;
  SUBSCRIPTION_START_DATE: string | null;
  TASK_ID: number;
  USER_ID: number;
  USER_SUBSCRIPTION_ID: number | null;
}
interface TRACK_BOOK_TASK_DATA {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DATE_DIFFERENCE: number;
  DIAMENTION_ID: number;
  DISABLE_TIME: any;
  ENABLE_TIME: any;
  ID: number;
  OPTION_ID: number;
  QUESTION_HEAD_ID: number;
  QUESTION_ID: number;
  READ_ONLY: string;
  TASK_ID: number;
  TASK_IMAGE_URL: string;
  TASK_LABEL: string;
  TASK_DESCRIPTIONS: string;
  STATUS: any;
}
interface HEALTH_FITNESS_ACTIVITY {
  ACTIVITY_GIF: string;
  ACTIVITY_THUMBNAIL_GIF: string;
  SUB_CATEGORY_NAME: string;
  ACTIVITY_ID: number;
  indexs: 0 | number;
  ACTIVITY_NAME: string;
  ACTIVITY_SETS: null | number;
  ACTIVITY_STATUS: string;
  ACTIVITY_TIMING: string;
  ACTIVITY_VALUE: any;
  ACTIVITY_TYPE: string;
  ARCHIVE_FLAG: string;
  CATEGORY: null | string;
  CLIENT_ID: number;
  COMPLETED_DATETIME: string;
  CREATED_MODIFIED_DATE: string;
  DESCRIPTION: null | string;
  ID: number;
  MASTER_ID: number;
  READ_ONLY: string;
  SEQ_NO: number;
}
interface SUBSCRIPTION_DETAILS {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DAYS: number;
  EXPIRE_DATE: string;
  ID: number;
  PAID_AMOUNT: number;
  PURCHASE_DATE: string;
  READ_ONLY: string;
  STATUS: number;
  SUBSCRIPTION_ID: number;
  USER_ID: number;
}
interface NOTIFICATION_DATA_INTERFACE {
  ARCHIVE_FLAG: string;
  ATTACHMENT: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DESCRIPTION: string;
  ID: number;
  IS_PANEL: number;
  OWNER_TYPE: string;
  READ_ONLY: string;
  SHARING_TYPE: string;
  TITLE: string;
  USER_ID: number;
}
interface PERIOD_TRACKING_RECORD {
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  CYCLE_LENGTH: any;
  DAY_REMINDER_DATE: string;
  DAY_REMINDER_END_DATE: string;
  FERTILE_END_DATE: string;
  FERTILE_START_DATE: string;
  ID: number;
  IS_DONE: number;
  IS_REGULAR_STATUS: string;
  IS_REMIND: number;
  LAST_PERIOD_DATE: string;
  MONTH: string;
  OVULATION_END_DATE: string;
  OVULATION_START_DATE: string;
  PERIOD_DAYS_LENGTH: any;
  PERIOD_END_DATE: string;
  PERIOD_START_DATE: string;
  READ_ONLY: string;
  REMIND_DATE_TIME: string;
  SAFE_END_DATE: string;
  SAFE_START_DATE: string;
  USER_ID: number;
  YEAR: string;
  IS_QUESTIONARY_COMPLETE: number;
  REMIND_DATE_COUNT: number;
}
interface BMI_DATA_INTERFACE {
  ARCHIVE_FLAG: string;
  BMI: number;
  CLIENT_ID: number;
  CREATED_DATETIME: string;
  CREATED_MODIFIED_DATE: string;
  HEIGHT: number;
  HEIGHT_UNIT: string;
  ID: number;
  MOBILE_NUMBER: string;
  READ_ONLY: string;
  USER_ID: number;
  USER_NAME: string;
  WEIGHT: number;
  WEIGHT_UNIT: string;
}

export type {
  ATTENDANCE_LIST,
  SUBJECT_WISE_ATTENDANCE,
  MEMBER_INTERFACE,
  CLASS_TEACHER_MAPPING,
  STUDENT_DATA_INTERFACE,
  TRACK_BOOK_QUESTION_INTERFACE,
  DIMENSION_INTERFACE,
  TEACHER_CLASS_TASK,
  SUBJECT_INTERFACE,
  FEE_DETAILS_INTERFACE,
  STUDENT_DETAILS_INTERFACE,
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
  STUDENT_LIST_INTERFACE,
  WEEKLY_PLANNER_INTERFACE,
  HEATH_FATTENS_CATEGORY,
  TRACK_BOOK_QUESTION_OPTION_INTERFACE,
  TRACK_BOOK_TASK_DATA,
  HEATH_FATTENS_ACTIVITY,
  PLAN_INTERFACE,
  DAILY_TRACK_BOOK_TASK,
  HEALTH_FITNESS_ACTIVITY,
  SUBSCRIPTION_DETAILS,
  CUSTOM_HEAD_CATEGORY,
  NOTIFICATION_DATA_INTERFACE,
  PERIOD_TRACKING_RECORD,
  BMI_DATA_INTERFACE,
};
