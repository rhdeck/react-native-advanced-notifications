#!/usr/bin/env node
const Path = require("path");
const linkXcodeProject = require("./linkXcodeProject");
const thisPath = Path.join(
  process.cwd(),
  "node_modules",
  "react-native",
  "Libraries",
  "PushNotificationIOS",
  "RCTPushNotification.xcodeproj"
);
linkXcodeProject(thisPath);
console.log("Done writing the filePath");
