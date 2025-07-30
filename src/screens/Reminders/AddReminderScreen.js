// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   Alert,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   scheduleReminderNotifications,
//   cancelReminderNotifications,
// } from "../../utils/notificationService";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation, useRoute } from "@react-navigation/native";

// export default function AddReminderScreen({ navigation }) {
//   const route = useRoute();
//   const existingReminder = route.params?.reminder;

//   const [title, setTitle] = useState(
//     existingReminder ? existingReminder.title : ""
//   );
//   const [category, setCategory] = useState(
//     existingReminder ? existingReminder.category : ""
//   );
//   const [selectedDate, setSelectedDate] = useState(
//     existingReminder ? new Date(existingReminder.date) : new Date()
//   );
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedTime, setSelectedTime] = useState(
//     existingReminder ? new Date(existingReminder.date) : new Date()
//   );
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   useEffect(() => {
//     if (existingReminder) {
//       setTitle(existingReminder.title);
//       setCategory(existingReminder.category);
//       setSelectedDate(new Date(existingReminder.date));
//       setSelectedTime(new Date(existingReminder.date));
//       navigation.setOptions({ title: "Edit Reminder" });
//     } else {
//       setTitle("");
//       setCategory("");
//       setSelectedDate(new Date());
//       setSelectedTime(new Date());
//       navigation.setOptions({ title: "Add New Reminder" });
//     }
//   }, [existingReminder, navigation]);

//   const saveReminder = async () => {
//     if (!title.trim() || !category.trim()) {
//       Alert.alert("Error", "Please enter a title and category.");
//       return;
//     }

//     if (category === "") {
//       Alert.alert("Error", "Please select a valid category.");
//       return;
//     }

//     const fullDateTime = new Date(
//       selectedDate.getFullYear(),
//       selectedDate.getMonth(),
//       selectedDate.getDate(),
//       selectedTime.getHours(),
//       selectedTime.getMinutes()
//     );

//     let updatedReminder = {
//       id: existingReminder ? existingReminder.id : Date.now().toString(),
//       title,
//       category,
//       date: fullDateTime.toISOString(),
//       completed: existingReminder ? existingReminder.completed : false,
//     };

//     if (
//       existingReminder &&
//       existingReminder.notificationIds &&
//       existingReminder.notificationIds.length > 0
//     ) {
//       await cancelReminderNotifications(existingReminder.notificationIds);
//     }

//     const notificationIds = await scheduleReminderNotifications(
//       updatedReminder
//     );
//     updatedReminder.notificationIds = notificationIds;

//     try {
//       const existing = await AsyncStorage.getItem("reminders");
//       let parsed = existing ? JSON.parse(existing) : [];

//       if (existingReminder) {
//         parsed = parsed.map((item) =>
//           item.id === updatedReminder.id ? updatedReminder : item
//         );
//       } else {
//         parsed.push(updatedReminder);
//       }

//       await AsyncStorage.setItem("reminders", JSON.stringify(parsed));
//       navigation.navigate("Reminders");
//     } catch (err) {
//       console.error("Failed to save/update reminder:", err);
//       Alert.alert("Error", "Failed to save reminder.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Reminder Title</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="e.g. Pay tuition fee"
//         value={title}
//         onChangeText={setTitle}
//       />

//       <Text style={styles.label}>Category</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={category}
//           onValueChange={(itemValue) => setCategory(itemValue)}
//         >
//           <Picker.Item
//             label="Select a Category"
//             value=""
//             enabled={category === ""}
//           />
//           <Picker.Item label="Fees" value="Fees" />
//           <Picker.Item label="Exam" value="Exam" />
//           <Picker.Item label="Registration" value="Registration" />
//         </Picker>
//       </View>
//       <Text style={styles.label}>Due Date</Text>
//       <TouchableOpacity
//         style={styles.datePicker}
//         onPress={() => setShowDatePicker(true)}
//       >
//         <Text style={styles.pickerText}>
//           Select Date: {selectedDate.toDateString()}
//         </Text>
//       </TouchableOpacity>
//       {showDatePicker && (
//         <DateTimePicker
//           value={selectedDate}
//           mode="date"
//           display="default"
//           onChange={(event, date) => {
//             setShowDatePicker(false);
//             if (date) setSelectedDate(date);
//           }}
//         />
//       )}

//       <TouchableOpacity
//         style={styles.datePicker}
//         onPress={() => setShowTimePicker(true)}
//       >
//         <Text style={styles.pickerText}>
//           Select Time:{" "}
//           {selectedTime.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </Text>
//       </TouchableOpacity>
//       {showTimePicker && (
//         <DateTimePicker
//           value={selectedTime}
//           mode="time"
//           display="default"
//           onChange={(event, time) => {
//             setShowTimePicker(false);
//             if (time) setSelectedTime(time);
//           }}
//         />
//       )}

//       <TouchableOpacity style={styles.button} onPress={saveReminder}>
//         <Text style={styles.buttonText}>Save Reminder</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   label: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
//   input: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: "#f9fafb",
//     marginTop: 8,
//   },
//   dateButton: {
//     padding: 12,
//     backgroundColor: "#f3f4f6",
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   dateText: { fontSize: 16 },
//   button: {
//     backgroundColor: "#4f46e5",
//     marginTop: 30,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   datePicker: {
//     backgroundColor: "#f3f4f6",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   pickerText: {
//     fontSize: 14,
//     color: "#111827",
//   },

//   buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
//   pickerContainer: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     marginTop: 8,
//     backgroundColor: "#f9fafb",
//     overflow: "hidden",
//     justifyContent: "center",
//     minHeight: 50,
//   },
// });
import "react-native-get-random-values";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import {
  scheduleReminderNotifications,
  cancelReminderNotifications,
} from "../../utils/notificationService";
import {
  useNavigation,
  useRoute,
  StackActions,
} from "@react-navigation/native";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Flag,
  Save,
  Lightbulb,
} from "lucide-react-native";

export default function AddReminderScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const existingReminder = route.params?.reminder;

  const currentReminderId = useRef(
    existingReminder ? existingReminder.id : uuidv4()
  );

  const reminderTypes = [
    { key: "fees", label: "Fees", icon: "💰" },
    { key: "registration", label: "Registration", icon: "✍️" },
    { key: "others", label: "Others", icon: "💡" },
  ];

  const priorities = [
    { key: "low", label: "Low", color: "#10b981" },
    { key: "medium", label: "Medium", color: "#f59e0b" },
    { key: "high", label: "High", color: "#ef4444" },
  ];

  const [formData, setFormData] = useState({
    id: currentReminderId.current,
    title: existingReminder ? existingReminder.title : "",
    description: existingReminder ? existingReminder.description || "" : "",
    type: existingReminder ? existingReminder.type || "others" : "others",
    priority: existingReminder
      ? existingReminder.priority || "medium"
      : "medium",
    date: existingReminder ? new Date(existingReminder.date) : new Date(),
    completed: existingReminder ? existingReminder.completed : false,
    notificationIds: existingReminder ? existingReminder.notificationIds : [],
    isSpecial: existingReminder ? existingReminder.isSpecial || false : false,
    startDate:
      existingReminder && existingReminder.startDate
        ? new Date(existingReminder.startDate)
        : null,
    endDate:
      existingReminder && existingReminder.endDate
        ? new Date(existingReminder.endDate)
        : null,
    canDelete: existingReminder ? existingReminder.canDelete || true : true,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (existingReminder) {
      navigation.setOptions({ title: "Edit Reminder" });
    } else {
      navigation.setOptions({ title: "Add New Reminder" });
    }
  }, [existingReminder, navigation]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => {
        const newDateTime = new Date(selectedDate);
        newDateTime.setHours(prev.date.getHours());
        newDateTime.setMinutes(prev.date.getMinutes());
        return { ...prev, date: newDateTime };
      });
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData((prev) => {
        const newDateTime = new Date(prev.date);
        newDateTime.setHours(selectedTime.getHours());
        newDateTime.setMinutes(selectedTime.getMinutes());
        return { ...prev, date: newDateTime };
      });
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, startDate: selectedDate }));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, endDate: selectedDate }));
    }
  };

  const saveReminder = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a reminder title.");
      return;
    }
    if (!formData.date) {
      Alert.alert("Error", "Please select a due date and time.");
      return;
    }

    let reminderToSave = {
      ...formData,
      date: formData.date.toISOString(),
      startDate: formData.startDate ? formData.startDate.toISOString() : null,
      endDate: formData.endDate ? formData.endDate.toISOString() : null,
    };

    if (
      existingReminder &&
      existingReminder.notificationIds &&
      existingReminder.notificationIds.length > 0
    ) {
      await cancelReminderNotifications(existingReminder.notificationIds);
    }

    const notificationIds = await scheduleReminderNotifications(reminderToSave);
    reminderToSave.notificationIds = notificationIds;

    try {
      const existing = await AsyncStorage.getItem("reminders");
      let parsed = existing ? JSON.parse(existing) : [];

      if (existingReminder) {
        parsed = parsed.map((item) =>
          item.id === reminderToSave.id ? reminderToSave : item
        );
      } else {
        const index = parsed.findIndex((item) => item.id === reminderToSave.id);
        if (index !== -1) {
          parsed[index] = reminderToSave;
        } else {
          parsed.push(reminderToSave);
        }
      }

      await AsyncStorage.setItem("reminders", JSON.stringify(parsed));
      // Use StackActions.replace to replace the current screen with "Reminders"
      navigation.dispatch(StackActions.replace("Reminders"));
    } catch (err) {
      console.error("Failed to save/update reminder:", err);
      Alert.alert("Error", "Failed to save reminder.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {existingReminder ? "Edit Reminder" : "Add New Reminder"}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
          <Save size={20} color="#667eea" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reminder title"
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add additional details..."
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.typeGrid}>
            {reminderTypes.map((typeOption) => (
              <TouchableOpacity
                key={typeOption.key}
                style={[
                  styles.typeCard,
                  formData.type === typeOption.key && styles.typeCardActive,
                ]}
                onPress={() => handleInputChange("type", typeOption.key)}
              >
                {typeOption.key === "others" ? (
                  <Lightbulb size={24} color="#333" style={styles.typeIcon} />
                ) : (
                  <Text style={styles.typeIcon}>{typeOption.icon}</Text>
                )}
                <Text
                  style={[
                    styles.typeLabel,
                    formData.type === typeOption.key && styles.typeLabelActive,
                  ]}
                >
                  {typeOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Due Date & Time</Text>

          {formData.isSpecial ? (
            <>
              <View style={styles.dateTimeRow}>
                <View style={styles.dateTimeItem}>
                  <Text style={styles.label}>Start Date</Text>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Calendar size={16} color="#667eea" />
                    <Text style={styles.dateTimeText}>
                      {formData.startDate
                        ? formData.startDate.toLocaleDateString()
                        : "Select start date"}
                    </Text>
                  </TouchableOpacity>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={formData.startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onStartDateChange}
                    />
                  )}
                </View>
                <View style={styles.dateTimeItem}>
                  <Text style={styles.label}>End Date</Text>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Calendar size={16} color="#667eea" />
                    <Text style={styles.dateTimeText}>
                      {formData.endDate
                        ? formData.endDate.toLocaleDateString()
                        : "Select end date"}
                    </Text>
                  </TouchableOpacity>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={formData.endDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onEndDateChange}
                    />
                  )}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.label}>Date *</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={16} color="#667eea" />
                  <Text style={styles.dateTimeText}>
                    {formData.date
                      ? formData.date.toLocaleDateString()
                      : "Select date"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </View>

              <View style={styles.dateTimeItem}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock size={16} color="#667eea" />
                  <Text style={styles.dateTimeText}>
                    {formData.date
                      ? formData.date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select time"}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={formData.date}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                  />
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority</Text>
          <View style={styles.priorityRow}>
            {priorities.map((priorityOption) => (
              <TouchableOpacity
                key={priorityOption.key}
                style={[
                  styles.priorityButton,
                  formData.priority === priorityOption.key &&
                    styles.priorityButtonActive,
                  { borderColor: priorityOption.color },
                ]}
                onPress={() =>
                  handleInputChange("priority", priorityOption.key)
                }
              >
                <Flag size={16} color={priorityOption.color} />
                <Text
                  style={[
                    styles.priorityText,
                    formData.priority === priorityOption.key && {
                      color: priorityOption.color,
                    },
                  ]}
                >
                  {priorityOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton} onPress={saveReminder}>
          <Text style={styles.createButtonText}>
            {existingReminder ? "Update Reminder" : "Create Reminder"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
    color: "#333",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
    justifyContent: "space-between",
  },
  typeCard: {
    width: "31%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: "1%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
  },
  typeCardActive: {
    borderColor: "#667eea",
    backgroundColor: "#f0f4ff",
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  typeLabelActive: {
    color: "#667eea",
  },
  dateTimeRow: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginBottom: 16,
  },
  dateTimeItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  priorityRow: {
    flexDirection: "row",
    marginHorizontal: -5,
  },
  priorityButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 5,
  },
  priorityButtonActive: {
    backgroundColor: "#e6e8fa",
    borderColor: "#667eea",
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginLeft: 6,
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  createButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
