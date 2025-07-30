import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  Modal,
  Platform,
  Animated, // Import Animated
  Easing, // Import Easing for smoother animation
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native"; // Import useRoute
import { cancelReminderNotifications } from "../../utils/notificationService";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  CircleAlert as AlertCircle,
  Edit,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AllRemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showPriorityFilterModal, setShowPriorityFilterModal] = useState(false);
  const [showSpecialReminderModal, setShowSpecialReminderModal] =
    useState(false);
  const [editingSpecialReminder, setEditingSpecialReminder] = useState(null);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPickerType, setCurrentPickerType] = useState(null);

  // State for highlighting reminders
  const [highlightedReminderId, setHighlightedReminderId] = useState(null);
  const highlightAnimation = useRef(new Animated.Value(0)).current; // 0 for normal, 1 for highlighted

  const filterButtonRef = useRef(null);
  const [filterButtonLayout, setFilterButtonLayout] = useState(null);

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute(); // Get route params

  // Ref for FlatList to enable scrolling to specific items
  const flatListRef = useRef(null);

  // Initial special reminders - subject property is still here for existing data
  const initialSpecialReminders = [
    {
      id: "special-course-reg",
      title: "Online Course Registration",
      subject: "Academic", // Keep for special reminders as they are predefined
      isSpecial: true,
      canDelete: false,
      priority: "high",
      date: new Date().toISOString(), // Default date for sorting
      startDate: null,
      endDate: null,
      completed: false,
      notificationIds: [],
    },
    {
      id: "special-biometric-reg",
      title: "Biometric Registration",
      subject: "Academic", // Keep for special reminders
      isSpecial: true,
      canDelete: false,
      priority: "high",
      date: new Date().toISOString(),
      startDate: null,
      endDate: null,
      completed: false,
      notificationIds: [],
    },
    {
      id: "special-mid-sem-exam-one",
      title: "Mid-semester Examination I",
      subject: "Academic", // Keep for special reminders
      isSpecial: true,
      canDelete: false,
      priority: "high",
      date: new Date().toISOString(),
      startDate: null,
      endDate: null,
      completed: false,
      notificationIds: [],
    },
    {
      id: "special-first-sem-exam",
      title: "First Semester Examination",
      subject: "Academic", // Keep for special reminders
      isSpecial: true,
      canDelete: false,
      priority: "high",
      date: new Date().toISOString(),
      startDate: null,
      endDate: null,
      completed: false,
      notificationIds: [],
    },
    {
      id: "special-mid-sem-exam-two",
      title: "Mid-semester Examination II",
      subject: "Academic", // Keep for special reminders
      isSpecial: true,
      canDelete: false,
      priority: "high",
      date: new Date().toISOString(),
      startDate: null,
      endDate: null,
      completed: false,
      notificationIds: [],
    },
    {
      id: "special-second-sem-exam",
      title: "Second Semester Examination",
      subject: "Academic", // Keep for special reminders
      isSpecial: true,
      canDelete: false,
      priority: "high",
      date: new Date().toISOString(),
      startDate: null,
      endDate: null,
      completed: false,
      notificationIds: [],
    },
  ];

  const fetchReminders = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("reminders");
      let parsed = stored ? JSON.parse(stored) : [];

      const mergedReminders = [...initialSpecialReminders];
      parsed.forEach((storedReminder) => {
        if (storedReminder.isSpecial) {
          const index = mergedReminders.findIndex(
            (sr) => sr.id === storedReminder.id
          );
          if (index !== -1) {
            mergedReminders[index] = {
              ...mergedReminders[index],
              ...storedReminder,
              startDate: storedReminder.startDate
                ? new Date(storedReminder.startDate)
                : null,
              endDate: storedReminder.endDate
                ? new Date(storedReminder.endDate)
                : null,
            };
          } else {
            mergedReminders.push({
              ...storedReminder,
              startDate: storedReminder.startDate
                ? new Date(storedReminder.startDate)
                : null,
              endDate: storedReminder.endDate
                ? new Date(storedReminder.endDate)
                : null,
            });
          }
        } else {
          mergedReminders.push(storedReminder);
        }
      });

      // Sort reminders: Special reminders with unset dates go to the bottom
      mergedReminders.sort((a, b) => {
        const aDatesNotSet = a.isSpecial && (!a.startDate || !a.endDate);
        const bDatesNotSet = b.isSpecial && (!b.startDate || !b.endDate);

        // If 'a' has dates not set and 'b' has dates set, 'a' goes to bottom
        if (aDatesNotSet && !bDatesNotSet) {
          return 1;
        }
        // If 'b' has dates not set and 'a' has dates set, 'b' goes to bottom
        if (!aDatesNotSet && bDatesNotSet) {
          return -1;
        }

        // If both are special with dates not set, or both have dates set, or both are regular,
        // then sort by their primary date (earliest first)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      setReminders(mergedReminders);
    } catch (err) {
      console.error("Error loading reminders", err);
      setReminders(initialSpecialReminders);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchReminders();
      // Check for highlightId when screen focuses
      const { highlightId } = route.params || {};
      if (highlightId) {
        setHighlightedReminderId(highlightId);
        // Reset params so it doesn't highlight every time
        navigation.setParams({ highlightId: undefined });
      }
    }
  }, [isFocused, fetchReminders, route.params, navigation]);

  // Effect to handle scrolling and animation when highlightedReminderId changes
  useEffect(() => {
    if (highlightedReminderId && reminders.length > 0) {
      const indexToHighlight = reminders.findIndex(
        (r) => r.id === highlightedReminderId
      );

      if (indexToHighlight !== -1) {
        // Scroll to the item
        flatListRef.current?.scrollToIndex({
          index: indexToHighlight,
          animated: true,
          viewPosition: 0.5, // Try to center the item
        });

        // Start animation after a short delay to allow scrolling to complete
        // The delay here is crucial for the animation to be seen after scrolling
        setTimeout(() => {
          Animated.sequence([
            Animated.timing(highlightAnimation, {
              toValue: 1, // Highlight state
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: false, // backgroundColor requires useNativeDriver: false
            }),
            Animated.timing(highlightAnimation, {
              toValue: 0, // Normal state
              duration: 500,
              easing: Easing.ease,
              delay: 1000, // Stay highlighted for 1 second
              useNativeDriver: false,
            }),
          ]).start(() => {
            setHighlightedReminderId(null); // Clear highlight after animation
          });
        }, 300); // Adjust this delay as needed (e.g., 300ms for scroll + render)
      }
    }
  }, [highlightedReminderId, reminders, highlightAnimation]);

  const toggleComplete = async (id) => {
    const updated = reminders.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setReminders(updated);
    await AsyncStorage.setItem("reminders", JSON.stringify(updated));
  };

  const deleteReminder = async (id, notificationIds, canDelete) => {
    if (canDelete === false) {
      Alert.alert("Cannot Delete", "This reminder cannot be deleted.");
      return;
    }

    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = reminders.filter((item) => item.id !== id);
            setReminders(updated);
            await AsyncStorage.setItem("reminders", JSON.stringify(updated));
            if (notificationIds && notificationIds.length > 0) {
              await cancelReminderNotifications(notificationIds);
            }
          },
        },
      ]
    );
  };

  const handleEditReminder = (reminder) => {
    if (reminder.isSpecial) {
      setEditingSpecialReminder(reminder);
      setTempStartDate(reminder.startDate || new Date());
      setTempEndDate(reminder.endDate || new Date());
      setShowSpecialReminderModal(true);
    } else {
      navigation.navigate("AddReminder", { reminder: reminder });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#667eea";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatMonthDay = (date) => {
    if (!date) return "Not Set";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reminder.type &&
        reminder.type.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === "all") {
      return matchesSearch;
    } else if (selectedFilter === "pending") {
      return matchesSearch && !reminder.completed;
    } else if (selectedFilter === "completed") {
      return matchesSearch && reminder.completed;
    } else if (selectedFilter === "high") {
      return matchesSearch && reminder.priority === "high";
    }
    return matchesSearch && reminder.priority === selectedFilter;
  });

  const allFilters = [
    { key: "all", label: "All", count: reminders.length },
    {
      key: "pending",
      label: "Pending",
      count: reminders.filter((r) => !r.completed).length,
    },
    {
      key: "completed",
      label: "Completed",
      count: reminders.filter((r) => r.completed).length,
    },
    {
      key: "high",
      label: "High Priority",
      count: reminders.filter((r) => r.priority === "high").length,
    },
  ];

  const priorityFilters = [
    { key: "high", label: "High" },
    { key: "medium", label: "Medium" },
    { key: "low", label: "Low" },
  ];

  const handleSpecialReminderDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (currentPickerType === "start") {
        setTempStartDate(selectedDate);
      } else if (currentPickerType === "end") {
        setTempEndDate(selectedDate);
      }
    }
    setCurrentPickerType(null);
  };

  const saveSpecialReminderDates = async () => {
    if (!editingSpecialReminder) return;

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate that both start and end dates are set
    if (!tempStartDate || !tempEndDate) {
      Alert.alert(
        "Error",
        "Please set both Start Date and End Date before saving."
      );
      return;
    }

    // Validate that start date is not in the past
    const startDateMidnight = new Date(tempStartDate);
    startDateMidnight.setHours(0, 0, 0, 0);
    if (startDateMidnight.getTime() < today.getTime()) {
      Alert.alert("Error", "Start Date cannot be a past date.");
      return;
    }

    // Validate that end date is not in the past
    const endDateMidnight = new Date(tempEndDate);
    endDateMidnight.setHours(0, 0, 0, 0);
    if (endDateMidnight.getTime() < today.getTime()) {
      Alert.alert("Error", "End Date cannot be a past date.");
      return;
    }

    // Validate that start date and end date are not the same
    if (tempStartDate.toDateString() === tempEndDate.toDateString()) {
      Alert.alert("Error", "Start Date and End Date cannot be the same.");
      return;
    }

    // Validate that start date is not after end date
    if (tempStartDate.getTime() > tempEndDate.getTime()) {
      Alert.alert("Error", "Start Date cannot be after End Date.");
      return;
    }

    const updatedSpecialReminder = {
      ...editingSpecialReminder,
      startDate: tempStartDate.toISOString(),
      endDate: tempEndDate.toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem("reminders");
      let parsed = existing ? JSON.parse(existing) : [];

      let foundAndUpdated = false;
      parsed = parsed.map((item) => {
        if (item.id === updatedSpecialReminder.id) {
          foundAndUpdated = true;
          return updatedSpecialReminder;
        }
        return item;
      });

      if (!foundAndUpdated) {
        parsed.push(updatedSpecialReminder);
      }

      await AsyncStorage.setItem("reminders", JSON.stringify(parsed));
      setShowSpecialReminderModal(false);
      setEditingSpecialReminder(null);
      fetchReminders();
    } catch (err) {
      console.error("Failed to save special reminder dates:", err);
      Alert.alert("Error", "Failed to save dates for special reminder.");
    }
  };

  const onFilterButtonLayout = (event) => {
    filterButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setFilterButtonLayout({ pageX, pageY, width, height });
    });
  };

  // getItemLayout is crucial for FlatList's scrollToIndex to work reliably
  // It must be wrapped in useCallback if it depends on props/state that change
  const getItemLayout = useCallback(
    (data, index) => ({
      length: styles.reminderCard.height + styles.reminderCard.marginBottom, // Assuming fixed height for reminder cards
      offset:
        (styles.reminderCard.height + styles.reminderCard.marginBottom) * index,
      index,
    }),
    []
  );

  // renderItem function, now wrapped in useCallback with its dependencies
  const renderItem = useCallback(
    ({ item }) => {
      // Determine if the special reminder is "inactive" (dates not set)
      const isSpecialAndDatesNotSet =
        item.isSpecial && (!item.startDate || !item.endDate);

      // Interpolate background color for highlight animation
      const cardBackgroundColor = highlightAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["white", "#e6f0ff"], // From normal white to light blue for highlight
      });

      return (
        <Animated.View // Wrap with Animated.View for animation
          style={[
            styles.reminderCard,
            isSpecialAndDatesNotSet && styles.paleReminderCard, // Apply pale style if conditions met
            item.id === highlightedReminderId && {
              backgroundColor: cardBackgroundColor,
            }, // Apply animated background if highlighted
          ]}
        >
          <TouchableOpacity
            style={styles.reminderCardContent} // New style to contain content for touchable area
            onPress={() =>
              item.isSpecial
                ? handleEditReminder(item)
                : handleEditReminder(item)
            }
          >
            <View style={styles.reminderHeader}>
              <View style={styles.reminderLeft}>
                <View
                  style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(item.priority) },
                  ]}
                />
                <View>
                  <Text
                    style={[
                      styles.reminderTitle,
                      item.completed && styles.completedText,
                      isSpecialAndDatesNotSet && styles.paleText, // Apply pale text style
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.reminderSubject,
                      isSpecialAndDatesNotSet && styles.paleText, // Apply pale text style
                    ]}
                  >
                    {item.isSpecial ? item.subject : item.type || "No Type"}
                  </Text>
                </View>
              </View>
              {item.priority === "high" && !item.completed && (
                <AlertCircle size={20} color="#ef4444" />
              )}
            </View>

            <View style={styles.reminderFooter}>
              <View style={styles.dateTimeContainer}>
                {item.isSpecial && (item.startDate || item.endDate) ? (
                  <>
                    <View style={styles.dateTime}>
                      <Calendar
                        size={14}
                        color={isSpecialAndDatesNotSet ? "#ccc" : "#666"}
                      />
                      <Text
                        style={[
                          styles.dateText,
                          isSpecialAndDatesNotSet && styles.paleText,
                        ]}
                      >
                        {formatMonthDay(item.startDate)} -{" "}
                        {formatMonthDay(item.endDate)}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.dateTime}>
                      <Calendar
                        size={14}
                        color={isSpecialAndDatesNotSet ? "#ccc" : "#666"}
                      />
                      <Text
                        style={[
                          styles.dateText,
                          isSpecialAndDatesNotSet && styles.paleText,
                        ]}
                      >
                        {formatDate(item.date)}
                      </Text>
                    </View>
                    <View style={styles.dateTime}>
                      <Clock
                        size={14}
                        color={isSpecialAndDatesNotSet ? "#ccc" : "#666"}
                      />
                      <Text
                        style={[
                          styles.timeText,
                          isSpecialAndDatesNotSet && styles.paleText,
                        ]}
                      >
                        {formatTime(item.date)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
              <View
                style={[
                  styles.statusBadge,
                  item.completed ? styles.completedBadge : styles.pendingBadge,
                  isSpecialAndDatesNotSet && styles.paleBadge, // Apply pale badge style
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.completed
                      ? styles.completedStatusText
                      : styles.pendingStatusText,
                    isSpecialAndDatesNotSet && styles.paleText, // Apply pale text style
                  ]}
                >
                  {item.completed ? "Completed" : "Pending"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.reminderActions}>
            {item.isSpecial ? (
              <TouchableOpacity
                onPress={() => handleEditReminder(item)}
                style={[
                  styles.actionButton,
                  isSpecialAndDatesNotSet && styles.highlightedActionButton, // Apply highlight
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    isSpecialAndDatesNotSet &&
                      styles.highlightedActionButtonText, // Apply highlight text color
                  ]}
                >
                  {item.startDate ? "Edit Dates" : "Set Dates"}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => toggleComplete(item.id)}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>
                    {item.completed ? "Mark Pending" : "Mark Complete"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleEditReminder(item)}
                  style={styles.actionButton}
                >
                  <Edit size={18} color="#4f46e5" />
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() =>
                deleteReminder(item.id, item.notificationIds, item.canDelete)
              }
              style={styles.actionButton}
              disabled={item.canDelete === false}
            >
              <Trash2
                size={18}
                color={item.canDelete === false ? "#ccc" : "red"}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    },
    [
      highlightAnimation,
      highlightedReminderId,
      handleEditReminder,
      getPriorityColor,
      formatDate,
      formatTime,
      formatMonthDay,
      toggleComplete,
      deleteReminder,
    ]
  ); // Add all dependencies

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Reminders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddReminder")}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reminders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          ref={filterButtonRef}
          onLayout={onFilterButtonLayout}
          style={styles.filterButton}
          onPress={() => setShowPriorityFilterModal(true)}
        >
          <Filter size={20} color="#667eea" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {allFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredReminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No reminders found matching your criteria.
          </Text>
          <TouchableOpacity
            style={styles.addReminderPromptButton}
            onPress={() => navigation.navigate("AddReminder")}
          >
            <Text style={styles.addReminderPromptText}>Add New Reminder</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef} // Attach the ref here
          data={filteredReminders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.remindersListContent}
          // Add getItemLayout for performance and reliable scrolling
          getItemLayout={getItemLayout}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showPriorityFilterModal}
        onRequestClose={() => setShowPriorityFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowPriorityFilterModal(false)}
        >
          {filterButtonLayout && (
            <View
              style={[
                styles.priorityDropdown,
                {
                  top: filterButtonLayout.pageY + filterButtonLayout.height + 5, // Position below the button + small margin
                  right: 20, // Align to the right of the screen
                },
              ]}
            >
              <Text style={styles.dropdownTitle}>Filter by Priority</Text>
              {priorityFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedFilter(filter.key);
                    setShowPriorityFilterModal(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{filter.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setSelectedFilter("all");
                  setShowPriorityFilterModal(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>Show All</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSpecialReminderModal}
        onRequestClose={() => setShowSpecialReminderModal(false)}
      >
        <View style={styles.specialModalOverlay}>
          <View style={styles.specialModalContent}>
            <TouchableOpacity
              style={styles.specialModalCloseButton}
              onPress={() => setShowSpecialReminderModal(false)}
            >
              <X size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.specialModalTitle}>
              Set Dates for{"\n"}
              {editingSpecialReminder?.title}
            </Text>

            <View style={styles.specialModalDateTimeRow}>
              <View style={styles.specialModalDateTimeItem}>
                <Text style={styles.specialModalLabel}>Start Date</Text>
                <TouchableOpacity
                  style={styles.specialModalDateButton}
                  onPress={() => {
                    setShowDatePicker(true);
                    setCurrentPickerType("start");
                  }}
                >
                  <Calendar size={20} color="#667eea" />
                  <Text style={styles.specialModalDateText}>
                    {formatMonthDay(tempStartDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.specialModalDateTimeItem}>
                <Text style={styles.specialModalLabel}>End Date</Text>
                <TouchableOpacity
                  style={styles.specialModalDateButton}
                  onPress={() => {
                    setShowDatePicker(true);
                    setCurrentPickerType("end");
                  }}
                >
                  <Calendar size={20} color="#667eea" />
                  <Text style={styles.specialModalDateText}>
                    {formatMonthDay(tempEndDate)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.specialModalSaveButton}
              onPress={saveSpecialReminderDates}
            >
              <Text style={styles.specialModalSaveButtonText}>Save Dates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={currentPickerType === "start" ? tempStartDate : tempEndDate}
          mode="date"
          display="default"
          onChange={handleSpecialReminderDateChange}
        />
      )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#667eea",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 5,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    backgroundColor: "white",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 70, // Slightly adjusted minWidth for better fit
    justifyContent: "center",
    alignItems: "center",
    height: 30, // Fixed height to prevent vertical resizing
  },
  filterChipActive: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  filterText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "white",
  },
  remindersListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reminderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // Define a fixed height here for getItemLayout to work reliably
    height: 120, // Example fixed height, adjust as needed based on your content
  },
  // NEW STYLE TO ENSURE TOUCHABLE AREA COVERS CONTENT
  reminderCardContent: {
    flex: 1, // Ensure content takes full width
  },
  // UPDATED STYLE FOR PALE REMINDER CARD
  paleReminderCard: {
    opacity: 0.8, // Reduced paleness (from 0.6 to 0.8)
    backgroundColor: "#f0f0f0", // Slightly grey background
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reminderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  priorityIndicator: {
    width: 4,
    height: 35,
    borderRadius: 2,
    marginRight: 10,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  // UPDATED STYLE FOR PALE TEXT
  paleText: {
    color: "#999", // Dimmed text color
  },
  reminderSubject: {
    fontSize: 13,
    color: "#666",
  },
  reminderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  dateTime: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  dateText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  // UPDATED STYLE FOR PALE BADGE
  paleBadge: {
    backgroundColor: "#e0e0e0", // Dimmed badge background
  },
  completedBadge: {
    backgroundColor: "#dcfce7",
  },
  pendingBadge: {
    backgroundColor: "#fef3c7",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  completedStatusText: {
    color: "#16a34a",
  },
  pendingStatusText: {
    color: "#d97706",
  },
  reminderActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  actionButton: {
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "#4f46e5",
    fontSize: 11,
    fontWeight: "600",
  },
  // NEW STYLE FOR HIGHLIGHTED ACTION BUTTON
  highlightedActionButton: {
    backgroundColor: "#667eea", // Primary blue background
    paddingVertical: 8, // More padding
    paddingHorizontal: 12, // More padding
    borderRadius: 8, // Rounded corners
    shadowColor: "#000", // Add shadow for pop-out effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  // NEW STYLE FOR HIGHLIGHTED ACTION BUTTON TEXT
  highlightedActionButtonText: {
    color: "white", // White text
    fontWeight: "bold", // Bold text
    fontSize: 9, // Slightly larger font
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
  },
  addReminderPromptButton: {
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addReminderPromptText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // New styles for Priority Filter Dropdown
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.0)", // Transparent overlay
  },
  priorityDropdown: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 0,
    width: 180, // Fixed width for the dropdown
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000, // Ensure it's above other content
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginBottom: 10,
    color: "#333",
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownOptionText: {
    fontSize: 15,
    color: "#444",
  },
  // Special Reminder Modal styles (already existing, but included for completeness)
  specialModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  specialModalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  specialModalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  specialModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  specialModalDateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  specialModalDateTimeItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  specialModalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  specialModalDateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  specialModalDateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  specialModalSaveButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  specialModalSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
