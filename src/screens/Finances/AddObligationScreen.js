import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { scheduleObligationNotifications } from "../../utils/notificationService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddObligation() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowPicker(Platform.OS === "ios");
    setDeadline(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  const saveObligation = async () => {
    if (!title || !amount) {
      Alert.alert("Incomplete Data", "Please enter a title and amount.");
      return;
    }

    const newObligation = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      deadline: deadline.toISOString(),
      balance: parseFloat(amount),
    };

    try {
      const existingObligations =
        JSON.parse(await AsyncStorage.getItem("obligations")) || [];
      existingObligations.push(newObligation);
      await AsyncStorage.setItem(
        "obligations",
        JSON.stringify(existingObligations)
      );

      const notificationIds = await scheduleObligationNotifications(
        newObligation
      );
      await AsyncStorage.setItem(
        `notificationIds-${newObligation.id}`,
        JSON.stringify(notificationIds)
      );

      Alert.alert("Success", "Financial obligation saved successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save obligation.");
    }
  };

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
          Add New Obligation
        </Text>

        <Text style={{ fontSize: 16, color: "#424242", marginBottom: 5 }}>
          Obligation Title
        </Text>
        <TextInput
          style={{
            borderColor: "#E0E0E0",
            borderWidth: 1,
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            backgroundColor: "#F5F5F5",
            fontSize: 16,
          }}
          placeholder="e.g. Hostel Fees"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={{ fontSize: 16, color: "#424242", marginBottom: 5 }}>
          Amount (GH₵)
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
          placeholder="e.g. 50000"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={{ fontSize: 16, color: "#424242", marginBottom: 5 }}>
          Deadline
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
            {deadline.toDateString()}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={deadline}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <TouchableOpacity
          onPress={saveObligation}
          style={{
            backgroundColor: "#00C853",
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            Save Obligation
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
