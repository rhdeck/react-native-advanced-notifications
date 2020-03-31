import Foundation


//Note that for objective-c (and therefore RN) to see the class you need to give the @objc hint
//Also, any method exposed to objective-c runtime will also require the hint.
@objc(rnins)
class rnins: NSObject {
    override init() {
        //Force connection with IOSPush
        let _ = RNSMainRegistry.addEvent(type: "app.didRegisterForRemoteNotifications", key: "RNINS") { data in
            guard let token = data as? Data else { return false }
            RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: token);
            return true
        }
        let _ = RNSMainRegistry.addEvent(type: "app.didRegisterUserNotificationSettings", key: "RNINS") {data in
            guard let ns = data as? UIUserNotificationSettings else { return false}
            RNCPushNotificationIOS.didRegister(ns)
            return true
        }
        let _ = RNSMainRegistry.addEvent(type: "app.didReceiveRemoteNotification", key: "RNINS") { data in
            guard let n = data as? [String: Any?] else { return false }
            RNCPushNotificationIOS.didReceiveRemoteNotification(n)
            return true
        }
        let _ = RNSMainRegistry.addEvent(type: "app.didFailToRegisterForRemoteNotifications", key: "RNINS") { data in
            guard let e = data as? Error else { return false }
            RNCPushNotificationIOS.didFailToRegisterForRemoteNotificationsWithError(e)
            return true
        }
        let _ = RNSMainRegistry.addEvent(type: "app.didReceiveLocalNotification", key: "RNINS") { data in
            guard let n = data as? UILocalNotification else { return false }
            RNCPushNotificationIOS.didReceive(n)
            return true
        }
    }
    @objc func noop() {
        //No-op function
    }
    class func requiresMainQueueSetup() -> Bool {
        return true;
    }
}
