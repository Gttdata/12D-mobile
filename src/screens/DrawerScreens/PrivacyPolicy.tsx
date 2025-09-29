import {Linking, View} from 'react-native';
import React from 'react';
import {StackProps} from '../../routes';
import {useSelector} from '../../Modules';
import {Header} from '../../Components';
import WebView from 'react-native-webview';
import {useTranslation} from 'react-i18next';
import {convertToHtml} from '../../Functions';

type Props = StackProps<'PrivacyPolicy'>;
const PrivacyPolicy = ({navigation}: Props): JSX.Element => {
  const {t} = useTranslation();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  //   const htmlContent = `**Privacy Policy for 12 DIMENSIONS**

  // **Last Updated: 12 August 2024**

  // 1. **Introduction**
  //    Welcome to 12 DIMENSIONS (“we,” “our,” or “us”). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at mayur.sinhasane@gmail.com.

  // 2. **Information We Collect**
  //    We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include the following:
  //    - **Personal Information**: Name, email address, phone number, and other similar contact data.
  //    - **Usage Data**: Information about how you use our App, such as the features you use and the time you spend on the App.
  //    - **Device Information**: Information about your device, such as IP address, device type, operating system, and browser type.

  // 3. **How We Use Your Information**
  //    We use the information we collect in various ways, including to:
  //    - Provide, operate, and maintain our App
  //    - Improve, personalize, and expand our App
  //    - Understand and analyze how you use our App
  //    - Develop new products, services, features, and functionalities
  //    - Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the App, and for marketing and promotional purposes
  //    - Process your transactions and manage your orders
  //    - Find and prevent fraud
  //    - Comply with legal obligations

  // 4. **Sharing Your Information**
  //    We do not share your personal information with third parties except in the following circumstances:
  //    - With your consent
  //    - For compliance with laws: We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.
  //    - Service Providers: We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include payment processing, data analysis, email delivery, hosting services, customer service, and marketing efforts.

  // 5. **Security of Your Information**
  //    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.

  // 6. **Your Data Protection Rights**
  //    Depending on your location, you may have the following rights regarding your personal information:
  //    - The right to access – You have the right to request copies of your personal data.
  //    - The right to rectification – You have the right to request that we correct any information you believe is inaccurate or incomplete.
  //    - The right to erasure – You have the right to request that we erase your personal data, under certain conditions.
  //    - The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.
  //    - The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.
  //    - The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.

  // 7. **Changes to This Privacy Policy**
  //    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date above. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

  // 8. **Contact Us**
  //    If you have any questions about this Privacy Policy, please contact us:
  //    - By email: mayur.sinhasane@gmail.com
  //    - By visiting this page on our website:
  // `;

  //   const PrivacyPolicyHtml = convertToHtml(htmlContent);

  const privacyPolicyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy for 12 DIMENSIONS</title>
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
    li {
      margin-bottom: 10px;
    }
    a {
      color: #007BFF; /* Adjust link color if needed */
      text-decoration: none; /* Remove underline */
      font-weight: 500; /* Set font-weight to medium */
    }
  </style>
</head>
<body>
  <h1>Privacy Policy for 12 DIMENSIONS</h1>
  <p><strong>Last Updated: 12 August 2024</strong></p>

  <h2>1. Introduction</h2>
  <p>Welcome to 12 DIMENSIONS (“we,” “our,” or “us”). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at <a href="mailto:12dimensions.ind@gmail.com">12dimensions.ind@gmail.com</a>.</p>

  <h2>2. Information We Collect</h2>
  <p>We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include the following:</p>
  <ul>
    <li><strong>Personal Information</strong>: Name, email address, phone number, and other similar contact data.</li>
    <li><strong>Usage Data</strong>: Information about how you use our App, such as the features you use and the time you spend on the App.</li>
    <li><strong>Device Information</strong>: Information about your device, such as IP address, device type, operating system, and browser type.</li>
  </ul>

  <h2>3. How We Use Your Information</h2>
  <p>We use the information we collect in various ways, including to:</p>
  <ul>
    <li>Provide, operate, and maintain our App</li>
    <li>Improve, personalize, and expand our App</li>
    <li>Understand and analyze how you use our App</li>
    <li>Develop new products, services, features, and functionalities</li>
    <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the App, and for marketing and promotional purposes</li>
    <li>Process your transactions and manage your orders</li>
    <li>Find and prevent fraud</li>
    <li>Comply with legal obligations</li>
  </ul>

  <h2>4. Sharing Your Information</h2>
  <p>We do not share your personal information with third parties except in the following circumstances:</p>
  <ul>
    <li>With your consent</li>
    <li>For compliance with laws: We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
    <li>Service Providers: We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include payment processing, data analysis, email delivery, hosting services, customer service, and marketing efforts.</li>
  </ul>

  <h2>5. Security of Your Information</h2>
  <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

  <h2>6. Your Data Protection Rights</h2>
  <p>Depending on your location, you may have the following rights regarding your personal information:</p>
  <ul>
    <li>The right to access – You have the right to request copies of your personal data.</li>
    <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or incomplete.</li>
    <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
    <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
    <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
    <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
  </ul>

  <h2>7. Changes to This Privacy Policy</h2>
  <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date above. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

  <h2>8. Contact Us</h2>
  <p>If you have any questions about this Privacy Policy, please contact us:</p>
  <ul>
    <li>By email: <a href="mailto:12dimensions.ind@gmail.com">12dimensions.ind@gmail.com</a></li>
    <li>By visiting this page on our website: <a href="[URL]"></a></li>
  </ul>
</body>
</html>
`;

  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label={t('PrivacyPolicy.privacyPolicy')}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1}}>
        <WebView
          originWhitelist={['*']}
          source={{html: privacyPolicyHtml}}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          onShouldStartLoadWithRequest={event => {
            if (event.url.startsWith('mailto:')) {
              Linking.openURL(event.url).catch(err =>
                console.error('Failed to open URL:', err),
              );
              return false; // Prevent WebView from loading the URL
            }
            return true; // Allow other URLs to load
          }}
        />
      </View>
    </View>
  );
};

export default PrivacyPolicy;
