import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function AllRemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) fetchReminders();
  }, [isFocused]);

  const fetchReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem("reminders");
      const parsed = stored ? JSON.parse(stored) : [];
      setReminders(parsed);
    } catch (err) {
      console.error("Error loading reminders", err);
    }
  };

  const toggleComplete = async (id) => {
    const updated = reminders.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setReminders(updated);
    await AsyncStorage.setItem("reminders", JSON.stringify(updated));
  };

  const deleteReminder = async (id) => {
    Alert.alert("Delete Reminder", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = reminders.filter((item) => item.id !== id);
          setReminders(updated);
          await AsyncStorage.setItem("reminders", JSON.stringify(updated));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <TouchableOpacity onPress={() => toggleComplete(item.id)}>
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.completed ? "green" : "#999"}
        />
      </TouchableOpacity>
      <View style={styles.reminderText}>
        <Text style={[styles.title, item.completed && styles.completed]}>
          {item.title}
        </Text>
        <Text style={styles.subtitle}>
          {item.category} • {new Date(item.date).toDateString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteReminder(item.id)}
        style={{ marginLeft: "auto" }}
      >
        <Ionicons name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Reminders</Text>
      {reminders.length === 0 ? (
        <Text style={styles.empty}>
          No reminders yet. Add one to get started.
        </Text>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  reminderText: {
    marginLeft: 12,
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  empty: {
    marginTop: 50,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 16,
  },
});
