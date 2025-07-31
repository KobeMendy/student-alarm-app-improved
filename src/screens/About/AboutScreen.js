import React, { useState, useEffect, useRef } from "react"; // CHANGED: Added useRef
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

export default function AboutScreen() {
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

  const aboutContent = `StudentFlow is your dedicated partner in navigating the complexities of university life. Our intuitive mobile application is meticulously crafted to empower students with the tools they need to excel academically and manage their personal schedules.

At StudentFlow, we believe that effective organization is the cornerstone of academic success. Our platform seamlessly integrates essential functionalities, transforming how you interact with your academic schedule, personal commitments and financial responsibilities.

Key Features Designed for You:
\u2022 Personalized Academic Calendar: Effortlessly synchronize your university schedule, class timings, examination dates, and assignment deadlines. Stay on top of every important academic event with a clear, concise overview.

\u2022 Smart Reminders & Notifications: Never miss a beat with our intelligent reminder system. Set custom alerts for assignments, group meetings, social events, and personal tasks. Our customizable notifications ensure you're always prepared.

\u2022 Comprehensive Financial Tracker: Gain complete control over your finances. Monitor your income, meticulously track expenses, and manage financial obligations with ease. Our goal is to help you maintain a healthy budget throughout your academic journey.

\u2022 Intuitive Data Management: Your data, your control. Easily export your personalized information, including reminders, financial records, and academic events, for secure record-keeping or detailed analysis.

\u2022 Adaptive Themed Interface: Tailor your visual experience with seamless transitions between light and dark modes. Enjoy a comfortable and aesthetically pleasing interface, day or night.

Our commitment extends beyond just features. StudentFlow is continuously evolving, with ongoing enhancements and new functionalities aimed at further simplifying your academic life. We are passionate about supporting your journey, reducing stress, and fostering an environment where you can thrive and achieve your full potential.

Thank you for choosing StudentFlow – your success, simplified.`;

  return (
    <SafeAreaView style={styles.safeArea(colors, Platform.OS)}>
      <View style={styles.header(colors)}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle(colors)}>About StudentFlow</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Animated.View
          style={[styles.contentCard(colors), { opacity: fadeAnim }]}
        >
          <Text style={styles.appTitle(colors)}>StudentFlow</Text>
          <Text style={styles.tagline(colors)}>
            Your Academic Journey, Simplified.
          </Text>
          <View style={styles.divider(colors)} />
          <Text style={styles.aboutText(colors)}>{aboutContent}</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: (colors, platformOS) => ({
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: platformOS === "android" ? 25 : 0,
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
  appTitle: (colors) => ({
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 8,
  }),
  tagline: (colors) => ({
    fontSize: 16,
    color: colors.subText,
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  }),
  divider: (colors) => ({
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
    width: "80%",
    alignSelf: "center",
  }),
  aboutText: (colors) => ({
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    textAlign: "justify",
  }),
});
