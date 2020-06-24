import { useState, useEffect } from "react";
import { getData, removeData, addEvent } from "@react-native-advanced/core";
import { Platform } from "react-native";
import Deferred from "es6-deferred";
import useAsyncEffect from "@raydeck/useasynceffect";
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
const getInitialNotificationAction = async () => {
  if (typeof notification !== "undefined") return notification;
  const { promise, resolve } = new Deferred();
  waiters.push(resolve);
  return await promise;
};
let notificationActionListeners = [];
addEvent("notificationAction", "counselor", (data) => {
  notificationActionListeners.map((listener) => listener(data));
  console.log("Got callback from notificationAction", data);
});

const useNotificationAction = () => {
  const [notificationAction, setNotificationAction] = useState(
    notificationAction
  );
  useAsyncEffect(async () => {
    const n = await getInitialNotificationAction();
    if (n) {
      setNotificationAction(n);
    }
  }, []);
  useEffect(() => {
    notificationActionListeners.push(setNotificationAction);
    return () => {
      notifcationActionListeners = notificationActionListeners.filter(
        (listener) => listener !== setNotificationAction
      );
    };
  }, []);
  return notificationAction;
};
export { getInitialNotificationAction, useNotificationAction };
