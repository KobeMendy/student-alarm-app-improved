import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  Animated, // For animations
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native"; // Import useIsFocused
import { Ionicons } from "@expo/vector-icons"; // For back button
import RNPickerSelect from "react-native-picker-select";
import SearchablePicker from "../../components/SearchablePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Re-using programmesList from SchoolSemesterScreen for consistency
const programmesList = [
  { label: "BSc. Agriculture", value: "BSc. Agriculture" },
  {
    label: "BSc. Agricultural Biotechnology",
    value: "BSc. Agricultural Biotechnology",
  },
  {
    label: "BSc. Agribusiness Management",
    value: "BSc. Agribusiness Management",
  },
  {
    label: "BSc. Landscape Design and Management",
    value: "BSc. Landscape Design and Management",
  },
  {
    label: "BSc. Natural Resources Management",
    value: "BSc. Natural Resources Management",
  },
  {
    label: "BSc. Forest Resources Technology",
    value: "BSc. Forest Resources Technology",
  },
  {
    label: "BSc. Aquaculture and Water Resources Management",
    value: "BSc. Aquaculture and Water Resources Management",
  },
  { label: "BSc. Packaging Technology", value: "BSc. Packaging Technology" },
  { label: "BSc. Architecture", value: "BSc. Architecture" },
  {
    label: "BSc. Construction Technology and Management",
    value: "BSc. Construction Technology and Management",
  },
  {
    label: "BSc. Quantity Surveying and Construction Economics",
    value: "BSc. Quantity Surveying and Construction Economics",
  },
  { label: "BSc. Development Planning", value: "BSc. Development Planning" },
  {
    label: "BSc. Human Settlement Planning",
    value: "BSc. Human Settlement Planning",
  },
  { label: "BSc. Land Economy", value: "BSc. Land Economy" },
  { label: "BSc. Real Estate", value: "BSc. Real Estate" },
  {
    label: "BFA. Fine Art and Curatorial Practice",
    value: "BFA. Fine Art and Curatorial Practice",
  },
  {
    label: "BA. Communication Design (Graphic Design)",
    value: "BA. Communication Design (Graphic Design)",
  },
  {
    label: "BA. Integrated Rural Art and Industry",
    value: "BA. Integrated Rural Art and Industry",
  },
  { label: "BA. Publishing Studies", value: "BA. Publishing Studies" },
  {
    label: "BSc. Metal Product Design Technology",
    value: "BSc. Metal Product Design Technology",
  },
  {
    label: "BSc. Textile Design and Technology",
    value: "BSc. Textile Design and Technology",
  },
  { label: "BSc. Fashion Design", value: "BSc. Fashion Design" },
  { label: "BSc. Ceramics Technology", value: "BSc. Ceramics Technology" },
  {
    label: "B.Ed. Junior High School Specialism",
    value: "B.Ed. Junior High School Specialism",
  },
  { label: "BSc. Aerospace Engineering", value: "BSc. Aerospace Engineering" },
  {
    label: "BSc. Agricultural Engineering",
    value: "BSc. Agricultural Engineering",
  },
  {
    label: "BSc. Automobile Engineering",
    value: "BSc. Automobile Engineering",
  },
  {
    label: "BSc. Biomedical Engineering",
    value: "BSc. Biomedical Engineering",
  },
  { label: "BSc. Chemical Engineering", value: "BSc. Chemical Engineering" },
  { label: "BSc. Civil Engineering", value: "BSc. Civil Engineering" },
  { label: "BSc. Computer Engineering", value: "BSc. Computer Engineering" },
  {
    label: "BSc. Electrical/Electronic Engineering",
    value: "BSc. Electrical/Electronic Engineering",
  },
  {
    label: "BSc. Geological Engineering",
    value: "BSc. Geological Engineering",
  },
  {
    label: "BSc. Geomatic (Geodetic) Engineering",
    value: "BSc. Geomatic (Geodetic) Engineering",
  },
  {
    label: "BSc. Industrial Engineering",
    value: "BSc. Industrial Engineering",
  },
  { label: "BSc. Marine Engineering", value: "BSc. Marine Engineering" },
  { label: "BSc. Materials Engineering", value: "BSc. Materials Engineering" },
  {
    label: "BSc. Mechanical Engineering",
    value: "BSc. Mechanical Engineering",
  },
  {
    label: "BSc. Metallurgical Engineering",
    value: "BSc. Metallurgical Engineering",
  },
  {
    label: "BSc. Petrochemical Engineering",
    value: "BSc. Petrochemical Engineering",
  },
  { label: "BSc. Petroleum Engineering", value: "BSc. Petroleum Engineering" },
  {
    label: "BSc. Telecommunication Engineering",
    value: "BSc. Telecommunication Engineering",
  },
  {
    label: "Bachelor of Dental Surgery (BDS) (Fee-Paying Only)",
    value: "Bachelor of Dental Surgery (BDS) (Fee-Paying Only)",
  },
  {
    label: "Doctor of Veterinary Medicine (DVM)",
    value: "Doctor of Veterinary Medicine (DVM)",
  },
  {
    label: "BSc. Disability and Rehabilitation Studies",
    value: "BSc. Disability and Rehabilitation Studies",
  },
  {
    label: "Bachelor of Herbal Medicine (BHM)",
    value: "Bachelor of Herbal Medicine (BHM)",
  },
  {
    label: "BSc. Human Biology (Medicine)",
    value: "BSc. Human Biology (Medicine)",
  },
  {
    label: "BSc. Medical Laboratory Science",
    value: "BSc. Medical Laboratory Science",
  },
  { label: "BSc. Medical Imaging", value: "BSc. Medical Imaging" },
  { label: "BSc. Midwifery", value: "BSc. Midwifery" },
  { label: "BSc. Nursing", value: "BSc. Nursing" },
  {
    label: "BSc. Physiotherapy and Sports Science",
    value: "BSc. Physiotherapy and Sports Science",
  },
  {
    label: "Pharm D (Doctor of Pharmacy)",
    value: "Pharm D (Doctor of Pharmacy)",
  },
  {
    label: "BA. Akan Language and Culture",
    value: "BA. Akan Language and Culture",
  },
  { label: "BA. Economics", value: "BA. Economics" },
  { label: "BA. English", value: "BA. English" },
  {
    label: "BA. French and Francophone Studies",
    value: "BA. French and Francophone Studies",
  },
  {
    label: "BA. Geography and Rural Development",
    value: "BA. Geography and Rural Development",
  },
  { label: "BA. History", value: "BA. History" },
  { label: "BA. Linguistics", value: "BA. Linguistics" },
  {
    label: "BA. Media and Communication Studies",
    value: "BA. Media and Communication Studies",
  },
  { label: "BA. Political Studies", value: "BA. Political Studies" },
  {
    label: "Bachelor of Public Administration",
    value: "Bachelor of Public Administration",
  },
  {
    label: "BA. Religious Studies (BA. Religion and Human Development)",
    value: "BA. Religion and Human Development",
  },
  { label: "BA. Sociology", value: "BA. Sociology" },
  { label: "BA. Social Work", value: "BA. Social Work" },
  {
    label: "BSc Business Administration (Human Resource Mgt./Management)",
    value: "BSc Business Administration (Human Resource Mgt./Management)",
  },
  {
    label: "BSc. Business Administration (Marketing/International Business)",
    value: "BSc. Business Administration (Marketing/International Business)",
  },
  {
    label: "BSc. Business Administration (Accounting/Banking and Finance)",
    value: "BSc. Business Administration (Accounting/Banking and Finance)",
  },
  {
    label:
      "BSc. Business Adm. (Logistics and Supply Chain Mgt/Bus. Info. Tech.)",
    value:
      "BSc. Business Adm. (Logistics and Supply Chain Mgt/Bus. Info. Tech.)",
  },
  {
    label: "BSc. Hospitality and Tourism Management",
    value: "BSc. Hospitality and Tourism Management",
  },
  { label: "LLB", value: "LLB" },
  { label: "BSc. Biochemistry", value: "BSc. Biochemistry" },
  {
    label: "BSc. Food Science and Technology",
    value: "BSc. Food Science and Technology",
  },
  { label: "BSc Dietetics", value: "BSc Dietetics" },
  { label: "BSc Human Nutrition", value: "BSc Human Nutrition" },
  { label: "BSc. Biological Science", value: "BSc. Biological Science" },
  {
    label: "BSc. Environmental Sciences",
    value: "BSc. Environmental Sciences",
  },
  { label: "BSc. Chemistry", value: "BSc. Chemistry" },
  { label: "BSc. Computer Science", value: "BSc. Computer Science" },
  {
    label: "BSc. Information Technology (IT)",
    value: "BSc. Information Technology (IT)",
  },
  { label: "BSc. Mathematics", value: "BSc. Mathematics" },
  { label: "BSc. Actuarial Science", value: "BSc. Actuarial Science" },
  { label: "BSc. Statistics", value: "BSc. Statistics" },
  { label: "BSc. Physics", value: "BSc. Physics" },
  {
    label: "BSc. Meteorology and Climate Science",
    value: "BSc. Meteorology and Climate Science",
  },
  { label: "Doctor of Optometry", value: "Doctor of Optometry" },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to check if screen is focused

  const [profileData, setProfileData] = useState({
    firstName: "",
    otherNames: "",
    username: "",
    school: "",
    semester: "",
    year: "",
    programme: "",
  });

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Load data from AsyncStorage when the component mounts or is focused
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("onboardingData");
        if (storedData) {
          setProfileData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
        Alert.alert("Error", "Could not load your profile data.");
      }
    };

    if (isFocused) {
      // Load data only when screen is focused
      loadProfileData();
      // Reset and start animation
      slideAnim.setValue(0);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused]); // Re-run when screen focus changes

  const handleInputChange = (field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateProfileData = () => {
    if (!profileData.firstName.trim()) {
      Alert.alert("Validation Error", "First name is required.");
      return false;
    }
    if (!profileData.otherNames.trim()) {
      Alert.alert("Validation Error", "Other names are required.");
      return false;
    }
    if (!profileData.username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }
    if (!profileData.school) {
      Alert.alert("Validation Error", "School is required.");
      return false;
    }
    if (!profileData.semester) {
      Alert.alert("Validation Error", "Semester is required.");
      return false;
    }
    if (!profileData.year) {
      Alert.alert("Validation Error", "Year/level is required.");
      return false;
    }
    if (!profileData.programme) {
      Alert.alert("Validation Error", "Academic programme is required.");
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateProfileData()) {
      return;
    }

    try {
      await AsyncStorage.setItem("onboardingData", JSON.stringify(profileData));
      console.log("Profile data updated in AsyncStorage:", profileData);
      Alert.alert("Success", "Your profile has been updated!");
      navigation.goBack(); // Go back to Settings screen
    } catch (error) {
      console.error("Failed to save profile data:", error);
      Alert.alert("Error", "Failed to save your profile. Please try again.");
    }
  };

  // Helper function to get label from value for pickers
  const getLabelFromValue = (list, value) => {
    const item = list.find((item) => item.value === value);
    return item ? item.label : "";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: opacityAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              width: "100%",
              paddingHorizontal: 20, // Add padding for content within the animated view
            }}
          >
            {/* First Name */}
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={profileData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>
              Other Names (Middle/Last Name)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your other names"
              value={profileData.otherNames}
              onChangeText={(text) => handleInputChange("otherNames", text)}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              value={profileData.username}
              onChangeText={(text) => handleInputChange("username", text)}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>School</Text>
            <RNPickerSelect
              onValueChange={(value) => handleInputChange("school", value)}
              value={profileData.school}
              items={[
                {
                  label:
                    "KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY (KNUST)",
                  value: "KNUST",
                },
                { label: "UNIVERSITY OF GHANA (UG)", value: "UG" },
                { label: "UNIVERSITY OF CAPE COAST (UCC)", value: "UCC" },
                { label: "ASHESHI UNIVERSITY", value: "ASHESHI" },
              ]}
              placeholder={{ label: "Select your school...", value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              doneText="Select"
            />

            <Text style={styles.inputLabel}>Semester</Text>
            <RNPickerSelect
              onValueChange={(value) => handleInputChange("semester", value)}
              value={profileData.semester}
              items={[
                { label: "Semester 1", value: "Semester 1" },
                { label: "Semester 2", value: "Semester 2" },
              ]}
              placeholder={{ label: "Select a semester...", value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              doneText="Select"
            />

            <Text style={styles.inputLabel}>Year/Level</Text>
            <RNPickerSelect
              onValueChange={(value) => handleInputChange("year", value)}
              value={profileData.year}
              items={[
                { label: "Year 1", value: "Year 1" },
                { label: "Year 2", value: "Year 2" },
                { label: "Year 3", value: "Year 3" },
                { label: "Year 4", value: "Year 4" },
                { label: "Year 5", value: "Year 5" },
                { label: "Year 6", value: "Year 6" },
              ]}
              placeholder={{ label: "Select your year...", value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              doneText="Select"
            />

            <Text style={styles.inputLabel}>Academic Programme</Text>
            <SearchablePicker
              items={programmesList}
              placeholder={{
                label: "Search and select your programme...",
                value: null,
              }}
              onValueChange={(value) => handleInputChange("programme", value)}
              value={profileData.programme}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 3,
    height: 90,
  },
  backButton: {
    marginTop: 24, // Align with headerTitle
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 15,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: "center", // Center content horizontally
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    marginTop: 15,
    alignSelf: "flex-start", // Align label to the left
    paddingLeft: 5, // Small padding to match input
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: "white",
    color: "#333",
    width: "100%", // Ensure input takes full width
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    color: "#333",
    backgroundColor: "white",
    paddingRight: 30, // to ensure the text is not covered by the icon
    width: "100%", // Ensure picker takes full width
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    color: "#333",
    backgroundColor: "white",
    paddingRight: 30, // to ensure the text is not covered by the icon
    width: "100%", // Ensure picker takes full width
    marginBottom: 15,
  },
  placeholder: {
    color: "#999",
  },
});
