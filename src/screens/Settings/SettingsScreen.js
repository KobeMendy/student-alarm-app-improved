import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.subtitle}>Student</Text>
        </View>
      </View>

      {/* Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.sectionItem}>
        <Ionicons name="person-outline" size={24} color="#4f46e5" />
        <View style={styles.itemTextBox}>
          <Text style={styles.itemTitle}>Profile</Text>
          <Text style={styles.itemSubtitle}>Edit personal info</Text>
        </View>
      </View>
      <View style={styles.sectionItem}>
        <MaterialIcons name="security" size={24} color="#4f46e5" />
        <View style={styles.itemTextBox}>
          <Text style={styles.itemTitle}>Privacy & Security</Text>
          <Text style={styles.itemSubtitle}>Manage your data settings</Text>
        </View>
      </View>

      {/* Preferences Section */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.switchRow}>
        <Feather name="bell" size={22} color="#4f46e5" />
        <Text style={styles.switchLabel}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>
      <View style={styles.switchRow}>
        <Ionicons name="moon-outline" size={22} color="#4f46e5" />
        <Text style={styles.switchLabel}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
      <View style={styles.sectionItem}>
        <Ionicons name="language-outline" size={24} color="#4f46e5" />
        <View style={styles.itemTextBox}>
          <Text style={styles.itemTitle}>Language</Text>
          <Text style={styles.itemSubtitle}>App language</Text>
        </View>
      </View>

      {/* App Section */}
      <Text style={styles.sectionTitle}>App</Text>
      <View style={styles.sectionItem}>
        <Feather name="info" size={24} color="#4f46e5" />
        <View style={styles.itemTextBox}>
          <Text style={styles.itemTitle}>App Version</Text>
          <Text style={styles.itemSubtitle}>v1.0.0</Text>
        </View>
      </View>
      <View style={styles.sectionItem}>
        <FontAwesome name="support" size={24} color="#4f46e5" />
        <View style={styles.itemTextBox}>
          <Text style={styles.itemTitle}>Help & Support</Text>
          <Text style={styles.itemSubtitle}>FAQs and contact support</Text>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        onPress={() => alert("Signed out (mock)")}
        style={styles.signOutBtn}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    // marginTop: 10
  },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: "#4f46e5",
    borderRadius: 40,
    height: 54,
    width: 54,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileDetails: {
    marginLeft: 15,
    marginTop: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemTextBox: {
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  switchLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  signOutBtn: {
    backgroundColor: "#ef4444",
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    // paddingBottom: 400
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
