import React from 'react';
import { ScrollView, Text, View, StyleSheet, Linking } from 'react-native';
import { Header } from '../../Components';

const TrackTermsAndConditions = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header
                label={'Terms And Conditions'}
                onBack={() => {

                    navigation.goBack();
                }}
            />
            <ScrollView style={{ paddingHorizontal: 12 }}>
                <Text style={styles.heading}>12 Dimensions Contest Challenge – Terms and Conditions</Text>
                <Text style={styles.paragraph}>
                    These Terms and Conditions ("Terms") govern your participation in the 12 Dimensions Contest Challenge ("Contest") organized by 12 Dimensions App, owned and operated by Mayur Sinhasane.
                </Text>
                <Text style={styles.paragraph}>
                    By registering for the Contest, you agree to be bound by these Terms. If you do not agree, please do not register or participate.
                </Text>

                {/* 1. Eligibility */}
                <Text style={styles.subHeading}>1. Eligibility</Text>
                <Text style={styles.listItem}>1.1 The Contest is open to:</Text>
                <Text style={styles.bullet}>• Participants aged 04 years and above.</Text>
                <Text style={styles.bullet}>• School students by age 5 (Class Junior KG onwards) with consent from parents or guardians. (Registered Schools to 12 Dimensions APP with a signed agreement)</Text>
                <Text style={styles.listItem}>1.2 Participants must:</Text>
                <Text style={styles.bullet}>• Have access to a smartphone/device with the 12 Dimensions app installed.</Text>
                <Text style={styles.bullet}>• Be physically and mentally fit to perform challenge tasks.</Text>
                <Text style={styles.bullet}>• Register using accurate and verifiable personal details.</Text>

                {/* 2. Registration & Participation */}
                <Text style={styles.subHeading}>2. Registration & Participation</Text>
                <Text style={styles.bullet}>• Complete the official registration via the app or authorized partners (e.g., schools).</Text>
                <Text style={styles.bullet}>• A non-refundable entry fee per challenge is required.</Text>
                <Text style={styles.bullet}>• Multiple challenges can be entered by paying separately for each.</Text>
                <Text style={styles.bullet}>• Registration closes on the announced deadline. No late entries accepted.</Text>

                {/* 3. Contest Structure */}
                <Text style={styles.subHeading}>3. Contest Structure</Text>
                <Text style={styles.bullet}>• 12 Life Dimensions, each a 28-day challenge (e.g., Physical, Psychological, Spiritual, etc.).</Text>
                <Text style={styles.bullet}>• Follow instructions via the app.</Text>
                <Text style={styles.bullet}>• Submit daily challenge completions to unlock animation. Missing this may lead to disqualification.</Text>
                <Text style={styles.bullet}>• Challenge may be virtual or real.</Text>

                {/* 4. Evaluation & Judging */}
                <Text style={styles.subHeading}>4. Evaluation & Judging</Text>
                <Text style={styles.bullet}>• Judging based on: scores, consistency, effort, improvement, creativity, and completion.</Text>
                <Text style={styles.bullet}>• Final decisions by 12 Dimensions appointed judges. No appeals allowed.</Text>
                <Text style={styles.bullet}>• In case of ties, a lucky draw may occur.</Text>

                {/* 5. Rewards & Recognition */}
                <Text style={styles.subHeading}>5. Rewards & Recognition</Text>
                <Text style={styles.bullet}>• Winners receive: Cash rewards, coupons, digital certificates, app/social media features.</Text>
                <Text style={styles.bullet}>• High-performing schools may receive incentives.</Text>
                <Text style={styles.bullet}>• Rewards distributed within 30 working days post verification.</Text>

                {/* 6. Publicity & Content Use */}
                <Text style={styles.subHeading}>6. Publicity & Content Use</Text>
                <Text style={styles.bullet}>• You allow 12 Dimensions to use your name, school, city, photo/video submissions for promotional use.</Text>
                <Text style={styles.bullet}>• Content may be shared via app, social media, marketing material, government/partner platforms.</Text>
                <Text style={styles.bullet}>• No extra compensation unless agreed in writing.</Text>

                {/* 7. Data Collection & Privacy */}
                <Text style={styles.subHeading}>7. Data Collection & Privacy</Text>
                <Text style={styles.bullet}>• Data collected: name, age, contact, school, photo, videos – only for contest purposes.</Text>
                <Text style={styles.bullet}>• Data stored securely and not sold/shared to third-party advertisers.</Text>
                <Text style={styles.bullet}>• Parents can request data deletion by writing to support@12dimensions.in.</Text>

                {/* 8. Code of Conduct */}
                <Text style={styles.subHeading}>8. Code of Conduct</Text>
                <Text style={styles.bullet}>• Be respectful to organizers and others.</Text>
                <Text style={styles.bullet}>• No abuse, fraud, or manipulation.</Text>
                <Text style={styles.bullet}>• Violations may lead to disqualification or legal action.</Text>

                {/* 9. Safety & Responsibility */}
                <Text style={styles.subHeading}>9. Safety & Responsibility</Text>
                <Text style={styles.bullet}>• Participants are responsible for their own physical/mental safety.</Text>
                <Text style={styles.bullet}>• Underage participants should perform under supervision.</Text>
                <Text style={styles.bullet}>• Organizers not liable for injuries or losses.</Text>

                {/* 10. Technical Support & Access */}
                <Text style={styles.subHeading}>10. Technical Support & Access</Text>
                <Text style={styles.bullet}>• Report app issues via in-app help or support email.</Text>
                <Text style={styles.bullet}>• Resolution within 48 hours. No extensions for unreported issues.</Text>

                {/* 11. Modification, Suspension, or Cancellation */}
                <Text style={styles.subHeading}>11. Modification, Suspension, or Cancellation</Text>
                <Text style={styles.bullet}>• Organizers may change rules, delay or cancel the contest with updates via official channels.</Text>

                {/* 12. Legal Jurisdiction */}
                <Text style={styles.subHeading}>12. Legal Jurisdiction</Text>
                <Text style={styles.bullet}>• Disputes subject to Sangli District Court, Maharashtra, India.</Text>
                <Text style={styles.bullet}>• Attempt amicable resolution before legal action.</Text>

                {/* 13. Contact Information */}
                <Text style={styles.subHeading}>13. Contact Information</Text>
                <Text style={styles.bullet}>📧 Email: support@12dimensionsapp.in</Text>
                <Text style={styles.bullet}>📞 Facebook: @12dimensions.app</Text>
                <Text style={styles.bullet}>📱 Instagram: @12dimensions.app</Text>
                <View style={styles.bulletRow}>
                    <Text style={styles.bullet}>🌐 Website:</Text>
                    <Text
                        style={[styles.bullet, styles.link]}
                        onPress={() => Linking.openURL('https://www.12dimensionsapp.in')}
                    >www.12dimensionsapp.in
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 12,
        backgroundColor: '#FFF',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    subHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
        color: '#444',
    },
    paragraph: {
        fontSize: 14,
        marginBottom: 10,
        color: '#555',
    },
    listItem: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        color: '#444',
    },
    bullet: {
        fontSize: 14,
        marginLeft: 12,
        marginBottom: 4,
        color: '#444',
    },
    link: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    bulletRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
});

export default TrackTermsAndConditions;
