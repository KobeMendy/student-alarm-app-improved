import React, { useState, useEffect, useRef } from "react";
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

export default function HelpSupportScreen() {
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

  const helpContent = `Welcome to StudentFlow Help & Support! We're here to ensure your experience with our app is as smooth and productive as possible.

Frequently Asked Questions (FAQs):
\u2022 How do I add a new reminder?
  Navigate to the 'Reminders' tab or select a date on the 'Calendar' tab and use the 'Add Event' button. Fill in the details and save.

\u2022 Can I sync my academic calendar?
  Yes, you can upload your academic calendar (e.g., PDF, CSV) via the 'Upload' tab. The app will parse key dates and integrate them into your calendar and reminders.

\u2022 How do I track my finances?
  Go to 'My Finances' to add income, expenses, and obligations. You can categorize transactions and set due dates for payments.

\u2022 What if I forget my password?
  StudentFlow currently does not require a password as it focuses on local data management. If you reset the app, your local data will be cleared.

\u2022 How can I change the app's theme?
  You can switch between Light and Dark Mode in the 'Settings' section under 'General'.

Contact Support:
If you can't find the answer to your question in our FAQs, or if you encounter any issues, our support team is ready to assist you.

Email us at: [albert13@oegmail.com]
Visit our support portal: [https://studentflow-support.com]

We aim to respond to all inquiries within 24-48 business hours. Your feedback is valuable and helps us improve StudentFlow for everyone!`;

  return (
    <SafeAreaView style={styles.safeArea(colors, Platform.OS)}>
      <View style={styles.header(colors)}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle(colors)}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Animated.View
          style={[styles.contentCard(colors), { opacity: fadeAnim }]}
        >
          <Text style={styles.sectionHeading(colors)}>Need Assistance?</Text>
          <Text style={styles.infoText(colors)}>
            We're here to help you get the most out of StudentFlow. Find answers
            to common questions or reach out to our support team.
          </Text>
          <View style={styles.divider(colors)} />
          <Text style={styles.mainContentText(colors)}>{helpContent}</Text>
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
    fontSize: 20,
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
