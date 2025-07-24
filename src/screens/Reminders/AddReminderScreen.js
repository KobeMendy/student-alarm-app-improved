import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleReminderNotifications } from "../../utils/notificationService";
import { useNavigation } from "@react-navigation/native";

export default function AddReminderScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  // const [date, setDate] = useState(new Date());
  // const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const saveReminder = async () => {
    if (!title.trim() || !category.trim()) {
      Alert.alert("Error", "Please enter a title and category.");
      return;
    }

    const fullDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    const newReminder = {
      id: Date.now().toString(),
      title,
      category,
      date: fullDateTime.toISOString(),
      completed: false,
    };

    const notificationIds = await scheduleReminderNotifications(newReminder);
    newReminder.notificationIds = notificationIds;

    try {
      const existing = await AsyncStorage.getItem("reminders");
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(newReminder);
      await AsyncStorage.setItem("reminders", JSON.stringify(parsed));
      navigation.navigate("Reminders");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Reminder Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Pay tuition fee"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Fees, Exam, Registration"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Due Date</Text>
      {/* Select Date */}
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.pickerText}>
          Select Date: {selectedDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* Select Time */}
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.pickerText}>
          Select Time:{" "}
          {selectedTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) setSelectedTime(time);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={saveReminder}>
        <Text style={styles.buttonText}>Save Reminder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    marginTop: 8,
  },
  dateButton: {
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginTop: 8,
  },
  dateText: { fontSize: 16 },
  button: {
    backgroundColor: "#4f46e5",
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  datePicker: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerText: {
    fontSize: 14,
    color: "#111827",
  },

  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
