import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SchoolSemester"
        component={SchoolSemesterScreen}
        options={{ title: "Setup School Info" }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Reminders" component={AllRemindersScreen} />
      <Stack.Screen name="AddReminder" component={AddReminderScreen} />
      <Stack.Screen name="MyFinances" component={MyFinances} />
      <Stack.Screen name="AddObligation" component={AddObligation} />
    </Stack.Navigator>
  );
}
