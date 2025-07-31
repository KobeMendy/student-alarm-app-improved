import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import WelcomeScreen from "../screens/Onboarding/WelcomeScreen";
import SchoolSemesterScreen from "../screens/Onboarding/SchoolSemesterScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import AddReminderScreen from "../screens/Reminders/AddReminderScreen";
import CalendarView from "../screens/Calendar/CalendarView";
import UploadCalendar from "../screens/Upload/UploadCalendar";
import MyFinances from "../screens/Finances/FinanceScreen";
import AddObligation from "../screens/Finances/AddObligationScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import AllRemindersScreen from "../screens/Reminders/AllRemindersScreen";
import ProfileScreen from "../screens/Settings/ProfileScreen";
import ReplaceCalendarScreen from "../screens/Settings/ReplaceCalendarScreen";
import ExportDataScreen from "../screens/DataManagement/ExportDataScreen";
import AboutScreen from "../screens/About/AboutScreen";
import HelpSupportScreen from "../screens/About/HelpSupportScreen";
import PrivacyPolicyScreen from "../screens/About/PrivacyPolicyScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;
          switch (route.name) {
            case "Home":
              icon = "home-outline";
              break;
            case "Calendar":
              icon = "calendar-outline";
              break;
            case "Upload":
              icon = "cloud-upload-outline";
              break;
            case "Settings":
              icon = "settings-outline";
              break;
            default:
              icon = "apps-outline";
          }
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarView} />
      <Tab.Screen name="Upload" component={UploadCalendar} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root Navigation
export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingData = await AsyncStorage.getItem("onboardingData");
        if (onboardingData !== null) {
          setInitialRoute("Main");
        } else {
          setInitialRoute("Welcome");
        }
      } catch (error) {
        console.error(
          "Failed to load onboarding data from AsyncStorage",
          error
        );
        setInitialRoute("Welcome");
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SchoolSemester"
        component={SchoolSemesterScreen}
        options={{ title: "Setup Profile" }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reminders"
        component={AllRemindersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddReminder"
        component={AddReminderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MyFinances" component={MyFinances} />
      <Stack.Screen name="AddObligation" component={AddObligation} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReplaceCalendar"
        component={ReplaceCalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen // NEW: Add ExportDataScreen to the root stack
        name="ExportData"
        component={ExportDataScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen // NEW: Add AboutScreen to the root stack
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen // NEW: Add AboutScreen to the root stack
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen // NEW: Add Privacy to the root stack
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
