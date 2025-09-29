import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Linking, Dimensions} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiPost, useSelector} from '../Modules';
import moment from 'moment';

const checkInternet: () => Promise<boolean> = async () => {
  try {
    const {isConnected, isInternetReachable} = await NetInfo.fetch();
    if (isConnected && isInternetReachable) return true;
    else return false;
  } catch (error) {
    return false;
  }
};
const openWhatsapp: (num: string) => void = async phoneNumber => {
  const url = `whatsapp://send?phone=${phoneNumber}`;
  Linking.openURL(url);
};
const openPhone: (num: string) => void = async phoneNumber => {
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url);
};

const openMessage: (num: string) => void = async phoneNumber => {
  const url = `sms:${phoneNumber}`;
  Linking.openURL(url);
};

const getCountryCode: () => {value: string; label: string}[] = () => {
  const countryCodes = [
    {label: '+1', value: '1'},
    {label: '+1-242', value: '1242'},
    {label: '+1-246', value: '1246'},
    {label: '+1-264', value: '1264'},
    {label: '+1-268', value: '1268'},
    {label: '+1-284', value: '1284'},
    {label: '+1-340', value: '1340'},
    {label: '+1-345', value: '1345'},
    {label: '+1-441', value: '1441'},
    {label: '+1-473', value: '1473'},
    {label: '+1-649', value: '1649'},
    {label: '+1-664', value: '1664'},
    {label: '+1-670', value: '1670'},
    {label: '+1-671', value: '1671'},
    {label: '+1-684', value: '1684'},
    {label: '+1-721', value: '1721'},
    {label: '+1-758', value: '1758'},
    {label: '+1-767', value: '1767'},
    {label: '+1-784', value: '1784'},
    {label: '+1-787', value: '1787'},
    {label: '+1-809', value: '1809'},
    {label: '+1-829', value: '1829'},
    {label: '+1-849', value: '1849'},
    {label: '+1-868', value: '1868'},
    {label: '+1-869', value: '1869'},
    {label: '+1-876', value: '1876'},
    {label: '+1-939', value: '1939'},
    {label: '+20', value: '20'},
    {label: '+211', value: '211'},
    {label: '+212', value: '212'},
    {label: '+212', value: '212'},
    {label: '+213', value: '213'},
    {label: '+216', value: '216'},
    {label: '+218', value: '218'},
    {label: '+220', value: '220'},
    {label: '+221', value: '221'},
    {label: '+222', value: '222'},
    {label: '+223', value: '223'},
    {label: '+224', value: '224'},
    {label: '+225', value: '225'},
    {label: '+226', value: '226'},
    {label: '+227', value: '227'},
    {label: '+228', value: '228'},
    {label: '+229', value: '229'},
    {label: '+230', value: '230'},
    {label: '+231', value: '231'},
    {label: '+232', value: '232'},
    {label: '+233', value: '233'},
    {label: '+234', value: '234'},
    {label: '+235', value: '235'},
    {label: '+236', value: '236'},
    {label: '+237', value: '237'},
    {label: '+238', value: '238'},
    {label: '+239', value: '239'},
    {label: '+240', value: '240'},
    {label: '+241', value: '241'},
    {label: '+242', value: '242'},
    {label: '+243', value: '243'},
    {label: '+244', value: '244'},
    {label: '+245', value: '245'},
    {label: '+246', value: '246'},
    {label: '+248', value: '248'},
    {label: '+249', value: '249'},
    {label: '+250', value: '250'},
    {label: '+251', value: '251'},
    {label: '+252', value: '252'},
    {label: '+253', value: '253'},
    {label: '+254', value: '254'},
    {label: '+255', value: '255'},
    {label: '+256', value: '256'},
    {label: '+257', value: '257'},
    {label: '+258', value: '258'},
    {label: '+260', value: '260'},
    {label: '+261', value: '261'},
    {label: '+262', value: '262'},
    {label: '+262', value: '262'},
    {label: '+263', value: '263'},
    {label: '+264', value: '264'},
    {label: '+265', value: '265'},
    {label: '+266', value: '266'},
    {label: '+267', value: '267'},
    {label: '+268', value: '268'},
    {label: '+269', value: '269'},
    {label: '+27', value: '27'},
    {label: '+290', value: '290'},
    {label: '+291', value: '291'},
    {label: '+297', value: '297'},
    {label: '+298', value: '298'},
    {label: '+299', value: '299'},
    {label: '+30', value: '30'},
    {label: '+31', value: '31'},
    {label: '+32', value: '32'},
    {label: '+33', value: '33'},
    {label: '+34', value: '34'},
    {label: '+350', value: '350'},
    {label: '+351', value: '351'},
    {label: '+352', value: '352'},
    {label: '+353', value: '353'},
    {label: '+354', value: '354'},
    {label: '+355', value: '355'},
    {label: '+356', value: '356'},
    {label: '+357', value: '357'},
    {label: '+358', value: '358'},
    {label: '+359', value: '359'},
    {label: '+36', value: '36'},
    {label: '+370', value: '370'},
    {label: '+371', value: '371'},
    {label: '+372', value: '372'},
    {label: '+373', value: '373'},
    {label: '+374', value: '374'},
    {label: '+375', value: '375'},
    {label: '+376', value: '376'},
    {label: '+377', value: '377'},
    {label: '+378', value: '378'},
    {label: '+379', value: '379'},
    {label: '+380', value: '380'},
    {label: '+381', value: '381'},
    {label: '+382', value: '382'},
    {label: '+383', value: '383'},
    {label: '+385', value: '385'},
    {label: '+386', value: '386'},
    {label: '+387', value: '387'},
    {label: '+389', value: '389'},
    {label: '+39', value: '39'},
    {label: '+40', value: '40'},
    {label: '+41', value: '41'},
    {label: '+420', value: '420'},
    {label: '+421', value: '421'},
    {label: '+423', value: '423'},
    {label: '+43', value: '43'},
    {label: '+44', value: '44'},
    {label: '+44-1481', value: '441481'},
    {label: '+44-1534', value: '441534'},
    {label: '+44-1624', value: '441624'},
    {label: '+45', value: '45'},
    {label: '+46', value: '46'},
    {label: '+47', value: '47'},
    {label: '+47', value: '47'},
    {label: '+48', value: '48'},
    {label: '+49', value: '49'},
    {label: '+500', value: '500'},
    {label: '+501', value: '501'},
    {label: '+502', value: '502'},
    {label: '+503', value: '503'},
    {label: '+504', value: '504'},
    {label: '+505', value: '505'},
    {label: '+506', value: '506'},
    {label: '+507', value: '507'},
    {label: '+508', value: '508'},
    {label: '+509', value: '509'},
    {label: '+51', value: '51'},
    {label: '+52', value: '52'},
    {label: '+53', value: '53'},
    {label: '+54', value: '54'},
    {label: '+55', value: '55'},
    {label: '+56', value: '56'},
    {label: '+57', value: '57'},
    {label: '+58', value: '58'},
    {label: '+590', value: '590'},
    {label: '+590', value: '590'},
    {label: '+591', value: '591'},
    {label: '+592', value: '592'},
    {label: '+593', value: '593'},
    {label: '+595', value: '595'},
    {label: '+597', value: '597'},
    {label: '+598', value: '598'},
    {label: '+599', value: '599'},
    {label: '+599', value: '599'},
    {label: '+60', value: '60'},
    {label: '+61', value: '61'},
    {label: '+61', value: '61'},
    {label: '+61', value: '61'},
    {label: '+62', value: '62'},
    {label: '+63', value: '63'},
    {label: '+64', value: '64'},
    {label: '+64', value: '64'},
    {label: '+65', value: '65'},
    {label: '+66', value: '66'},
    {label: '+670', value: '670'},
    {label: '+672', value: '672'},
    {label: '+673', value: '673'},
    {label: '+674', value: '674'},
    {label: '+675', value: '675'},
    {label: '+676', value: '676'},
    {label: '+677', value: '677'},
    {label: '+678', value: '678'},
    {label: '+679', value: '679'},
    {label: '+680', value: '680'},
    {label: '+681', value: '681'},
    {label: '+682', value: '682'},
    {label: '+683', value: '683'},
    {label: '+685', value: '685'},
    {label: '+686', value: '686'},
    {label: '+687', value: '687'},
    {label: '+688', value: '688'},
    {label: '+689', value: '689'},
    {label: '+690', value: '690'},
    {label: '+691', value: '691'},
    {label: '+692', value: '692'},
    {label: '+7', value: '7'},
    {label: '+7', value: '7'},
    {label: '+81', value: '81'},
    {label: '+82', value: '82'},
    {label: '+84', value: '84'},
    {label: '+850', value: '850'},
    {label: '+852', value: '852'},
    {label: '+853', value: '853'},
    {label: '+855', value: '855'},
    {label: '+856', value: '856'},
    {label: '+86', value: '86'},
    {label: '+880', value: '880'},
    {label: '+886', value: '886'},
    {label: '+90', value: '90'},
    {label: '+91', value: '91'},
    {label: '+92', value: '92'},
    {label: '+93', value: '93'},
    {label: '+94', value: '94'},
    {label: '+95', value: '95'},
    {label: '+960', value: '960'},
    {label: '+961', value: '961'},
    {label: '+962', value: '962'},
    {label: '+963', value: '963'},
    {label: '+964', value: '964'},
    {label: '+965', value: '965'},
    {label: '+966', value: '966'},
    {label: '+967', value: '967'},
    {label: '+968', value: '968'},
    {label: '+970', value: '970'},
    {label: '+971', value: '971'},
    {label: '+972', value: '972'},
    {label: '+973', value: '973'},
    {label: '+974', value: '974'},
    {label: '+975', value: '975'},
    {label: '+976', value: '976'},
    {label: '+977', value: '977'},
    {label: '+98', value: '98'},
    {label: '+992', value: '992'},
    {label: '+993', value: '993'},
    {label: '+994', value: '994'},
    {label: '+995', value: '995'},
    {label: '+996', value: '996'},
    {label: '+998', value: '998'},
  ];
  return countryCodes;
};


export const emailValidation =
  /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
export const mobileValidation = /^[6-9]\d{9}$/;
export const nameValidation = /^[a-zA-Z]+$/;
const {width, height} = Dimensions.get('window');

var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth() + 1;
export var displayYear: number;
if (currentMonth < 6) {
  displayYear = currentYear - 1;
} else {
  displayYear = currentYear;
}
const classFilter: () => Promise<string> = async () => {
  const classId = await AsyncStorage.getItem('CLASS_ID');
  const id: any = [];
  if (classId) {
    var items = classId.split(',');
    items.forEach(function (item: any) {
      id.push(` CLASS_ID = ${item} `);
    });
  }
  return id.join(' OR ');
};
const getSubscriptionDetails = async (userId) => {
  try {
        const today = moment().format("YYYY-MM-DD");

    const res = await apiPost("api/userSubscription/get", {
      filter: `AND STATUS=1 AND USER_ID=${userId} AND EXPIRE_DATE >= '${today}'`,
    });

    if (res && res.code === 200 && res.data && res.data.length > 0) {
      console.log("getSubscriptionDetails", res.data);
      return res.data;
    }

    return false; // No active subscription data
  } catch (error) {
    console.error("getSubscriptionDetails error", error);
    return null;
  }
};

// const isSubscriptionActive = async () => {
//   const { member } = useSelector((state) => state.member);

//   if (!member || !member.ID) return false;

//   const subscriptionData = await getSubscriptionDetails(member.ID);
//   console.log("isSubscriptionActive", subscriptionData);
//   if (!subscriptionData) {
//     return false; // No active subscription found
//   }

//   const expireDate = moment(subscriptionData[0]?.EXPIRE_DATE); // Use first subscription (or logic as needed)
//   const currentDate = moment();
//   console.log("expireDate", expireDate.isSameOrAfter(currentDate, 'day'));
//   return expireDate.isSameOrAfter(currentDate, 'day');
// };


const isSubscriptionActive = () => {
  const {member} = useSelector(state => state.member);
    // console.log('member', member);

  if (member?.SUBSCRIPTION_EXPIRE_DATE == null) {
    return false;
  }
  const expireDate = moment(member?.SUBSCRIPTION_EXPIRE_DATE);
  const currentDate = moment();
  return expireDate.isSameOrAfter(currentDate, 'day');
};
//  const getSubscriptionDetails = async () => {
   

//     try {
//       const res = await apiPost("api/userSubscription/get", {
//         filter: `AND STATUS=1 AND USER_ID=${member?.ID} AND EXPIRE_DATE > ${moment(
//           new Date()
//         ).format("YYYY-MM-DD")}`,
//       });
//       if (res && res.code == 200) {
//        console.log("getSubscriptionDetails", res.data);
//       }
//     } catch (error) {}
//   };
export function convertToHtml(text: any) {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const italicRegex = /_([^_]+)_/g;
  return text
    .replace(/\r?\n/g, '<br>')
    .replace(boldRegex, '<b>$1</b>')
    .replace(italicRegex, '<i>$1</i>');
}
 export const formatAM_PM = (date: any) => {
   let hours = date.getHours();
   let minutes = date.getMinutes();
   let ampm = hours >= 12 ? 'PM' : 'AM';
   hours = hours % 12;
   hours = hours ? hours : 12;
   minutes = minutes < 10 ? '0' + minutes : minutes;
   let strTime = hours + ':' + minutes + ' ' + ampm;
   return strTime;
 };
export {
  wp,
  hp,
  checkInternet,
  openWhatsapp,
  openPhone,
  openMessage,
  getCountryCode,
  width,
  height,
  classFilter,
  isSubscriptionActive,
};
