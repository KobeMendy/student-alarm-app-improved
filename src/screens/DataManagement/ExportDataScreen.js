import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function ExportDataScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [exportPreview, setExportPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    background: theme === "light" ? "#f5f5f5" : "#1a1a1a",
    cardBackground: theme === "light" ? "#fff" : "#2a2a2a",
    text: theme === "light" ? "#333" : "#f5f5f5",
    subText: theme === "light" ? "#666" : "#ccc",
    border: theme === "light" ? "#eee" : "#444",
    primary: "#667eea",
    headerIcon: theme === "light" ? "#333" : "#f5f5f5",
  };

  const generateMockExportPreview = () => {
    setIsLoading(true);
    setExportPreview("");

    // Simulate a brief loading time
    setTimeout(() => {
      const mockData = `--- StudentFlow Data Export ---

User Profile:
  Name: John Doe
  Student ID: S12345678
  University: University of Ghana
  Current Semester: 2024/2025 - Semester 1

Reminders:
  - Title: Submit Project Proposal
    Date: 2025-08-15 17:00
    Type: Academic
    Priority: High
  - Title: Pay Library Fine
    Date: 2025-09-01 10:00
    Type: Fees
    Priority: Medium
  - Title: Group Meeting for Research
    Date: 2025-08-20 14:30
    Type: Others
    Priority: Low

Financial Obligations:
  - Description: Tuition Fee Payment
    Amount: GHS 2500.00
    Due Date: 2025-08-30
    Status: Outstanding
  - Description: Internet Bill
    Amount: GHS 150.00
    Due Date: 2025-08-10
    Status: Paid

Academic Calendar Events:
  - Event: Mid-Semester Exams
    Date: 2025-10-01 to 2025-10-07
  - Event: Semester Break
    Date: 2025-12-20 to 2026-01-05
  - Event: Course Registration for Semester 2
    Date: 2025-11-15

--- End of Export ---`;
      setExportPreview(mockData);
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading
  };

  return (
    <SafeAreaView style={styles.safeArea(colors, Platform.OS)}>
      <View style={styles.header(colors)}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle(colors)}>Export My Data</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.infoText(colors)}>
          Here you can generate a preview of your app data. This includes your
          profile information, reminders, financial obligations, and academic
          calendar events.
        </Text>
        <Text style={styles.infoText(colors)}>
          Click the button below to generate a sample of your exportable data.
        </Text>

        <TouchableOpacity
          style={styles.generateButton(colors)}
          onPress={generateMockExportPreview}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateButtonText}>
              Generate Export Preview
            </Text>
          )}
        </TouchableOpacity>

        {exportPreview ? (
          <View style={styles.previewContainer(colors)}>
            <Text style={styles.previewTitle(colors)}>Export Preview:</Text>
            <ScrollView style={styles.previewScrollView}>
              <Text style={styles.previewText(colors)}>{exportPreview}</Text>
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: (colors, platformOS) => ({
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: platformOS === "android" && 0,
  }),
  header: (colors) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBackground,
    width: "100%",
    marginTop: 3,
    height: 90,
  }),
  backButton: {
    paddingTop: 24,
  },
  headerTitle: (colors) => ({
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 24,
    color: colors.text,
  }),
  placeholder: {
    width: 24,
    paddingTop: 24,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoText: (colors) => ({
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  }),
  generateButton: (colors) => ({
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  }),
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContainer: (colors) => ({
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 200,
  }),
  previewTitle: (colors) => ({
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  }),
  previewScrollView: {
    flexGrow: 1,
  },
  previewText: (colors) => ({
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  }),
});
