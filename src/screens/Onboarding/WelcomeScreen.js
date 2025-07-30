import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For the icons

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="book-multiple" size={60} color="#fff" />
        </View>

        <Text style={styles.title}>Welcome to StudyReminder</Text>

        <Text style={styles.subtitle}>
          Your personal academic assistant for managing reminders, deadlines,
          and finances
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color="#667eea"
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Smart Reminders</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={24}
              color="#667eea"
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Calendar Integration</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="currency-usd"
              size={24}
              color="#667eea"
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Finance Tracking</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("SchoolSemester")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f4f8", // Light blue-gray background
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30, // Horizontal padding for content
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#667eea", // Blue color for the circle
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40, // Space below the icon
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // Android shadow
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40, // Space before feature list
  },
  featureList: {
    width: "100%",
    maxWidth: 300, // Max width for the feature list
    marginBottom: 50, // Space before the button
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // Space between feature items
  },
  featureIcon: {
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#667eea", // Blue button color
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30, // More rounded corners for the button
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // Android shadow
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
