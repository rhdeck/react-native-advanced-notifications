import { getData, removeData } from "@react-native-advanced/core";
import { Platform } from "react-native";
import Deferred from "es6-deferred";
let notification;
let waiters = [];
if (Platform.OS === "react-native") {
  setTimeout(async () => {
    try {
      const stuff = await getData("startingNotificationAction");
      removeData("startingNotificationAction");
      notification = stuff;
    } catch (e) {
      notification = null;
    }
    waiters.map((waiter) => waiter(notification));
    waiters = [];
  }, 500);
} else {
  notification = null;
}
const getInitialNotification = async () => {
  if (typeof notification !== "undefined") return notification;
  const { promise, resolve } = new Deferred();
  waiters.push(resolve);
  return await promise;
};
export { getInitialNotification };
