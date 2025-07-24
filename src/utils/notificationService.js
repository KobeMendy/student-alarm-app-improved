// src/utils/notificationService.js
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { format } from "date-fns";

// Ask for permissions to send notifications
export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const scheduleReminderNotifications = async (reminder) => {
  const granted = await requestPermissions();
  if (!granted) return;

  const reminderDate = new Date(reminder.date);

  // 1. Schedule One-Time Notification at reminder date/time
  const oneTimeId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Reminder",
      body: `${reminder.title} (${reminder.category || "General"}) is due now!`,
      sound: true,
    },
    trigger: reminderDate,
  });

  // 2. Schedule a 3-day-before notification
  const threeDaysBefore = new Date(reminderDate);
  threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

  // Only schedule 3-day alert if in the future
  let alertId = null;
  if (threeDaysBefore > new Date()) {
    alertId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Heads up!",
        body: `${reminder.title} is due in 3 days (${format(
          reminderDate,
          "PP"
        )})`,
        sound: true,
      },
      trigger: threeDaysBefore,
    });
  }

  return { oneTimeId, alertId };
};

// Cancel both types of scheduled notifications
export const cancelReminderNotifications = async (ids) => {
  if (!ids) return;
  if (ids.oneTimeId)
    await Notifications.cancelScheduledNotificationAsync(ids.oneTimeId);
  if (ids.alertId)
    await Notifications.cancelScheduledNotificationAsync(ids.alertId);
};
