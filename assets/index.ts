const noProfile = require("../assets/images/noProfile.png");
const emptyImg = require("./images/emptyImg.jpg");
const FemaleUser = require("./images/femaleUser.png");
const MaleUser = require("./images/maleUser.png");
const noData = require("./images/noData.png");
const noTasks = require("./images/noTasks.png");
const TimeLogo = require("./images/TimeLogo.png");
const erpImage = require("./images/erp.png");
const comingSoon = require("./images/comingSoon.png");
const tasksGif = require("./gif/tasks.gif");
const community = require("./gif/community.gif");
const erp = require("./images/erp.png");
const offerImage = require("./images/offer.png");
const scratchpattern = require("./images/scratchpattern.jpg");
const communityPng = require("./images/communityPng.png");
const taskspng = require("../assets/images/taskspng.png");
const classTeacher = require("./images/classTeacher.png");
const SubjectSelection = require("./images/subject.png");
const dashboardBackground = require("./images/dashboardBackground.png");
const trackbookPng = require("./images/subjectTeacher.png");
const checklist = require("./images/checklist.png");
const NoDataWorkout = require("./images/NoDataWorkout.png");
const trackk_logo = require("./images/trackk_logo.png");
const logo = require("./images/logo.png");
const rocket = require("./images/rocket.png");
const fancyRadius = require("./images/fancyRadius.png");
const trackInfo = require("./images/TrackInfo.jpg");
const questionPaperInfo = require("./images/questionPaperGenerator.png");

const daily_planner = require("./dashboard/daily_planner.png");
const erp_new = require("./dashboard/erp_new.png");
const task_book_new = require("./dashboard/task_book_new.png");
const weekly_planner_new = require("./dashboard/weekly_planner_new.png");
const health_new = require("./dashboard/health_new.png");
const  daily_planner_icon    = require("./dashboard/daily_planner_icon.png");
const digital_detox_icon   = require("./dashboard/digital_detox_icon.png");
const weekly_planner_icon  = require("./dashboard/weekly_planner_icon.png");
const school  = require("./dashboard/school.png");
const tasks  = require("./dashboard/tasks.png");
const fit  = require("./dashboard/fit.png");
const task_daily  = require("./dashboard/task_daily.png");
const digital  = require("./dashboard/digital.png");
const challenge1  = require("./background/challenge1.jpg");
const task3  = require("./background/task3.png");


export const searching = require("./gif/searching.gif");

const custom = (index: number) => {
  // console.log(index);
  if (index == undefined || index == null) {
    return require("./images/custom.jpg");
  } else if (index % 4 === 0) {
    return require("./background/Img1.jpg");
  } else if (index % 4 === 1) {
    return require("./background/Img2.jpg");
  } else if (index % 4 === 2) {
    return require("./background/Img3.jpg");
  } else {
    return require("./background/Img4.jpg");
  }
};
const FacebookLogo = require("./images/FacebookLogo.png");
const youTubeLogo = require("./images/youTubeLogo.png");
const InstagramLogo = require("./images/InstagramLogo.png");
const taskType_Task = require("./images/taskType_Task.webp");
const subscription = require("./images/subscription.jpg");
const taskType_Challenge = require("./images/taskType_Challenge.jpg");
const timePeriod = require("./PeriodTrackingImages/timePeriod.jpg");
const girlImage = require("./PeriodTrackingImages/girlImage.jpg");
const iDontKnow = require("./PeriodTrackingImages/iDontKnow.webp");
const regular = require("./PeriodTrackingImages/regular.jpg");
const irregular = require("./PeriodTrackingImages/irregular.jpg");
const leaf = require("./PeriodTrackingImages/leaf.jpg");
const reminderDateTime = require("./PeriodTrackingImages/reminderDateTime.png");
const ovulationIcon = require("./PeriodTrackingImages/ovulationIcon.png");
const fertilityIcon = require("./PeriodTrackingImages/fertilityIcon.png");
const breastCancerPrevention = require("./PeriodTrackingImages/breastCancerPrevention.png");
const NeverMenstruated = require("./PeriodTrackingImages/NeverMenstruated.png");
const ovulationDuringPregnancy = require("./PeriodTrackingImages/ovulationDuringPregnancy.png");
const shortMenstrualDelay = require("./PeriodTrackingImages/shortMenstrualDelay.png");
const significantMenstrualDelay = require("./PeriodTrackingImages/significantMenstrualDelay.png");
const symptomsOfOvulation = require("./PeriodTrackingImages/symptomsOfOvulation.png");
const flower = require("./PeriodTrackingImages/flower.png");
const PeriodTracker = require("./PeriodTrackingImages/PeriodTracker.png");

import Approved from "./svg/Approved.svg";
import Subject from "./svg/Subject.svg";
import Time from "./svg/Time.svg";
import Red from "./svg/Red.svg";
import Green from "./svg/Green.svg";
import Download from "./svg/Download.svg";
import PrintSvg from "./svg/print.svg";
import QuestionPapar from "./svg/QuestionPapar.svg";
import Edit from "./svg/Edit.svg";
import PrivacyPolicy from "./svg/PrivacyPolicy.svg";
import TermsAndCondition from "./svg/TermsAndCondition.svg";

import NotificationIcon from "./svg/NotificationsIcon.svg";
import UserIcon from "./svg/UserIcon.svg";
import DD from "./newUI/DD.svg";
import DO from "./newUI/DO.svg";
import ERPA from "./newUI/ERPA.svg";
import HandF from "./newUI/HandF.svg";
import TB from "./newUI/TB.svg";
import WP from "./newUI/WP.svg";
const AnimationBanner = require("./newUI/AnimationBanner.png");
const BMIBanner = require("./newUI/BMIBanner.png");
const DailyOrganizerBanner = require("./newUI/DailyOrganiserBanner.png");
const DigitalDetoxBanner = require("./newUI/DigitalDetoxBanner.png");
const ERPBanner = require("./newUI/ERPBanner.png");
const HealthAndFitnessBanner = require("./newUI/HealthAndFitnessBanner.png");
const PeriodTrackerBanner = require("./newUI/PeriodTrackker.png");
const WeeklyPlannerBanner = require("./newUI/WeeklyPlannerBanner.png");

export {
  AnimationBanner,
  BMIBanner,
  DailyOrganizerBanner,
  DigitalDetoxBanner,
  ERPBanner,
  HealthAndFitnessBanner,
  PeriodTrackerBanner,
  NotificationIcon,
  UserIcon,
  DD,
  DO,
  ERPA,
  HandF,
  TB,
  WP,
  WeeklyPlannerBanner,
  trackInfo,
  communityPng,
  taskspng,
  trackbookPng,
  community,
  tasksGif,
  SubjectSelection,
  erp,
  noProfile,
  Time,
  PrintSvg,
  Subject,
  offerImage,
  scratchpattern,
  emptyImg,
  FemaleUser,
  MaleUser,
  comingSoon,
  Approved,
  QuestionPapar,
  questionPaperInfo,
  noData,
  noTasks,
  erpImage,
  Download,
  Edit,
  TimeLogo,
  PrivacyPolicy,
  TermsAndCondition,
  Green,
  Red,
  checklist,
  custom,
  trackk_logo,
  logo,
  rocket,
  fancyRadius,
  FacebookLogo,
  youTubeLogo,
  InstagramLogo,
  taskType_Task,
  taskType_Challenge,
  dashboardBackground,
  timePeriod,
  girlImage,
  iDontKnow,
  regular,
  irregular,
  leaf,
  reminderDateTime,
  ovulationIcon,
  fertilityIcon,
  breastCancerPrevention,
  NeverMenstruated,
  ovulationDuringPregnancy,
  shortMenstrualDelay,
  significantMenstrualDelay,
  symptomsOfOvulation,
  flower,
  PeriodTracker,
  NoDataWorkout,
  subscription,
 daily_planner,
erp_new,
task_book_new,

weekly_planner_new,
health_new,
daily_planner_icon  ,
digital_detox_icon ,
weekly_planner_icon,
school,
tasks ,
fit,
task_daily,
digital,
challenge1,
task3};
