import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  cancelObligationNotifications,
  scheduleObligationNotifications,
} from "../../utils/notificationService";

export default function UpdateObligation() {
  const navigation = useNavigation();
  const route = useRoute();
  const { obligationId } = route.params;

  const [obligation, setObligation] = useState(null);
  const [newBalance, setNewBalance] = useState("");
  const [newDeadline, setNewDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchObligation = async () => {
      try {
        const storedObligations = await AsyncStorage.getItem("obligations");
        if (storedObligations) {
          const parsedObligations = JSON.parse(storedObligations);
          const foundObligation = parsedObligations.find(
            (item) => item.id === obligationId
          );
          if (foundObligation) {
            setObligation(foundObligation);
            setNewBalance(foundObligation.balance.toString());
            setNewDeadline(new Date(foundObligation.deadline));
          }
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load obligation data.");
      }
    };
    fetchObligation();
  }, [obligationId]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || newDeadline;
    setShowPicker(Platform.OS === "ios");
    setNewDeadline(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  const handleUpdate = async (updateType) => {
    if (!obligation) return;

    try {
      const storedObligations = await AsyncStorage.getItem("obligations");
      const parsedObligations = storedObligations
        ? JSON.parse(storedObligations)
        : [];
      const updatedList = parsedObligations.map((item) => {
        if (item.id === obligationId) {
          const updatedItem = { ...item };
          if (updateType === "balance" || updateType === "both") {
            updatedItem.balance = parseFloat(newBalance);
          }
          if (updateType === "deadline" || updateType === "both") {
            updatedItem.deadline = newDeadline.toISOString();
          }
          return updatedItem;
        }
        return item;
      });

      await AsyncStorage.setItem("obligations", JSON.stringify(updatedList));

      const oldNotificationIds = JSON.parse(
        await AsyncStorage.getItem(`notificationIds-${obligationId}`)
      );
      if (oldNotificationIds) {
        await cancelObligationNotifications(oldNotificationIds);
      }

      const newObligation = updatedList.find(
        (item) => item.id === obligationId
      );
      const newNotificationIds = await scheduleObligationNotifications(
        newObligation
      );
      await AsyncStorage.setItem(
        `notificationIds-${obligationId}`,
        JSON.stringify(newNotificationIds)
      );

      Alert.alert("Success", "Obligation updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update obligation.");
    }
  };

  if (!obligation) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#1A237E",
            marginBottom: 20,
          }}
        >
          Update Obligation
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
          {obligation.title}
        </Text>

        <Text style={{ fontSize: 16, color: "#424242", marginBottom: 5 }}>
          Current Balance
        </Text>
        <TextInput
          keyboardType="numeric"
          style={{
            borderColor: "#E0E0E0",
            borderWidth: 1,
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            backgroundColor: "#F5F5F5",
            fontSize: 16,
          }}
          value={newBalance}
          onChangeText={setNewBalance}
        />

        <Text style={{ fontSize: 16, color: "#424242", marginBottom: 5 }}>
          Current Deadline
        </Text>
        <TouchableOpacity
          onPress={showDatepicker}
          style={{
            borderColor: "#E0E0E0",
            borderWidth: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: "#F5F5F5",
            marginBottom: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: "#424242" }}>
            {newDeadline.toDateString()}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={newDeadline}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => handleUpdate("balance")}
            style={{
              backgroundColor: "#4f46e5",
              paddingVertical: 15,
              borderRadius: 10,
              alignItems: "center",
              width: "48%",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Update Balance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleUpdate("both")}
            style={{
              backgroundColor: "#1E88E5",
              paddingVertical: 15,
              borderRadius: 10,
              alignItems: "center",
              width: "48%",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Update All
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
