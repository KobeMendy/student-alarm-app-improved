import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function SchoolSemesterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("KNUST");
  const [semester, setSemester] = useState("");

  const handleContinue = () => {
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Please enter your full name.");
      return;
    }
    if (!semester) {
      Alert.alert("Validation Error", "Please select a semester.");
      return;
    }

    navigation.navigate("Main");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. John Doe"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Select Your School</Text>
      <RNPickerSelect
        onValueChange={(value) => setSchoolName(value)}
        value={schoolName}
        style={pickerSelectStyles}
        items={[
          { label: "KNUST", value: "KNUST" },
          { label: "University of Ghana", value: "UG" },
          { label: "UCC", value: "UCC" },
          { label: "Ashesi University", value: "Ashesi" },
        ]}
        placeholder={{}}
      />

      <Text style={styles.label}>Select Semester</Text>
      <RNPickerSelect
        onValueChange={(value) => setSemester(value)}
        value={semester}
        style={pickerSelectStyles}
        items={[
          { label: "Semester 1", value: "Semester 1" },
          { label: "Semester 2", value: "Semester 2" },
        ]}
        placeholder={{ label: "Choose a semester...", value: null }}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 6,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    marginTop: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    backgroundColor: "#f9fafb",
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    backgroundColor: "#f9fafb",
    paddingRight: 30,
    marginBottom: 10,
  },
};
