import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const colors = {
    background: theme === "light" ? "#f5f5f5" : "#1a1a1a",
    cardBackground: theme === "light" ? "#fff" : "#2a2a2a",
    text: theme === "light" ? "#333" : "#f5f5f5",
    subText: theme === "light" ? "#666" : "#ccc",
    border: theme === "light" ? "#eee" : "#444",
    primary: "#667eea",
    headerIcon: theme === "light" ? "#333" : "#f5f5f5",
  };

  const privacyPolicyContent = `Privacy Policy for StudentFlow

Effective Date: July 30, 2025

This Privacy Policy describes how StudentFlow ("we," "us," or "our") collects, uses, and discloses information when you use our mobile application (the "App").

1. Information We Collect
StudentFlow is designed with your privacy in mind. We primarily operate as a local-first application, meaning most of your data is stored directly on your device.

Information you provide directly:
\u2022 Profile Information: When you set up your profile, we collect information such as your name, school, and semester.
\u2022 Reminders: Data related to your reminders, including titles, descriptions, dates, types, and priorities.
\u2022 Financial Obligations: Details about your income, expenses, and financial commitments.
\u2022 Academic Calendar Data: Information you upload or input regarding your academic schedule.

Information collected automatically:
\u2022 Usage Data: We may collect anonymous, aggregated usage data (e.g., app crashes, feature usage frequency) to improve app performance and user experience. This data is not linked to your personal identity.
\u2022 Device Information: General device information (e.g., operating system version) for compatibility and optimization.

2. How We Use Your Information
Your information is used solely to provide and improve the functionality of the StudentFlow App:
\u2022 To manage your academic calendar, reminders, and financial obligations.
\u2022 To personalize your app experience (e.g., theme settings).
\u2022 To send local notifications for reminders (if enabled).
\u2022 To analyze app usage for improvements (in an aggregated, anonymous form).

3. Data Storage and Security
Most of your personal data is stored locally on your device. We do not store your personal academic or financial data on our servers. We implement reasonable security measures to protect the information stored on your device from unauthorized access or disclosure.

4. Data Sharing and Disclosure
We do not share, sell, or rent your personal data with third parties. As your data is primarily stored locally, there is no server-side sharing of your personal information.

5. Your Choices and Rights
\u2022 Data Access and Export: You can access and export your data directly from the App's settings.
\u2022 Data Deletion: You can reset and clear all your local data through the App's settings.
\u2022 Notification Preferences: You can manage notification settings within the App.

6. Changes to This Privacy Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the App. You are advised to review this Privacy Policy periodically for any changes.

7. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us at:
[albert13@oegmail.com]

By using StudentFlow, you agree to the terms of this Privacy Policy.`;

  return (
    <SafeAreaView style={styles.safeArea(colors, Platform.OS)}>
      <View style={styles.header(colors)}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle(colors)}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Animated.View
          style={[styles.contentCard(colors), { opacity: fadeAnim }]}
        >
          <Text style={styles.sectionHeading(colors)}>
            Our Commitment to Your Privacy
          </Text>
          <Text style={styles.infoText(colors)}>
            Your privacy is paramount. This policy outlines how StudentFlow
            handles your data.
          </Text>
          <View style={styles.divider(colors)} />
          <Text style={styles.mainContentText(colors)}>
            {privacyPolicyContent}
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: (colors, platformOS) => ({
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: platformOS === "android" && 0,
  }),
  header: (colors) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBackground,
    width: "100%",
    marginTop: 3,
    height: 90,
  }),
  backButton: {
    paddingTop: 24,
  },
  headerTitle: (colors) => ({
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 24,
    color: colors.text,
  }),
  placeholder: {
    width: 24,
    paddingTop: 24,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  contentCard: (colors) => ({
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 600,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  }),
  sectionHeading: (colors) => ({
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 10,
  }),
  infoText: (colors) => ({
    fontSize: 14,
    color: colors.subText,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  }),
  divider: (colors) => ({
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
    width: "80%",
    alignSelf: "center",
  }),
  mainContentText: (colors) => ({
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    textAlign: "justify",
  }),
});
