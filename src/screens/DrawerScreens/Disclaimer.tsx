import {View, Text, Image} from 'react-native';
import React from 'react';
import {StackProps} from '../../routes';
import {useSelector} from '../../Modules';
import {Header} from '../../Components';
import {comingSoon} from '../../../assets';
import {convertToHtml} from '../../Functions';
import WebView from 'react-native-webview';

type Props = StackProps<'Disclaimer'>;
const Disclaimer = ({navigation}: Props) => {
  const {Colors, Sizes, Fonts} = useSelector(state => state.app);

  const htmlContent = `**Disclaimer for 12 DIMENSIONS**

1. **General Information**
   The information provided by 12 DIMENSIONS (“we,” “us,” or “our”) on our mobile application (the “App”) is for general informational purposes only. All information on the App is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the App.

2. **Professional Advice**
   The App is not intended to provide professional medical, financial, legal, or psychological advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional advice or delay in seeking it because of something you have read on this App.

3. **Personal Responsibility**
   You acknowledge that your use of the App and its content is solely at your own risk. You agree to take full responsibility for any actions you take based on the information provided through the App.

4. **No Guarantees**
   We do not guarantee the accuracy, effectiveness, or success of any productivity methods or lifestyle changes suggested by the App. Results may vary for each individual, and we do not promise specific outcomes or results from using the App.

5. **Limitation of Liability**
   In no event shall 12 DIMENSIONS be liable for any direct, indirect, consequential, incidental, special, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the App; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any interruption or cessation of transmission to or from the App; (iv) any bugs, viruses, trojan horses, or the like which may be transmitted to or through our App by any third party; or (v) any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the App, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.

6. **Third-Party Links**
   The App may contain (or you may be sent through the App) links to other websites or content belonging to or originating from third parties or links to websites and features. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the App or any website or feature linked in any banner or other advertising.


7. **User-Generated Content**
   If the App allows users to submit content, we are not responsible for the content submitted by users. You are responsible for the content you submit, and you agree not to submit content that is illegal, offensive, or otherwise inappropriate.

8. **Changes and Updates**
   We reserve the right to amend this disclaimer at any time without prior notice. You are encouraged to review this disclaimer periodically to stay informed of updates. Your continued use of the App after any changes to this disclaimer constitutes your acceptance of the new terms.
`;
  const DisclaimerHtml = convertToHtml(htmlContent);
  const disclaimerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Disclaimer for 12 DIMENSIONS</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      line-height: 1.6;
      font-size: 14px;
      text-align: justify;
    }
    h1, h2 {
      color: #333;
      font-size: 16px;
      text-align: justify;
    }
    p {
      margin-bottom: 20px;
      font-size: 14px;
      text-align: justify;
    }
    ul {
      padding-left: 20px;
      list-style-type: none; /* Remove default bullets */
    }
    ul li::before {
      content: "- "; /* Add hyphen before each list item */
    }
  </style>
</head>
<body>
  <h1>Disclaimer for 12 DIMENSIONS</h1>
  
  <p><strong>1. General Information</strong><br>
  The information provided by 12 DIMENSIONS (“we,” “us,” or “our”) on our mobile application (the “App”) is for general informational purposes only. All information on the App is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the App.</p>
  
  <p><strong>2. Professional Advice</strong><br>
  The App is not intended to provide professional medical, financial, legal, or psychological advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional advice or delay in seeking it because of something you have read on this App.</p>
  
  <p><strong>3. Personal Responsibility</strong><br>
  You acknowledge that your use of the App and its content is solely at your own risk. You agree to take full responsibility for any actions you take based on the information provided through the App.</p>
  
  <p><strong>4. No Guarantees</strong><br>
  We do not guarantee the accuracy, effectiveness, or success of any productivity methods or lifestyle changes suggested by the App. Results may vary for each individual, and we do not promise specific outcomes or results from using the App.</p>
  
  <p><strong>5. Limitation of Liability</strong><br>
  In no event shall 12 DIMENSIONS be liable for any direct, indirect, consequential, incidental, special, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the App; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any interruption or cessation of transmission to or from the App; (iv) any bugs, viruses, trojan horses, or the like which may be transmitted to or through our App by any third party; or (v) any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the App, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>
  
  <p><strong>6. Third-Party Links</strong><br>
  The App may contain (or you may be sent through the App) links to other websites or content belonging to or originating from third parties or links to websites and features. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the App or any website or feature linked in any banner or other advertising.</p>
  
  <p><strong>7. User-Generated Content</strong><br>
  If the App allows users to submit content, we are not responsible for the content submitted by users. You are responsible for the content you submit, and you agree not to submit content that is illegal, offensive, or otherwise inappropriate.</p>
  
  <p><strong>8. Changes and Updates</strong><br>
  We reserve the right to amend this disclaimer at any time without prior notice. You are encouraged to review this disclaimer periodically to stay informed of updates. Your continued use of the App after any changes to this disclaimer constitutes your acceptance of the new terms.</p>
</body>
</html>
`;

  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label="Disclaimer"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1}}>
        <WebView
          originWhitelist={['*']}
          source={{html: disclaimerHtml}}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Disclaimer;
