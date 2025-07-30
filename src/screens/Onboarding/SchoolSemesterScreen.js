import React, { useState, useRef, useEffect } from "react";
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
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ChevronRight,
  User,
  GraduationCap,
  Calendar,
  BookOpen,
  School,
} from "lucide-react-native";
import RNPickerSelect from "react-native-picker-select";
import SearchablePicker from "../../components/SearchablePicker"; // This import is crucial
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function SchoolSemesterScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    firstName: "",
    otherNames: "",
    username: "",
    school: "",
    semester: "",
    year: "",
    programme: "",
  });

  // For animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [currentStep]);

  // Ref for the second input in the merged step
  const otherNamesInputRef = useRef(null);

  const validateStep = () => {
    const currentStepData = steps[currentStep];

    if (currentStepData.type === "namesInput") {
      if (!userData.firstName.trim()) {
        Alert.alert("Validation Error", "Please enter your first name.");
        return false;
      }
      if (!userData.otherNames.trim()) {
        Alert.alert("Validation Error", "Please enter your other names.");
        return false;
      }
    } else {
      const currentValue = userData[currentStepData.field];
      if (
        !currentValue ||
        (typeof currentValue === "string" && currentValue.trim().length === 0)
      ) {
        let fieldName = "";
        switch (currentStepData.field) {
          case "username":
            fieldName = "username";
            break;
          case "school":
            fieldName = "school";
            break;
          case "semester":
            fieldName = "semester";
            break;
          case "year":
            fieldName = "year";
            break;
          case "programme":
            fieldName = "academic programme";
            break;
          default:
            fieldName = currentStepData.field;
        }
        Alert.alert("Validation Error", `Please enter your ${fieldName}.`);
        return false;
      }
    }
    return true;
  };

  const steps = [
    {
      title: "What's your full name?",
      subtitle: "Enter your first and other names(Middle/LastName🎓)",
      icon: <User size={60} color="#667eea" />,
      type: "namesInput", // Custom type for this merged step
      fields: ["firstName", "otherNames"], // Array of fields for this step
      placeholders: {
        firstName: " FirstName",
        otherNames: " Other Names",
      },
    },
    {
      title: "Choose a username",
      subtitle: "This will be displayed in the app",
      icon: <User size={60} color="#667eea" />,
      field: "username",
      placeholder: "username",
      type: "text",
    },
    {
      title: "Which school do you attend?",
      subtitle: "This helps us customize academic features",
      icon: <GraduationCap size={60} color="#667eea" />,
      field: "school",
      type: "picker",
      items: [
        {
          label: "KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY (KNUST)",
          value: "KNUST",
        },
        { label: "UNIVERSITY OF GHANA (UG)", value: "UG" },
        { label: "UNIVERSITY OF CAPE COAST (UCC)", value: "UCC" },
        { label: "ASHESHI UNIVERSITY", value: "ASHESHI" },
      ],
      placeholder: { label: "Select your school...", value: null },
    },
    {
      title: "What semester are you in?",
      subtitle: "Current semester and academic year",
      icon: <Calendar size={60} color="#667eea" />,
      field: "semester",
      type: "picker",
      items: [
        { label: "Semester 1", value: "Semester 1" },
        { label: "Semester 2", value: "Semester 2" },
      ],
      placeholder: { label: "Select a semester...", value: null },
    },
    {
      title: "What year/level are you in?",
      subtitle: "This helps us tailor content to your academic stage",
      icon: <School size={60} color="#667eea" />,
      field: "year",
      type: "picker",
      items: [
        { label: "Year 1", value: "Year 1" },
        { label: "Year 2", value: "Year 2" },
        { label: "Year 3", value: "Year 3" },
        { label: "Year 4", value: "Year 4" },
        { label: "Year 5", value: "Year 5" },
        { label: "Year 6", value: "Year 6" },
      ],
      placeholder: { label: "Select your year...", value: null },
    },
    {
      title: "What's your academic programme?",
      subtitle: "Helps us provide relevant course information",
      icon: <BookOpen size={60} color="#667eea" />,
      field: "programme",
      type: "searchablePicker", // Changed back to searchablePicker
      items: programmesList,
      placeholder: {
        label: "Search and select your programme...", // Updated placeholder
        value: null,
      },
    },
  ];

  const handleNext = async () => {
    if (!validateStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await AsyncStorage.setItem("onboardingData", JSON.stringify(userData));
        console.log("User data saved to AsyncStorage:", userData);
        navigation.navigate("Main");
      } catch (error) {
        console.error("Error saving onboarding data:", error);
        Alert.alert("Error", "Failed to save your data. Please try again.");
      }
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const isStepComplete = () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.type === "namesInput") {
      return (
        userData.firstName.trim().length > 0 &&
        userData.otherNames.trim().length > 0
      );
    } else {
      const currentValue = userData[currentStepData.field];
      if (typeof currentValue === "string") {
        return currentValue.trim().length > 0;
      }
      return currentValue !== null && currentValue !== undefined;
    }
  };

  const currentStepData = steps[currentStep];

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStep ? styles.progressDotActive : null,
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepText}>
          Step {currentStep + 1} of {steps.length}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: opacityAnim,
            transform: [{ translateY: translateY }],
            width: "100%",
            alignItems: "center",
          }}
        >
          <View style={styles.iconContainer}>{currentStepData.icon}</View>

          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>

          <View style={styles.inputContainer}>
            {currentStepData.type === "namesInput" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder={currentStepData.placeholders.firstName}
                  value={userData.firstName}
                  onChangeText={(text) => handleInputChange("firstName", text)}
                  placeholderTextColor="#999"
                  keyboardType="default"
                  returnKeyType="next"
                  onSubmitEditing={() => otherNamesInputRef.current?.focus()}
                />
                <TextInput
                  ref={otherNamesInputRef}
                  style={styles.input}
                  placeholder={currentStepData.placeholders.otherNames}
                  value={userData.otherNames}
                  onChangeText={(text) => handleInputChange("otherNames", text)}
                  placeholderTextColor="#999"
                  keyboardType="default"
                  returnKeyType="done"
                />
              </>
            ) : currentStepData.type === "text" ? (
              <TextInput
                style={styles.input}
                placeholder={currentStepData.placeholder}
                value={userData[currentStepData.field]}
                onChangeText={(text) =>
                  handleInputChange(currentStepData.field, text)
                }
                placeholderTextColor="#999"
                keyboardType="default"
                returnKeyType="done"
              />
            ) : currentStepData.type === "picker" ? (
              <RNPickerSelect
                onValueChange={(value) =>
                  handleInputChange(currentStepData.field, value)
                }
                value={userData[currentStepData.field]}
                items={currentStepData.items}
                placeholder={currentStepData.placeholder}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                doneText="Select"
              />
            ) : currentStepData.type === "searchablePicker" ? (
              <SearchablePicker
                items={currentStepData.items}
                placeholder={currentStepData.placeholder}
                onValueChange={(value) =>
                  handleInputChange(currentStepData.field, value)
                }
                value={userData[currentStepData.field]}
              />
            ) : null}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !isStepComplete() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!isStepComplete()}
        >
          <Text
            style={[
              styles.nextText,
              !isStepComplete() && styles.nextTextDisabled,
            ]}
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </Text>
          <ChevronRight size={20} color={isStepComplete() ? "white" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: "#667eea",
  },
  stepText: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    paddingBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
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
    marginBottom: 15, // Added margin for spacing between new input fields
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
    backgroundColor: "#f8f9fa",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  nextButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  nextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 5,
  },
  nextTextDisabled: {
    color: "#ccc",
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
    paddingRight: 30,
    marginBottom: 15, // Added margin for spacing between picker and next input
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
    paddingRight: 30,
    marginBottom: 15, // Added margin
  },
  placeholder: {
    color: "#999",
  },
});
