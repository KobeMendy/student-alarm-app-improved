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
import { lightTheme, darkTheme } from "../../constants/theme";

export default function ReplaceCalendarScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

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

  const dynamicStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
      paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
      backgroundColor: currentTheme.colors.cardBackground,
      width: "100%",
      marginTop: 3,
      height: 90,
    },
    backButton: {
      paddingTop: 24, // Align with headerTitle
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      paddingTop: 24, // Align with backButton
      color: currentTheme.colors.text,
    },
    placeholder: {
      width: 24, // To balance the back button
      paddingTop: 24,
    },
    scrollViewContent: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: currentTheme.colors.text,
      marginBottom: 20,
      textAlign: "center",
    },
    reasonCard: {
      backgroundColor: currentTheme.colors.cardBackground,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      shadowColor: currentTheme.colors.text, // Adjust shadow color for theme
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "light" ? 0.1 : 0.3, // Adjust opacity for dark mode
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    reasonTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: currentTheme.colors.primary, // Use primary color for titles
      marginBottom: 8,
    },
    reasonDescription: {
      fontSize: 14,
      color: currentTheme.colors.text,
      lineHeight: 20,
    },
    uploadButtonContainer: {
      paddingTop: 20,
      paddingBottom: 40, // More space at the bottom
      alignItems: "center",
    },
    uploadButton: {
      backgroundColor: currentTheme.colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    uploadButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={dynamicStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentTheme.colors.headerIcon}
          />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Replace Academic Calendar</Text>
        <View style={dynamicStyles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={dynamicStyles.scrollViewContent}>
        <Text style={dynamicStyles.sectionTitle}>
          Why Replace Your Academic Calendar?
        </Text>

        {reasons.map((reason, index) => (
          <View key={index} style={dynamicStyles.reasonCard}>
            <Text style={dynamicStyles.reasonTitle}>{reason.title}</Text>
            <Text style={dynamicStyles.reasonDescription}>
              {reason.description}
            </Text>
          </View>
        ))}

        <View style={dynamicStyles.uploadButtonContainer}>
          <TouchableOpacity
            style={dynamicStyles.uploadButton}
            onPress={() => navigation.navigate("UploadTab")} // Navigate to UploadCalendar
          >
            <Text style={dynamicStyles.uploadButtonText}>
              Go to Upload Screen
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
