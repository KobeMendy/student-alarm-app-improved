import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform, // For platform-specific padding
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Removed useSafeAreaInsets import as it was not present in your provided code
// If you still need status bar padding, you'll need to add useSafeAreaInsets and adjust header style inline.
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
} from "lucide-react-native"; // Lucide icons for calendar navigation and upload

export default function CalendarView() {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date
  const [reminders, setReminders] = useState([]); // Our actual reminder data

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Function to get all reminders from AsyncStorage
  const fetchReminders = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("reminders");
      const parsed = stored ? JSON.parse(stored) : [];
      setReminders(parsed);
    } catch (err) {
      console.error("Error loading reminders for calendar:", err);
    }
  }, []);

  // Fetch reminders when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [fetchReminders])
  );

  // Helper function to get days in a month for custom calendar grid
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Helper function to navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    // When month changes, reset selectedDate to the 1st of the new month or today if it's in the new month
    const today = new Date();
    if (
      newDate.getMonth() === today.getMonth() &&
      newDate.getFullYear() === today.getFullYear()
    ) {
      setSelectedDate(today);
    } else {
      setSelectedDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
  };

  // Helper function to get events (reminders) for a specific date
  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0];
    return reminders.filter((reminder) => {
      // Ensure reminder.date exists and is a valid date string
      if (!reminder.date) return false;
      return new Date(reminder.date).toISOString().split("T")[0] === dateString;
    });
  };

  // Helper function to check if a date is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Helper function to check if a date is the currently selected date
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Get events for the currently selected date
  const selectedDateEvents = getEventsForDate(selectedDate);

  // Helper to get color based on reminder priority for event dots
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#667eea"; // Default blue
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
        <Text style={styles.title}>Calendar</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate("Upload")} // Navigate to UploadCalendar.js
        >
          <Upload size={20} color="#667eea" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth(-1)}
          >
            <ChevronLeft size={24} color="#667eea" />
          </TouchableOpacity>

          <Text style={styles.monthYear}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth(1)}
          >
            <ChevronRight size={24} color="#667eea" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarGrid}>
          <View style={styles.weekHeader}>
            {dayNames.map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayEvents = getEventsForDate(date);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !date && styles.emptyDay,
                    isToday(date) && styles.today,
                    isSelected(date) && styles.selectedDay,
                  ]}
                  onPress={() => date && setSelectedDate(date)}
                  disabled={!date}
                >
                  {date && (
                    <>
                      <Text
                        style={[
                          styles.dayNumber,
                          isToday(date) && styles.todayText,
                          isSelected(date) && styles.selectedDayText,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                      {dayEvents.length > 0 && (
                        <View style={styles.eventIndicators}>
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <View
                              key={eventIndex}
                              style={[
                                styles.eventDot,
                                {
                                  backgroundColor: getPriorityColor(
                                    event.priority
                                  ),
                                }, // Use priority for dot color
                              ]}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <Text style={styles.moreEvents}>
                              +{dayEvents.length - 3}
                            </Text>
                          )}
                        </View>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>

          {selectedDateEvents.length > 0 ? (
            <View style={styles.eventsList}>
              <Text style={styles.eventsCountText}>
                You have {selectedDateEvents.length} event
                {selectedDateEvents.length !== 1 ? "s" : ""} scheduled for this
                day, add some more.
              </Text>
              {selectedDateEvents.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View
                    style={[
                      styles.eventColorBar,
                      { backgroundColor: getPriorityColor(event.priority) },
                    ]}
                  />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>
                      {new Date(event.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <Text style={styles.eventType}>
                      {event.type || event.subject || "N/A"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noEvents}>
              <Text style={styles.noEventsText}>
                No events scheduled for this day
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() =>
              navigation.navigate("AddReminder", {
                initialDate: selectedDate.toISOString(), // CHANGED: Pass date as initialDate
              })
            }
          >
            <Plus size={16} color="#667eea" />
            <Text style={styles.addEventText}>Add Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "android" && 0, // Android status bar padding
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30, // Adjusted from 60
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  uploadButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    marginBottom: 1,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  calendarGrid: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  weekHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 4,
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
    borderRightWidth: 1,
    borderRightColor: "#f8f9fa",
  },
  emptyDay: {
    backgroundColor: "#f8f9fa",
  },
  today: {
    backgroundColor: "#667eea",
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: "#f0f4ff",
    borderWidth: 2,
    borderColor: "#667eea",
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  todayText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "#667eea",
    fontWeight: "bold",
  },
  eventIndicators: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 1,
    marginVertical: 1,
  },
  moreEvents: {
    fontSize: 8,
    color: "#666",
    marginTop: 1,
  },
  selectedDateSection: {
    backgroundColor: "white",
    padding: 20,
    minHeight: 200,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  eventsCountText: {
    fontSize: 16,
    color: "#4f46e5",
    marginBottom: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  eventType: {
    fontSize: 12,
    color: "#999",
    textTransform: "capitalize",
  },
  noEvents: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noEventsText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  addEventButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center", // Center the button
    marginTop: 20, // Space above the button
  },
  addEventText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "500",
    marginLeft: 4,
  },
  // Removed FAB styles as it's no longer part of this screen's design
});
