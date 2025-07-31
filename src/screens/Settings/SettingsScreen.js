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
import { useTheme } from "../../context/ThemeContext";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  const [dailyQuotesEnabled, setDailyQuotesEnabled] = useState(true);
  const [dailyRemindersEnabled, setDailyRemindersEnabled] = useState(true);
  const [threeDayAlarmsEnabled, setThreeDayAlarmsEnabled] = useState(true);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

  const toggleDailyQuotes = () => setDailyQuotesEnabled((prev) => !prev);
  const toggleDailyReminders = () => setDailyRemindersEnabled((prev) => !prev);
  const toggleThreeDayAlarms = () => setThreeDayAlarmsEnabled((prev) => !prev);

  const handleResetAndLogout = async () => {
    try {
      await AsyncStorage.removeItem("onboardingData");
      await AsyncStorage.removeItem("reminders");
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

  const colors = {
    background: theme === "light" ? "#f5f5f5" : "#1a1a1a",
    cardBackground: theme === "light" ? "#fff" : "#2a2a2a",
    text: theme === "light" ? "#333" : "#f5f5f5",
    subText: theme === "light" ? "#666" : "#ccc",
    border: theme === "light" ? "#eee" : "#444",
  };

  return (
    <SafeAreaView style={styles.safeArea(colors)}>
      <View style={styles.header(colors)}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle(colors)}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollViewContent(colors)}>
        <Text style={styles.sectionTitle(colors)}>General</Text>
        <SettingsOptionRow
          label="Profile"
          showChevron={true}
          onPress={() => navigation.navigate("Profile")}
        />
        <SettingsOptionRow
          label="Dark Mode"
          isSwitch={true}
          switchValue={theme === "dark"}
          onToggleSwitch={toggleTheme}
        />
        <SettingsOptionRow
          label="Daily Motivational Quotes"
          isSwitch={true}
          switchValue={dailyQuotesEnabled}
          onToggleSwitch={toggleDailyQuotes}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.buttonText}>Change School/Semester</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle(colors)}>Notifications</Text>
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

        <Text style={styles.sectionTitle(colors)}>Data Management</Text>
        <SettingsOptionRow
          label="Replace Academic Calendar"
          showChevron={true}
          onPress={() => navigation.navigate("ReplaceCalendar")}
        />
        <SettingsOptionRow
          label="Export My Data"
          showChevron={true}
          onPress={() => navigation.navigate("ExportData")}
        />

        <Text style={styles.sectionTitle(colors)}>About This App/Help</Text>
        <SettingsOptionRow
          label="About"
          showChevron={true}
          onPress={() => navigation.navigate("About")}
        />
        <SettingsOptionRow
          label="Help & Support"
          showChevron={true}
          onPress={() => {
            navigation.navigate("HelpSupport");
          }}
        />
        <SettingsOptionRow
          label="Privacy Policy"
          showChevron={true}
          onPress={() => {
            navigation.navigate("PrivacyPolicy");
          }}
        />

        <View style={styles.resetLogoutSection}>
          <TouchableOpacity
            style={styles.resetLogoutButton}
            onPress={() => setIsResetModalVisible(true)}
          >
            <Text style={styles.resetLogoutButtonText}>Reset And Logout</Text>
          </TouchableOpacity>
          <Text style={styles.resetLogoutWarningText(colors)}>
            You will lose your current data when you perform this action. Be
            cautious ⛔.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
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

const styles = StyleSheet.create({
  safeArea: (colors) => ({
    flex: 1,
    backgroundColor: colors.background,
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
  backButtonIcon: {
    marginTop: 24,
  },
  headerTitle: (colors) => ({
    fontSize: 20,
    fontWeight: "600",
    paddingTop: 15,
    color: colors.text,
  }),
  headerPlaceholder: {
    width: 24,
  },
  scrollViewContent: (colors) => ({
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  }),
  sectionTitle: (colors) => ({
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
    color: colors.text,
  }),
  button: {
    backgroundColor: "#f97316",
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
    color: "#fff",
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
    backgroundColor: "#ef4444",
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resetLogoutWarningText: (colors) => ({
    fontSize: 12,
    color: colors.subText,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  }),
});
