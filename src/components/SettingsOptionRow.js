import React from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

const SettingsOptionRow = ({
  label,
  onPress,
  isSwitch = false,
  switchValue,
  onToggleSwitch,
  rightText,
  showChevron = false,
}) => {
  const { theme } = useTheme(); // Consume theme context

  // Define colors based on the current theme
  const colors = {
    cardBackground: theme === "light" ? "#fff" : "#2a2a2a",
    text: theme === "light" ? "#333" : "#f5f5f5",
    subText: theme === "light" ? "#6b7280" : "#ccc",
    border: theme === "light" ? "#e0e0e0" : "#444",
    switchThumb: theme === "light" ? "#fff" : "#eee",
    switchTrackOn: theme === "light" ? "#4f46e5" : "#667eea",
    switchTrackOff: theme === "light" ? "#e0e0e0" : "#666",
    chevronColor: theme === "light" ? "#6b7280" : "#ccc",
  };

  const dynamicStyles = StyleSheet.create({
    optionRow: {
      backgroundColor: colors.cardBackground,
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: theme === "light" ? "#000" : "#000", // Shadow might be less prominent in dark mode
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme === "light" ? 0.05 : 0.2, // Adjust shadow opacity for dark mode
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1, // Add border to make it visible in dark mode
      borderColor: colors.border, // Border color adapts
    },
    optionRowContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 1,
    },
    optionLabel: {
      fontSize: 15,
      color: colors.text, // Text color adapts
      flex: 1,
    },
    rightText: {
      fontSize: 14,
      color: colors.subText, // Text color adapts
      marginRight: 5,
    },
  });

  const content = (
    <View style={dynamicStyles.optionRowContent}>
      <Text style={dynamicStyles.optionLabel}>{label}</Text>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onToggleSwitch}
          trackColor={{
            false: colors.switchTrackOff,
            true: colors.switchTrackOn,
          }}
          thumbColor={colors.switchThumb}
          ios_backgroundColor={colors.switchTrackOff} // For iOS specific background when off
        />
      ) : rightText ? (
        <Text style={dynamicStyles.rightText}>{rightText}</Text>
      ) : showChevron ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.chevronColor}
        /> // Chevron color adapts
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={dynamicStyles.optionRow} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={dynamicStyles.optionRow}>{content}</View>;
};

export default SettingsOptionRow;
