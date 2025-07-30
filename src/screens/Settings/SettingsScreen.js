import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SettingsOptionRow from "../../components/SettingsOptionRow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  const [dailyQuotesEnabled, setDailyQuotesEnabled] = useState(true);
  const [dailyRemindersEnabled, setDailyRemindersEnabled] = useState(true);
  const [threeDayAlarmsEnabled, setThreeDayAlarmsEnabled] = useState(true);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

  // Dark mode is now controlled by the context, so no local state `darkMode` is needed here.
  // The `toggleDarkMode` function will directly use the `toggleTheme` from context.

  const toggleDailyQuotes = () => setDailyQuotesEnabled((prev) => !prev);
  const toggleDailyReminders = () => setDailyRemindersEnabled((prev) => !prev);
  const toggleThreeDayAlarms = () => setThreeDayAlarmsEnabled((prev) => !prev);

  const handleResetAndLogout = async () => {
    try {
      await AsyncStorage.removeItem("onboardingData");
      await AsyncStorage.removeItem("reminders");
      // Optionally, clear the saved theme as well if you want a fresh start
      await AsyncStorage.removeItem("appTheme");
      console.log("All relevant data cleared from AsyncStorage.");

      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      console.error("Failed to clear data or reset navigation:", error);
      Alert.alert(
        "Error",
        "Could not perform reset and logout. Please try again."
      );
    }
  };

  // Define colors based on the current theme
  const colors = {
    background: theme === "light" ? "#f5f5f5" : "#1a1a1a",
    cardBackground: theme === "light" ? "#fff" : "#2a2a2a",
    text: theme === "light" ? "#333" : "#f5f5f5",
    subText: theme === "light" ? "#666" : "#ccc",
    border: theme === "light" ? "#eee" : "#444",
  };

  const dynamicStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
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
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
      paddingTop: 15,
      color: colors.text,
    },
    scrollViewContent: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: colors.background, // Ensure scroll view background matches safe area
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 15,
      color: colors.text,
    },
    button: {
      backgroundColor: "#f97316", // This button's color remains fixed
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
      shadowColor: "#f97316",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    buttonText: {
      color: "#fff", // This text color remains fixed
      fontSize: 16,
      fontWeight: "600",
    },
    bottomSpacer: {
      height: 50,
    },
    resetLogoutSection: {
      marginTop: 30,
      alignItems: "center",
      marginBottom: 20,
    },
    resetLogoutButton: {
      backgroundColor: "#ef4444", // This button's color remains fixed
      paddingVertical: 14,
      paddingHorizontal: 30,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    resetLogoutButtonText: {
      color: "white", // This text color remains fixed
      fontSize: 16,
      fontWeight: "bold",
    },
    resetLogoutWarningText: {
      fontSize: 12,
      color: colors.subText, // This text color adapts
      textAlign: "center",
      marginTop: 10,
      paddingHorizontal: 20,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text} // Icon color adapts
            style={{ marginTop: 24 }}
          />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={dynamicStyles.scrollViewContent}>
        <Text style={dynamicStyles.sectionTitle}>General</Text>
        <SettingsOptionRow
          label="Profile"
          showChevron={true}
          onPress={() => navigation.navigate("Profile")}
        />
        <SettingsOptionRow
          label="Dark Mode"
          isSwitch={true}
          switchValue={theme === "dark"} // Use theme from context
          onToggleSwitch={toggleTheme} // Use toggleTheme from context
        />
        <SettingsOptionRow
          label="Daily Motivational Quotes"
          isSwitch={true}
          switchValue={dailyQuotesEnabled}
          onToggleSwitch={toggleDailyQuotes}
        />

        <TouchableOpacity
          style={dynamicStyles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={dynamicStyles.buttonText}>Change School/Semester</Text>
        </TouchableOpacity>

        <Text style={dynamicStyles.sectionTitle}>Notifications</Text>
        <SettingsOptionRow
          label="Enable Daily Reminders"
          isSwitch={true}
          switchValue={dailyRemindersEnabled}
          onToggleSwitch={toggleDailyReminders}
        />
        <SettingsOptionRow
          label="Enable 3-Day-Before Alarms"
          isSwitch={true}
          switchValue={threeDayAlarmsEnabled}
          onToggleSwitch={toggleThreeDayAlarms}
        />
        <SettingsOptionRow
          label="Snooze Duration"
          rightText="5 min"
          showChevron={true}
          onPress={() => {}}
        />

        <Text style={dynamicStyles.sectionTitle}>Data Management</Text>
        <SettingsOptionRow
          label="Replace Academic Calendar"
          showChevron={true}
          onPress={() => {}}
        />
        <SettingsOptionRow
          label="Export My Data"
          showChevron={true}
          onPress={() => {}}
        />

        <Text style={dynamicStyles.sectionTitle}>About This App/Help</Text>
        <SettingsOptionRow
          label="About"
          showChevron={true}
          onPress={() => {}}
        />
        <SettingsOptionRow
          label="Help & Support"
          showChevron={true}
          onPress={() => {}}
        />
        <SettingsOptionRow
          label="Privacy Policy"
          showChevron={true}
          onPress={() => {}}
        />

        <View style={dynamicStyles.resetLogoutSection}>
          <TouchableOpacity
            style={dynamicStyles.resetLogoutButton}
            onPress={() => setIsResetModalVisible(true)}
          >
            <Text style={dynamicStyles.resetLogoutButtonText}>
              Reset And Logout
            </Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.resetLogoutWarningText}>
            You will lose your current data when you perform this action. Be
            cautious ⛔.
          </Text>
        </View>

        <View style={dynamicStyles.bottomSpacer} />
      </ScrollView>

      <ConfirmationModal
        isVisible={isResetModalVisible}
        title="Are You Sure?"
        message="This action will clear all your saved data and log you out. You will need to go through the whole login process again. 😖"
        onConfirm={() => {
          setIsResetModalVisible(false);
          handleResetAndLogout();
        }}
        onCancel={() => setIsResetModalVisible(false)}
      />
    </SafeAreaView>
  );
}

// Original static styles (now merged with dynamicStyles)
const staticStyles = StyleSheet.create({
  // These are styles that do NOT change with theme
  // (e.g., specific button colors, fixed sizes, etc.)
  // They are combined with dynamicStyles using array spreading in the component
});
