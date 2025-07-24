import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveReminders = async (reminders) => {
  try {
    const json = JSON.stringify(reminders);
    await AsyncStorage.setItem('reminders', json);
  } catch (err) {
    console.error('Error saving reminders', err);
  }
};

export const loadReminders = async () => {
  try {
    const json = await AsyncStorage.getItem('reminders');
    return json != null ? JSON.parse(json) : [];
  } catch (err) {
    console.error('Error loading reminders', err);
    return [];
  }
};
