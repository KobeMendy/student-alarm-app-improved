import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function ReplaceCalendarScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const colors = {
    background: theme === "light" ? "#f5f5f5" : "#1a1a1a",
    cardBackground: theme === "light" ? "#fff" : "#2a2a2a",
    text: theme === "light" ? "#333" : "#f5f5f5",
    subText: theme === "light" ? "#666" : "#ccc",
    border: theme === "light" ? "#eee" : "#444",
    primary: "#667eea",
    headerIcon: theme === "light" ? "#333" : "#f5f5f5",
  };

  const reasons = [
    {
      title: "New Academic Year/Semester",
      description:
        "As a new academic year or semester begins, your old calendar becomes outdated. Replacing it ensures you have the most current schedule, including new courses, holidays, and deadlines.",
    },
    {
      title: "Schedule Changes or Updates",
      description:
        "Universities often make adjustments to academic calendars. Uploading a new version ensures your personal schedule reflects any changes in exam dates, lecture times, or event cancellations.",
    },
    {
      title: "Correcting Errors",
      description:
        "If you initially uploaded an incorrect or incomplete calendar, replacing it allows you to rectify those errors and maintain an accurate, reliable schedule.",
    },
    {
      title: "Switching Programs or Courses",
      description:
        "Changing your academic program or course load might require a completely different calendar. Replacing the old one helps you seamlessly transition to your new academic path.",
    },
    {
      title: "Improved Calendar Format",
      description:
        "You might have a new calendar file in a better format (e.g., a more detailed PDF or a more structured CSV). Replacing it can enhance the quality of data in your app.",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea(colors, Platform.OS)}>
      <View style={styles.header(colors)}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle(colors)}>
          Replace Academic Calendar
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle(colors)}>
          Why Replace Your Academic Calendar?
        </Text>

        {reasons.map((reason, index) => (
          <View key={index} style={styles.reasonCard(colors, theme)}>
            <Text style={styles.reasonTitle(colors)}>{reason.title}</Text>
            <Text style={styles.reasonDescription(colors)}>
              {reason.description}
            </Text>
          </View>
        ))}

        <View style={styles.uploadButtonContainer}>
          <TouchableOpacity
            style={styles.uploadButton(colors)}
            onPress={() => navigation.navigate("Main", { screen: "Upload" })}
          >
            <Text style={styles.uploadButtonText}>Go to Upload Screen</Text>
          </TouchableOpacity>
        </View>
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
  },
  sectionTitle: (colors) => ({
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  }),
  reasonCard: (colors, theme) => ({
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === "light" ? 0.1 : 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  }),
  reasonTitle: (colors) => ({
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  }),
  reasonDescription: (colors) => ({
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  }),
  uploadButtonContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  uploadButton: (colors) => ({
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  }),
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
