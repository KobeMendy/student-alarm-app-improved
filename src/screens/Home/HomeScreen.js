import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [reminders, setReminders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReminders = async () => {
      const stored = await AsyncStorage.getItem("reminders");
      const parsed = stored ? JSON.parse(stored) : [];
      const sorted = parsed.sort((a, b) => new Date(a.date) - new Date(b.date));
      const upcoming = sorted.length <= 3 ? sorted : sorted.slice(0, 3);
      setReminders(upcoming);
    };
    fetchReminders();
  }, []);

  const renderReminder = ({ item }) => (
    <View style={styles.reminderCard}>
      <MaterialCommunityIcons
        name="bell-ring-outline"
        size={22}
        color="#1e3a8a"
        style={{ marginRight: 10 }}
      />
      <View>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderDate}>
          {item.category} • {new Date(item.date).toDateString()}
        </Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 50 }}>
      {/* Greeting */}
      <Text style={styles.greeting}>Hello, Student 👋</Text>
      {/* Quick Actions Title */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("AddReminder")}
        >
          <Ionicons name="add-circle-outline" size={30} color="#4338ca" />
          <Text style={styles.actionText}>New Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("Upload")}
        >
          <Ionicons name="cloud-upload-outline" size={30} color="#4338ca" />
          <Text style={styles.actionText}>Upload Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("Calendar")}
        >
          <Ionicons name="calendar-outline" size={30} color="#4338ca" />
          <Text style={styles.actionText}>My Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("MyFinances")}
        >
          <Ionicons name="wallet-outline" size={30} color="#4338ca" />
          <Text style={styles.actionText}>My Finances</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Title */}
      <Text style={styles.sectionTitle}>Upcoming Reminders</Text>

      {reminders.length === 0 && (
        <Text style={styles.empty}>No upcoming reminders yet.</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 40 }}
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderReminder}
        ListFooterComponent={
          reminders.length > 0 ? (
            <View style={{ paddingHorizontal: 20 }}>
              <TouchableOpacity
                style={styles.viewAll}
                onPress={() => navigation.navigate("Reminders")}
              >
                <Text style={styles.viewAllText}>View All Reminders</Text>
                <Ionicons name="chevron-forward" size={20} color="#1e40af" />
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 30,
  },
  actionCard: {
    alignItems: "center",
    width: "47%",
    paddingVertical: 14,
    backgroundColor: "#eef2ff",
    borderRadius: 10,
    marginBottom: 10,
  },
  actionText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#1e3a8a",
    textAlign: "center",
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  reminderDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  viewAll: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  viewAllText: {
    color: "#1e40af",
    fontSize: 14,
    marginRight: 6,
    fontWeight: "600",
  },
  empty: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },
});
