import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native"; // Hook to detect system theme

// Create the Theme Context
export const ThemeContext = createContext({
  theme: "light", // Default theme
  toggleTheme: () => {}, // Function to toggle theme
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || "light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme");
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          setTheme(systemColorScheme || "light");
        }
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage:", error);
        setTheme(systemColorScheme || "light");
      }
    };

    loadTheme();
  }, [systemColorScheme]); // Re-run if systemColorScheme changes (e.g., user changes system theme)

  // Save theme preference to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("appTheme", theme);
      } catch (error) {
        console.error("Failed to save theme to AsyncStorage:", error);
      }
    };

    saveTheme();
  }, [theme]);

  // Function to toggle between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily consume the theme context
export const useTheme = () => useContext(ThemeContext);
