import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, StackActions } from "@react-navigation/native";
import {
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
} from "lucide-react-native";

export default function UploadCalendar() {
  const navigation = useNavigation();
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [selectedFileName, setSelectedFileName] = useState(null);

  const pickDocument = async () => {
    setUploadStatus("idle");
    setSelectedFileName(null);

    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/csv"],
      });

      if (result.canceled) {
        setUploadStatus("idle");
        setSelectedFileName(null);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFileName(asset.name);
        setUploadStatus("success");

        // In a real app, you would now process or upload 'asset.uri'
        // For now, we'll simulate success and then navigate
        Alert.alert("Upload Success", `Selected file: ${asset.name}`, [
          {
            text: "OK",
            onPress: () =>
              navigation.dispatch(StackActions.replace("Calendar")), // Navigate to Calendar and replace
          },
        ]);
      } else {
        setUploadStatus("error");
        Alert.alert(
          "Upload Failed",
          "No file was selected or an unknown error occurred."
        );
      }
    } catch (error) {
      console.error("Error picking document: ", error);
      setUploadStatus("error");
      Alert.alert("Upload Error", "Failed to pick document. Please try again.");
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "success":
        return <CheckCircle size={24} color="#10b981" />;
      case "error":
        return <AlertCircle size={24} color="#ef4444" />;
      default:
        return <Upload size={24} color="#667eea" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case "success":
        return "File selected successfully!";
      case "error":
        return "File selection failed. Please try again.";
      default:
        return "Select a file to upload";
    }
  };

  const supportedFormats = [
    { name: "CSV File", description: "Comma-separated values format" },
    {
      name: "PDF File",
      description: "A clear and visible pdf contents format",
    },
  ];

  const fileManagerInstructions = [
    "Open your file manager",
    "Locate documents",
    "Choose your PDF or CSV file",
    "Upload the selected file",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Upload Academic Calendar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.introSection}>
          <Calendar size={48} color="#667eea" />
          <Text style={styles.introTitle}>Import Your Academic Calendar</Text>
          <Text style={styles.introText}>
            Upload your school's academic calendar to automatically add
            important dates, deadlines, and events to your personal schedule.
          </Text>
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity
            style={[
              styles.uploadArea,
              uploadStatus === "success" && styles.uploadAreaSuccess,
              uploadStatus === "error" && styles.uploadAreaError,
            ]}
            onPress={pickDocument}
          >
            <View style={styles.uploadIcon}>{getStatusIcon()}</View>
            <Text
              style={[
                styles.uploadTitle,
                uploadStatus === "success" && styles.successText,
                uploadStatus === "error" && styles.errorText,
              ]}
            >
              {getStatusText()}
            </Text>
            {selectedFileName && (
              <Text style={styles.fileName}>{selectedFileName}</Text>
            )}
            {uploadStatus === "idle" && (
              <Text style={styles.uploadSubtitle}>Tap to browse files</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formatsSection}>
          <Text style={styles.sectionTitle}>Supported Formats</Text>
          {supportedFormats.map((format, index) => (
            <View key={index} style={styles.formatItem}>
              <FileText size={20} color="#667eea" />
              <View style={styles.formatContent}>
                <Text style={styles.formatName}>{format.name}</Text>
                <Text style={styles.formatDescription}>
                  {format.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>How to Export Your Calendar</Text>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>From File Manager:</Text>
            <View style={styles.numberedList}>
              {fileManagerInstructions.map((instruction, index) => (
                <Text key={index} style={styles.instructionText}>
                  {index + 1}. {instruction}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.noteSection}>
          <AlertCircle size={16} color="#f59e0b" />
          <Text style={styles.noteText}>
            Your calendar data is processed locally and securely. We don't store
            your calendar files on our servers.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "android" && 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 35,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  uploadSection: {
    marginBottom: 40,
  },
  uploadArea: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadAreaSuccess: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  uploadAreaError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  successText: {
    color: "#10b981",
  },
  errorText: {
    color: "#ef4444",
  },
  fileName: {
    fontSize: 14,
    color: "#667eea",
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  formatsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  formatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formatContent: {
    marginLeft: 12,
    flex: 1,
  },
  formatName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  formatDescription: {
    fontSize: 14,
    color: "#666",
  },
  instructionsSection: {
    marginBottom: 40,
  },
  instructionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  numberedList: {
    paddingLeft: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  noteSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  noteText: {
    fontSize: 14,
    color: "#92400e",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});
