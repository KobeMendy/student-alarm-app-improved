// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   SafeAreaView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";

// export default function HomeScreen() {
//   const [reminders, setReminders] = useState([]);
//   const [username, setUsername] = useState("Student"); // Default to "Student"
//   const navigation = useNavigation();

//   // Function to fetch and filter reminders
//   const fetchAndFilterReminders = useCallback(async () => {
//     const stored = await AsyncStorage.getItem("reminders");
//     const parsed = stored ? JSON.parse(stored) : [];
//     const now = new Date();

//     const upcomingAndValid = parsed.filter((item) => {
//       const reminderDate = new Date(item.date);

//       // Filter out reminders that are past due or completed
//       const isPastDue = reminderDate <= now;
//       const isCompleted = item.completed;

//       // Filter out special reminders if their start or end dates are not set
//       const isDeemedSpecial =
//         item.isSpecial && (!item.startDate || !item.endDate);

//       return !isPastDue && !isCompleted && !isDeemedSpecial;
//     });

//     const sorted = upcomingAndValid.sort(
//       (a, b) => new Date(a.date) - new Date(b.date)
//     );
//     // Get the next five upcoming reminders
//     const topFive = sorted.slice(0, 5);
//     setReminders(topFive);
//   }, []);

//   // Function to fetch username
//   const fetchUsername = useCallback(async () => {
//     try {
//       const onboardingData = await AsyncStorage.getItem("onboardingData");
//       if (onboardingData) {
//         const parsedData = JSON.parse(onboardingData);
//         // Ensure username is a string, fallback to empty string if null/undefined
//         setUsername(parsedData.username || "");
//       } else {
//         setUsername("Student"); // Fallback if no onboarding data
//       }
//     } catch (error) {
//       console.error("Failed to load username from AsyncStorage:", error);
//       setUsername("Student"); // Fallback on error
//     }
//   }, []);

//   // Use useFocusEffect to refresh data when the screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       fetchAndFilterReminders();
//       fetchUsername(); // Fetch username when screen is focused

//       const interval = setInterval(fetchAndFilterReminders, 60000); // Refresh reminders every minute
//       return () => clearInterval(interval);
//     }, [fetchAndFilterReminders, fetchUsername]) // Add fetchUsername to dependencies
//   );

//   // Handle reminder card press
//   const handleReminderPress = (reminderId) => {
//     // Navigate to the Reminders screen and pass the ID to highlight
//     navigation.navigate("Reminders", { highlightId: reminderId });
//   };

//   const renderReminder = ({ item }) => (
//     <TouchableOpacity
//       style={styles.reminderCard}
//       onPress={() => handleReminderPress(item.id)} // Make the card clickable
//     >
//       <MaterialCommunityIcons
//         name="bell-ring-outline"
//         size={22}
//         color="#1e3a8a"
//         style={{ marginRight: 10 }}
//       />
//       <View>
//         <Text style={styles.reminderTitle}>{item.title}</Text>
//         <Text style={styles.reminderDate}>
//           {
//             item.isSpecial
//               ? item.subject // For special reminders, display subject
//               : item.type || item.category // For regular, display type or category
//           }{" "}
//           • {new Date(item.date).toDateString()}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderHeader = () => (
//     <View style={{ paddingHorizontal: 20, paddingTop: 50 }}>
//       {/* Dynamic greeting with username */}
//       <Text style={styles.greeting}>Hello {username}, 👋</Text>
//       <Text style={styles.sectionTitle}>Quick Actions</Text>

//       <View style={styles.quickActions}>
//         <TouchableOpacity
//           style={styles.actionCard}
//           onPress={() => navigation.navigate("AddReminder")}
//         >
//           <Ionicons name="add-circle-outline" size={30} color="#4338ca" />
//           <Text style={styles.actionText}>New Reminder</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionCard}
//           onPress={() => navigation.navigate("Upload")}
//         >
//           <Ionicons name="cloud-upload-outline" size={30} color="#4338ca" />
//           <Text style={styles.actionText}>Upload Calendar</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionCard}
//           onPress={() => navigation.navigate("Calendar")}
//         >
//           <Ionicons name="calendar-outline" size={30} color="#4338ca" />
//           <Text style={styles.actionText}>My Calendar</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionCard}
//           onPress={() => navigation.navigate("MyFinances")}
//         >
//           <Ionicons name="wallet-outline" size={30} color="#4338ca" />
//           <Text style={styles.actionText}>My Finances</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.sectionTitle}>Upcoming Reminders</Text>

//       {reminders.length === 0 && (
//         <Text style={styles.empty}>No upcoming reminders yet.</Text>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <FlatList
//         ListHeaderComponent={renderHeader}
//         contentContainerStyle={{ paddingBottom: 40 }}
//         data={reminders}
//         keyExtractor={(item) => item.id}
//         renderItem={renderReminder}
//         ListFooterComponent={
//           reminders.length > 0 ? (
//             <View style={{ paddingHorizontal: 20 }}>
//               <TouchableOpacity
//                 style={styles.viewAll}
//                 onPress={() => navigation.navigate("Reminders")}
//               >
//                 <Text style={styles.viewAllText}>View All Reminders</Text>
//                 <Ionicons name="chevron-forward" size={20} color="#1e40af" />
//               </TouchableOpacity>
//             </View>
//           ) : null
//         }
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   greeting: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   quickActions: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     gap: 12,
//     marginBottom: 30,
//   },
//   actionCard: {
//     alignItems: "center",
//     width: "47%",
//     paddingVertical: 14,
//     backgroundColor: "#eef2ff",
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   actionText: {
//     marginTop: 6,
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#1e3a8a",
//     textAlign: "center",
//   },
//   reminderCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f3f4f6",
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//     marginHorizontal: 20,
//   },
//   reminderTitle: {
//     fontSize: 15,
//     fontWeight: "500",
//     color: "#111827",
//   },
//   reminderDate: {
//     fontSize: 12,
//     color: "#6b7280",
//   },
//   viewAll: {
//     marginTop: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//   },
//   viewAllText: {
//     color: "#1e40af",
//     fontSize: 14,
//     marginRight: 6,
//     fontWeight: "600",
//   },
//   empty: {
//     fontSize: 14,
//     color: "#9ca3af",
//     fontStyle: "italic",
//   },
// });
// HomeScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  Bell,
  Calendar,
  DollarSign,
  Plus,
  BookOpen,
  Clock,
  Settings,
} from "lucide-react-native";
import { format } from "date-fns";

export default function HomeScreen() {
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [remindersDueTodayCount, setRemindersDueTodayCount] = useState(0);
  const [remindersDueThisWeekCount, setRemindersDueThisWeekCount] = useState(0);
  const [recentFinances, setRecentFinances] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [username, setUsername] = useState("Student");
  const navigation = useNavigation();

  const fetchAndFilterReminders = useCallback(async () => {
    const stored = await AsyncStorage.getItem("reminders");
    const parsed = stored ? JSON.parse(stored) : [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    oneWeekFromNow.setHours(23, 59, 59, 999);

    let dueTodayCount = 0;
    let dueThisWeekCount = 0;

    const validReminders = parsed.filter((item) => {
      const reminderDate = new Date(item.date);
      reminderDate.setHours(0, 0, 0, 0);

      const isPastDue = reminderDate.getTime() < now.getTime();
      const isCompleted = item.completed;

      const isDeemedSpecial =
        item.isSpecial && (!item.startDate || !item.endDate);

      if (!isPastDue && !isCompleted && !isDeemedSpecial) {
        if (reminderDate.toDateString() === now.toDateString()) {
          dueTodayCount++;
        }
        if (
          reminderDate.getTime() >= now.getTime() &&
          reminderDate.getTime() <= oneWeekFromNow.getTime()
        ) {
          dueThisWeekCount++;
        }
        return true;
      }
      return false;
    });

    setRemindersDueTodayCount(dueTodayCount);
    setRemindersDueThisWeekCount(dueThisWeekCount);

    const sortedUpcoming = validReminders.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const topFive = sortedUpcoming.slice(0, 5);
    setUpcomingReminders(topFive);
  }, []);

  const fetchRecentFinances = useCallback(async () => {
    try {
      const storedObligations = await AsyncStorage.getItem("obligations");
      if (storedObligations) {
        const parsedObligations = JSON.parse(storedObligations);
        const sortedObligations = parsedObligations.sort(
          (a, b) => new Date(b.deadline) - new Date(a.deadline)
        );
        const topThree = sortedObligations.slice(0, 3);
        setRecentFinances(topThree);
        const total = parsedObligations.reduce(
          (sum, item) => sum + item.balance,
          0
        );
        setTotalBalance(total);
      } else {
        setRecentFinances([]);
        setTotalBalance(0);
      }
    } catch (error) {
      console.error("Failed to fetch recent finances:", error);
    }
  }, []);

  const fetchUsername = useCallback(async () => {
    try {
      const onboardingData = await AsyncStorage.getItem("onboardingData");
      if (onboardingData) {
        const parsedData = JSON.parse(onboardingData);
        setUsername(parsedData.username || "Student");
      } else {
        setUsername("Student");
      }
    } catch (error) {
      console.error("Failed to load username from AsyncStorage:", error);
      setUsername("Student");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAndFilterReminders();
      fetchRecentFinances();
      fetchUsername();

      const interval = setInterval(() => {
        fetchAndFilterReminders();
        fetchRecentFinances();
      }, 60000);
      return () => clearInterval(interval);
    }, [fetchAndFilterReminders, fetchRecentFinances, fetchUsername])
  );

  const handleReminderPress = (reminderId) => {
    navigation.navigate("Reminders", { highlightId: reminderId });
  };

  const handleFinancePress = (obligationId) => {
    navigation.navigate("MyFinances", { highlightId: obligationId });
  };

  const formatTimeRemaining = (dateString) => {
    const now = new Date();
    const targetDate = new Date(dateString);
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs < 0) return "Past Due";

    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `${diffHours} hours`;
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `${diffDays} days`;
    }
  };

  const renderUpcomingReminderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.reminderCard}
      onPress={() => handleReminderPress(item.id)}
    >
      <View style={styles.reminderLeft}>
        <View
          style={[
            styles.reminderIcon,
            item.priority === "high" && styles.reminderIconUrgent,
          ]}
        >
          <BookOpen
            size={16}
            color={item.priority === "high" ? "#ef4444" : "#667eea"}
          />
        </View>
        <View>
          <Text style={styles.reminderTitle}>{item.title}</Text>
          <Text style={styles.reminderTime}>
            {formatTimeRemaining(item.date)} •{" "}
            {item.isSpecial ? item.subject : item.type || "N/A"}
          </Text>
        </View>
      </View>
      {item.priority === "high" && (
        <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />
      )}
    </TouchableOpacity>
  );

  const renderFinanceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.financeCard}
      onPress={() => handleFinancePress(item.id)}
    >
      <View style={styles.financeLeft}>
        <View
          style={[
            styles.financeIcon,
            item.balance > 0 ? styles.expenseIcon : styles.incomeIcon,
          ]}
        >
          <DollarSign size={16} color="white" />
        </View>
        <Text style={styles.financeTitle}>{item.title}</Text>
      </View>
      <Text
        style={[
          styles.financeAmount,
          item.balance > 0 ? styles.expenseAmount : styles.incomeAmount,
        ]}
      >
        GH₵{Math.abs(item.balance)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello {username}, 👋</Text>
          <TouchableOpacity
            style={styles.settingsIcon}
            onPress={() => navigation.navigate("Settings")}
          >
            <Settings size={24} color="#667eea" />
          </TouchableOpacity>
        </View>
        <View style={styles.quickStats}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate("Reminders")}
          >
            <View style={styles.statIcon}>
              <Clock size={20} color="#667eea" />
            </View>
            <Text style={styles.statNumber}>{remindersDueTodayCount}</Text>
            <Text style={styles.statLabel}>Due Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate("Reminders")}
          >
            <View style={styles.statIcon}>
              <Calendar size={20} color="#10b981" />
            </View>
            <Text style={styles.statNumber}>{remindersDueThisWeekCount}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate("MyFinances")}
          >
            <View style={styles.statIcon}>
              <DollarSign size={20} color="#f59e0b" />
            </View>
            <Text style={styles.statNumber}>GH₵{totalBalance}</Text>
            <Text style={styles.statLabel}>Balance</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Reminders")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingReminders.length === 0 ? (
            <Text style={styles.empty}>No upcoming reminders yet.</Text>
          ) : (
            <FlatList
              data={upcomingReminders}
              keyExtractor={(item) => item.id}
              renderItem={renderUpcomingReminderItem}
              scrollEnabled={false}
              contentContainerStyle={styles.upcomingRemindersList}
            />
          )}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Finances</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MyFinances")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentFinances.length === 0 ? (
            <Text style={styles.empty}>No Recent Finances yet.</Text>
          ) : (
            <FlatList
              data={recentFinances}
              keyExtractor={(item) => item.id}
              renderItem={renderFinanceItem}
              scrollEnabled={false}
              contentContainerStyle={styles.recentFinancesList}
            />
          )}
        </View>
        <View style={styles.quickActionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("AddReminder")}
          >
            <Plus size={20} color="white" />
            <Text style={styles.actionButtonText}>Add Reminder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={() => navigation.navigate("AddObligation")}
          >
            <Plus size={20} color="#667eea" />
            <Text
              style={[
                styles.actionButtonText,
                styles.secondaryActionButtonText,
              ]}
            >
              Add Finance
            </Text>
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
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  settingsIcon: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStats: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 30,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "500",
  },
  reminderCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reminderIconUrgent: {
    backgroundColor: "#fef2f2",
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  reminderTime: {
    fontSize: 12,
    color: "#666",
  },
  financeCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  financeLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  financeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: "#10b981",
  },
  expenseIcon: {
    backgroundColor: "#ef4444",
  },
  financeTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  financeAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  incomeAmount: {
    color: "#10b981",
  },
  expenseAmount: {
    color: "#ef4444",
  },
  quickActionsSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#667eea",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  secondaryActionButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#667eea",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryActionButtonText: {
    color: "#667eea",
  },
  upcomingRemindersList: {},
  recentFinancesList: {},
  empty: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
});
