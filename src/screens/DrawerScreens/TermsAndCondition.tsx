import {View, Linking} from 'react-native';
import React from 'react';
import {StackProps} from '../../routes';
import {useSelector} from '../../Modules';
import {Header} from '../../Components';
import {useTranslation} from 'react-i18next';
import WebView from 'react-native-webview';

type Props = StackProps<'TermsAndCondition'>;
const TermsAndCondition = ({navigation}: Props): JSX.Element => {
  const {t} = useTranslation();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const termsAndConditionHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms and Conditions</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      line-height: 1.6;
      font-size: 14px;
      text-align: justify;
    }
    h1 {
      color: #333;
      font-size: 16px;
    }
    h2 {
      color: #333;
      font-size: 15px;
      margin-top: 30px;
    }
    p, ul {
      margin-bottom: 20px;
      font-size: 14px;
    }
    ul {
      padding-left: 20px;
      list-style-type: none;
    }
    ul li::before {
      content: "- ";
    }
    a {
      color: #007BFF; /* Adjust link color if needed */
      text-decoration: none; /* Remove underline */
      font-weight: 500; /* Set font-weight to medium */
    }
  </style>
</head>
<body>
  <h1>Terms and Conditions for 12 DIMENSIONS</h1>
  <p><strong>Last Updated: 12 August 2024</strong></p>

  <p>These terms and conditions outline the rules and regulations for the use of the 12 DIMENSIONS mobile application (the "App"), operated by [12 Dimensions] ("we," "us," or "our"). By accessing or using the App, you agree to be bound by these terms and conditions. If you disagree with any part of these terms and conditions, please do not use the App.</p>

  <h2>1. Intellectual Property</h2>
  <p>1.1. The App and its original content, features, and functionality are owned by [12 Dimensions] and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
  <p>1.2. You may not modify, reproduce, distribute, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our App, except as allowed by the functionality of the App.</p>

  <h2>2. User Accounts</h2>
  <p>2.1. To access certain features of the App, you may be required to register for an account. When registering, you agree to provide accurate, current, and complete information about yourself. You are responsible for maintaining the confidentiality of your account and password, including restricting access to your computer or mobile device.</p>
  <p>2.2. You agree to accept responsibility for all activities that occur under your account or password.</p>
  <p>2.3. We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion.</p>

  <h2>3. Prohibited Uses</h2>
  <p>3.1. You may use the App only for lawful purposes and in accordance with these terms and conditions. You agree not to use the App:</p>
  <ul>
    <li>- In any way that violates any applicable federal, state, local, or international law or regulation.</li>
    <li>- To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the App, or which, as determined by us, may harm us or users of the App, or expose them to liability.</li>
  </ul>
  <p>3.2. Additionally, you agree not to:</p>
  <ul>
    <li>- Use the App in any manner that could disable, overburden, damage, or impair the App or interfere with any other party's use of the App.</li>
    <li>- Use any robot, spider, or other automatic device, process, or means to access the App for any purpose, including monitoring or copying any of the material on the App.</li>
  </ul>

  <h2>4. Limitation of Liability</h2>
  <p>4.1. The App is provided on an "as-is" and "as-available" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
  <p>4.2. In no event shall [12 Dimensions], nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, arising out of or in connection with your access to or use of the App.</p>

  <h2>5. Governing Law</h2>
  <p>5.1. These terms and conditions are governed by and construed in accordance with the laws of [Your Country], without regard to its conflict of law provisions.</p>

  <h2>6. Changes to Terms and Conditions</h2>
  <p>6.1. We reserve the right, at our sole discretion, to modify or replace these terms and conditions at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

  <h2>7. Contact Us</h2>
  <p>7.1. If you have any questions about these terms and conditions, please contact us at:</p>
  <ul>
 <li>By email: <a href="mailto:12dimensions.ind@gmail.com">12dimensions.ind@gmail.com</a></li>
    <li>By visiting this page on our website: <a href="[URL]"></a></li>
</body>
</html>
`;

  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label={'Terms & Conditions'}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1}}>
        <WebView
          originWhitelist={['*']}
          source={{html: termsAndConditionHtml}}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          onShouldStartLoadWithRequest={event => {
            if (event.url.startsWith('mailto:')) {
              Linking.openURL(event.url).catch(err =>
                console.error('Failed to open URL:', err),
              );
              return false;
            }
            return true;
          }}
        />
      </View>
    </View>
  );
};

export default TermsAndCondition;
