import {View, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from '../../../Modules';
import {Header, Icon, TextButton, Toast} from '../../../Components';
import {StackProps} from '../../../routes';
import Pdf from 'react-native-pdf';
import {useTranslation} from 'react-i18next';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import {IMAGE_URL} from '../../../Modules/service';
import moment from 'moment';
import RNFS from 'react-native-fs';
import {QUESTION_TYPE_WISE_LIST} from '../../../Modules/interface';
import {
  check,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import AddFontSizeFilter from './AddFontSizeFilter';

type Props = StackProps<'ExportPdfData'>;
const ExportPdfData = ({navigation, route}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const {Data, Type, Item} = route.params;
  const {t} = useTranslation();
  const {SUBJECT_SELECTED}: any = useSelector(state => state.QuestionPaperType);
  const [DownloadedPath, setDownloadedPath] = useState('');
  const [openStyleFilter, SetOpenStyleFilter] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({
    loader: true,
    downloading: false,
  });
  const [fontSize, setFontSize] = useState({
    school: '24px',
    board: '22px',
    class: '18px',
    type: '18px',
    question: '16px',
  });
  const [fontFamily, setFontFamily] = useState({
    label: 'Arial',
    value: `'Arial', sans-serif`,
  });
  const source = {uri: DownloadedPath, cache: false};
  useEffect(() => {
    if (Type == 1) {
      DownloadPDF('G', fontSize, fontFamily);
    } else {
      DownloadPDF2('G', fontSize, fontFamily);
    }
  }, []);
  const DownloadPDF = async (type: string, fontSize: any, fontFamily: any) => {
    const permission = await requestMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ]).then(result => {
      if (RESULTS.GRANTED) {
        return true;
      } else {
        Toast('Storage permission not granted');
      }
    });
    // console.log('permission...', permission);
    if (permission) {
      try {
        const htmlContent = convertDataToHTML(Item, fontSize, fontFamily);
        const fileName = (
          SUBJECT_SELECTED.CLASS_NAME +
          SUBJECT_SELECTED.BOARD_MEDIUM_NAME +
          Data.TestName
        ).replace(/\s/g, '');
        const options = {
          html: htmlContent,
          fileName: fileName,
          directory: RNFS.DownloadDirectoryPath,
        };
        const pdf = await RNHTMLtoPDF.convert(options);
        const destinationPath = pdf.filePath;
        setDownloadedPath(destinationPath);

        if (type === 'D') {
          //  const newDestinationPath = `/storage/emulated/0/Download/${fileName}.pdf`;
          const newDestinationPath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;
          await RNFS.copyFile(pdf.filePath, newDestinationPath);
          Toast(t('QuestionPaperModule.PdfDownloadedSuccessfully'));
        }
        destinationPath ? null : Toast('Something Wrong...try again');
        setLoading({...loading, loader: false, downloading: false});
        return pdf.filePath;
      } catch (error) {
        Toast('Something Wrong...try again');
        console.error('Error generating PDF 777:', error);
        return null;
      }
    } else {
      Toast('Storage permission is required.');
    }
  };
  const DownloadPDF2 = async (type: string, fontSize: any, fontFamily: any) => {
    const permission = await requestMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ]).then(result => {
      if (RESULTS.GRANTED) {
        return true;
      } else {
        Toast('Storage permission not granted');
      }
    });
    if (permission) {
      try {
        const htmlContent = convertDataToHTML2(Item, fontSize, fontFamily);
        const fileName = (
          SUBJECT_SELECTED.CLASS_NAME +
          SUBJECT_SELECTED.BOARD_MEDIUM_NAME +
          Data.TestName
        ).replace(/\s/g, '');
        const options = {
          html: htmlContent,
          fileName: fileName,
          directory: RNFS.DownloadDirectoryPath,
        };
        const pdf = await RNHTMLtoPDF.convert(options);
        const destinationPath = pdf.filePath;
        setDownloadedPath(destinationPath);
        await RNFS.moveFile(pdf.filePath, destinationPath);
        if (type === 'D') {
          const newDestinationPath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;
          await RNFS.copyFile(pdf.filePath, newDestinationPath);
          Toast(t('QuestionPaperModule.PdfDownloadedSuccessfully'));
        }
        destinationPath ? null : Toast('Something Wrong...try again');
        setLoading({...loading, loader: false, downloading: false});
        return destinationPath;
      } catch (error) {
        console.error('Error generating PDF ookk:', error);
        return null;
      }
    } else {
      Toast('Storage permission is required.');
    }
  };
  const convertMinutesToHoursMinutes = () => {
    const enteredMinutes = parseInt(Data.Time);

    if (isNaN(enteredMinutes)) {
      Toast('Please enter a valid number');
      return;
    }

    const hours = Math.floor(enteredMinutes / 60);
    const remainingMinutes = enteredMinutes % 60;

    return `${hours} hours:${remainingMinutes} minutes`;
  };
  const generatePDF = async () => {
    try {
      const htmlContent =
        Type == 1
          ? convertDataToHTML(Item, fontSize, fontFamily)
          : convertDataToHTML2(Item, fontSize, fontFamily);

      const options = {
        html: htmlContent,
        fileName:
          SUBJECT_SELECTED.CLASS_NAME +
          SUBJECT_SELECTED.BOARD_MEDIUM_NAME +
          Data.TestName,
        directory: 'Documents',
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      await RNPrint.print({
        filePath: pdf ? pdf.filePath : '',
        jobName: '' + Date.now() + '.pdf',
        isLandscape: false,
      });

      return pdf.filePath;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };
  const convertDataToHTML = (
    organizedQuestions: any,
    fontSize: any,
    fontFamily: any,
  ) => {
    let converted = convertMinutesToHoursMinutes();

    const generateHTMLContent = (data: any) => {
      let html = `
    <html>
      <head>
       <link href="https://fonts.googleapis.com/css2?family=${fontFamily.label}&display=swap" rel="stylesheet">
        <style>
          body {
            font-family:${fontFamily.value};
            padding-left: 30px;
            padding-right: 30px;
            padding-top: 30px;
          }
          .question-type {
            display: flex;
            color: black;
            font-weight: bold;
            justify-content: space-between;
            background-color: white;
            margin-top: 30px;
          }
          .question-container {
             background-color: white;
             font-size: ${fontSize.question};
             font-weight: 500;
          }
          .question-info {
            display: flex;
            flex-direction: column;
          }
          .options {
            list-style-type: none;
            margin-start: 20px;
            padding-left: 40px;
            padding-bottom: 10px;
            font-size: ${fontSize.question};
            font-weight: normal;
          }
          .option {
            margin-bottom: 0px;
            display: flex;
            align-items: center;
            font-size: ${fontSize.question};
          }
          li {
            padding-bottom: 10px;
          }
          img {
            display: block;
            vertical-align: middle;
          }
            .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .info-item {
            margin-bottom: -13px;
            font-size: ${fontSize.class};
            font-weight: 500;
          }
          h1, h2, h3, h4 {
            text-align: center;
          }
          hr {
             margin-top: 50px;
             border: none;
             height: 2px;
             background-color: black;
          }
        </style>
      </head>
      <body>
  `;

      html += `
    <div class="main-container" style="display: flex; flex-direction: column; border-bottom: 1px solid black;">
    ${
      member?.INSTITUTE_LOGO
        ? `<img src="${
            IMAGE_URL + 'instituteLogo/' + member?.INSTITUTE_LOGO
          }" alt="logo" class="institute-logo" style="width: 100px; height: 100px;align-self: center;" />`
        : ''
    }
      <h1 style="margin-bottom: -4px; font-size: ${fontSize.school}; ">${
        member?.SCHOOL_NAME
      }</h1>
      <h2 style="margin-bottom: 0px; font-size: ${fontSize.board};">${
        // SUBJECT_SELECTED.BOARD_NAME
        Data.TestName
      }</h2>
      <div class="info-row">
        <h2 class="info-item" >Class Name: ${SUBJECT_SELECTED.CLASS_NAME}</h2>
        <h2 class="info-item">Total Marks: ${Data.TotalMarks}</h2>
      </div>
      <div class="info-row">
        <h3 class="info-item" >Exam Time: ${converted}</h3>
        <h3 class="info-item" ">Exam Date: ${moment(Data.Date).format(
          'DD/MMM/YYYY',
        )}</h3>
      </div>
        <hr>
    </div>
  `;
      for (const [questionTypeName, questions] of Object.entries(data)) {
        html += `
      <span class="question-type">
        <p style=" font-weight: 600; font-size: ${fontSize.type};">${questionTypeName}</p>
        <!-- <p style=" font-weight: 600; font-size: ${fontSize.type};">Marks: ${questions[0].type}</p> -->
      </span>
    `;

        questions.forEach((question: any, index: number) => {
          html += `
        <div class="question-container">
          <p>${index + 1}) ${question.question.QUESTION}</p>
          ${
            question.question.QUESTION_IMAGE
              ? `<img src="${IMAGE_URL}/questionImage/${
                  question.question.QUESTION_IMAGE
                }" width=${
                  question.question.QUESTION_IMAGE_SIZE == 'S'
                    ? '30%'
                    : question.question.QUESTION_IMAGE_SIZE == 'M'
                    ? '55%'
                    : '100%'
                } height: auto; object-fit: ${
                  question.question.QUESTION_IMAGE_SIZE == 'S'
                    ? 'cover'
                    : question.question.QUESTION_IMAGE_SIZE == 'M'
                    ? 'contain'
                    : 'fill'
                };>`
              : ''
          }
          <ul class="options">
      `;

          if (question.question.QuestionOption) {
            question.question.QuestionOption.forEach(
              (option: any, index: number) => {
                html += `
            <li class="option">${index + 1}) ${option.OPTION_TEXT} ${
                  option.OPTION_IMAGE_URL
                    ? `<img src="${IMAGE_URL}/optionImage/${option.OPTION_IMAGE_URL}" width="25%" height="80" style="margin-left: 20px;">`
                    : ''
                }</li>
          `;
              },
            );
          }

          html += `
          </ul>
        </div>
      `;
        });
      }

      html += `
      </body>
    </html>
  `;
      return html;
    };

    return generateHTMLContent(organizedQuestions);
  };
  const convertDataToHTML2 = (
    mergedSelectedQuestions: QUESTION_TYPE_WISE_LIST[],
    fontSize: any,
    fontFamily: any,
  ) => {
    let converted = convertMinutesToHoursMinutes();
    const generateHTMLContent = (data: QUESTION_TYPE_WISE_LIST[]) => {
      let html = `
    <html>
      <head>
       <link href="https://fonts.googleapis.com/css2?family=${fontFamily.label}&display=swap" rel="stylesheet">
        <style>
          body {
            font-family:${fontFamily.value};
            padding-left: 30px;
            padding-right: 30px;
            padding-top: 30px;
          }
          .main-container {
            margin: 0 auto; 
            max-width: 800px; 
            padding: 0 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .info-item {
            margin-bottom: -13px;
            font-size: ${fontSize.class};
            font-weight: 500;
          }
          .question-type {
            display: flex;
            color: black;
            font-weight: bold;
            justify-content: space-between;
            background-color: white;
            margin-top: 36px
          }
          .question-container {
             background-color: white;
             font-size: ${fontSize.question};
             font-weight: 400;
             padding-left: 26px
          }
          .question-info {
            display: flex;
            flex-direction: column;
          }
           .options {
            list-style-type: none;
            margin-start: 20px;
            padding-left: 40px;
            font-size: ${fontSize.question};
            font-weight: normal;
          }
          .option {
            margin-bottom: 0px;
            display: flex;
            align-items: center;
            font-size: ${fontSize.question};
            padding-bottom: 10px;
          }
          h1, h2, h3, h4 {
            text-align: center;
          }
          hr {
            margin-top: 50px;
            border: none;
            height: 2px;
            background-color: black;
          }
        </style>
      </head>
      <body>
  `;

      html += `
    <div class="main-container">
      <h1 style="margin-bottom: -4px; font-size: ${fontSize.school}; ">${
        member?.SCHOOL_NAME
      }</h1>
      <h2 style="margin-bottom: 3px; font-size: ${fontSize.board};">${
        // SUBJECT_SELECTED.BOARD_NAME
        Data.TestName
      }</h2>
      <div class="info-row">
        <h2 class="info-item" >Class Name: ${SUBJECT_SELECTED.CLASS_NAME}</h2>
        <h2 class="info-item">Total Marks: ${Data.TotalMarks}</h2>
      </div>
      <div class="info-row">
        <h3 class="info-item" >Exam Time: ${converted}</h3>
        <h3 class="info-item" ">Exam Date: ${moment(Data.Date).format(
          'DD/MMM/YYYY',
        )}</h3>
      </div>
        <hr>
    </div>
  `;

      let questionTypeIndex = 0;
      for (const questionType of data) {
        let totalMarks = 0;

        html += `
      <span class="question-type">
        <h3 style="font-weight: bold;">${questionTypeIndex + 1}) ${
          questionType.LABEL
        } (Solve Any ${questionType.WANT_TO_ASK_QUESTIONS} Out Of ${
          questionType.OUT_OF_QUESTIONS
        })</h3>
        <p style="font-weight: bold;">${totalMarks}</p>
      </span>
    `;

        questionType.questions?.forEach((selectedQuestion: any, index: any) => {
          html += `
        <div class="question-container">
          <p>${index + 1}) ${selectedQuestion.QUESTION}</p>
          <ul class="options">
      `;

          if (selectedQuestion.QuestionOption) {
            selectedQuestion.QuestionOption.forEach((option: any) => {
              html += `<li class="option">${option.ID}) ${option.OPTION_TEXT}</li>`;
            });
          }

          html += `
          </ul>
        </div>
      `;
        });

        questionTypeIndex++;
      }

      html += `
      </body>
    </html>
  `;

      return html;
    };

    return generateHTMLContent(mergedSelectedQuestions);
  };
  return (
    <View
      style={{
        flex: 1,
        margin: 0,
        borderRadius: 0,
        padding: 0,
        backgroundColor: Colors.QuestionPaperBackground,
      }}>
      <View style={{flex: 1}}>
        <Header
          label="Pdf"
          onBack={() => {
            navigation.goBack();
          }}
          rightChild={
            <Icon
              name="format-font"
              type="MaterialCommunityIcons"
              color={Colors.White}
              size={25}
              onPress={() => {
                SetOpenStyleFilter(true);
              }}
            />
          }
        />
        {loading.loader ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="small" color={Colors.Primary} />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              borderRadius: Sizes.Radius,
              flexDirection: 'column',
              margin: Sizes.ScreenPadding,
            }}>
            <Pdf
              source={source}
              onLoadComplete={(numberOfPages, filePath) => {}}
              onPageChanged={(page, numberOfPages) => {}}
              onError={error => {
                console.warn(error);
              }}
              onPressLink={uri => {
                // console.log(`Link pressed: ${uri}`);
              }}
              style={{
                flex: 1,
                borderRadius: Sizes.Radius,
                backgroundColor: Colors.White,
              }}
            />
          </View>
        )}
        <View
          style={{
            marginHorizontal: Sizes.Padding + Sizes.Base,
            marginBottom: Sizes.Padding,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <TextButton
              onPress={async () => {
                Type == 1
                  ? await DownloadPDF('D', fontSize, fontFamily)
                  : await DownloadPDF2('D', fontSize, fontFamily);
              }}
              loading={false}
              textStyle={{...Fonts.Medium1, fontSize: 15}}
              label={'Download'}
            />
          </View>
          <View style={{width: Sizes.Padding}} />
          <View style={{flex: 1}}>
            <TextButton
              onPress={() => {
                generatePDF();
              }}
              textStyle={{...Fonts.Medium1, fontSize: 15}}
              loading={false}
              label={'Print pdf'}
            />
          </View>
        </View>
      </View>
      {openStyleFilter && (
        <AddFontSizeFilter
          fontSize={fontSize}
          isVisible={openStyleFilter}
          onClose={async () => {
            SetOpenStyleFilter(false);
          }}
          fontFamily={fontFamily}
          onSuccess={async ({fontSize, fontFamily}: any) => {
            await setFontSize(fontSize);
            await setFontFamily(fontFamily);
            setLoading({...loading, loader: true});
            SetOpenStyleFilter(false);
            if (Type == 1) {
              await DownloadPDF('G', fontSize, fontFamily);
            } else {
              await DownloadPDF2('G', fontSize, fontFamily);
            }
          }}
        />
      )}
    </View>
  );
};

export default ExportPdfData;
