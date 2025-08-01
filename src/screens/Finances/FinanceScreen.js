import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { cancelObligationNotifications } from "../../utils/notificationService";

export default function MyFinances() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [obligations, setObligations] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchObligations = async () => {
    try {
      const storedObligations = await AsyncStorage.getItem("obligations");
      if (storedObligations) {
        const parsedObligations = JSON.parse(storedObligations);
        setObligations(parsedObligations);
        const total = parsedObligations.reduce(
          (sum, item) => sum + item.balance,
          0
        );
        setTotalBalance(total);
      } else {
        setObligations([]);
        setTotalBalance(0);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch financial data.");
    }
  };

  const deleteObligation = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this obligation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedObligations = obligations.filter(
                (item) => item.id !== id
              );
              await AsyncStorage.setItem(
                "obligations",
                JSON.stringify(updatedObligations)
              );
              setObligations(updatedObligations);
              const notificationIds = JSON.parse(
                await AsyncStorage.getItem(`notificationIds-${id}`)
              );
              if (notificationIds) {
                await cancelObligationNotifications(notificationIds);
                await AsyncStorage.removeItem(`notificationIds-${id}`);
              }
              const total = updatedObligations.reduce(
                (sum, item) => sum + item.balance,
                0
              );
              setTotalBalance(total);
            } catch (error) {
              Alert.alert("Error", "Failed to delete obligation.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (isFocused) {
      fetchObligations();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "#f3f4f6",
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: "#4b5563" }}>
          Amount: ₦{item.amount}
        </Text>
        <Text style={{ fontSize: 14, color: "#4b5563" }}>
          Balance: ₦{item.balance}
        </Text>
        <Text style={{ fontSize: 12, color: "#6b7280" }}>
          Due: {format(new Date(item.deadline), "MMM d, yyyy")}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UpdateObligation", { obligationId: item.id })
          }
          style={{
            backgroundColor: "#FBC02D",
            padding: 8,
            borderRadius: 5,
            marginRight: 8,
          }}
        >
          <Text style={{ color: "white" }}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteObligation(item.id)}
          style={{
            backgroundColor: "#EF5350",
            padding: 8,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#1A237E",
            marginBottom: 10,
          }}
        >
          My Finances
        </Text>
        <View
          style={{
            backgroundColor: "#4f46e5",
            padding: 20,
            borderRadius: 15,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "#ffffff" }}>Total Balance:</Text>
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "#ffffff" }}>
            GH₵{totalBalance}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 10,
          }}
        >
          My Obligations
        </Text>
        <FlatList
          data={obligations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text
              style={{ textAlign: "center", color: "#6b7280", marginTop: 50 }}
            >
              No financial obligations added yet.
            </Text>
          )}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("AddObligation")}
          style={{
            marginTop: 20,
            backgroundColor: "#4f46e5",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Add New Obligation
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
