import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { differenceInDays, addDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const scheduleObligationNotifications = async (obligation) => {
  const granted = await requestPermissions();
  if (!granted) return;

  const deadlineDate = new Date(obligation.deadline);
  const now = new Date();
  const daysUntilDeadline = differenceInDays(deadlineDate, now);
  const notificationIds = [];

  const scheduleNotification = async (body, time, repeatInterval) => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Financial Obligation Alert: ${obligation.title}`,
        body,
        sound: true,
      },
      trigger: {
        date: time,
        repeats: repeatInterval,
      },
    });
    return id;
  };

  const scheduleRepeatingNotification = async (body, intervalDays) => {
    const triggerDate = new Date();
    triggerDate.setDate(now.getDate() + 1);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Financial Obligation Alert: ${obligation.title}`,
        body,
        sound: true,
      },
      trigger: {
        date: triggerDate,
        repeats: true,
        channelId: uuidv4(),
      },
    });
    return id;
  };

  if (daysUntilDeadline > 5) {
    const firstNotificationTime = new Date();
    firstNotificationTime.setDate(now.getDate() + 1);
    const id = await scheduleNotification(
      `Your payment for ${
        obligation.title
      } is due on ${deadlineDate.toDateString()}.`,
      firstNotificationTime,
      "daily"
    );
    notificationIds.push(id);
  } else if (daysUntilDeadline === 5) {
    const id = await scheduleNotification(
      `Your payment for ${obligation.title} is due in 5 days!`,
      addDays(now, 1),
      "daily"
    );
    notificationIds.push(id);
  } else if (daysUntilDeadline < 3 && daysUntilDeadline >= 0) {
    const firstNotificationTime = new Date();
    firstNotificationTime.setHours(9, 0, 0);

    if (firstNotificationTime < now) {
      firstNotificationTime.setDate(now.getDate() + 1);
    }
    const id1 = await scheduleNotification(
      `URGENT: ${obligation.title} is due in less than 3 days! Pay now.`,
      firstNotificationTime,
      "daily"
    );
    notificationIds.push(id1);

    const secondNotificationTime = new Date();
    secondNotificationTime.setHours(17, 0, 0);

    if (secondNotificationTime < now) {
      secondNotificationTime.setDate(now.getDate() + 1);
    }
    const id2 = await scheduleNotification(
      `FINAL REMINDER: ${obligation.title} is due soon!`,
      secondNotificationTime,
      "daily"
    );
    notificationIds.push(id2);
  }

  return notificationIds;
};

export const cancelObligationNotifications = async (ids) => {
  if (!ids || ids.length === 0) return;
  for (const id of ids) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
};
