#!/usr/bin/env node
//Locate
const Path = require("path");
const fs = require("fs");
const glob = require("glob");
const PBXProject = require("xcode");
const PBXFile = require("xcode/lib/PBXFile");
const getTargets = require("react-native/local-cli/link/ios/getTargets");

const pwd = process.cwd();
const g = Path.join(pwd, "ios", "**", "*.xcodeproj", "project.pbxproj");
const gs = glob.sync(g);
if (!gs || !gs.length) {
  console.log("I cannot find the Xcode project file");
  process.exit();
}
const projPath = gs.shift();
const thisPath = Path.join(
  pwd,
  "node_modules",
  "react-native",
  "Libraries",
  "PushNotificationIOS",
  "RCTPushNotification.xcodeproj"
);
const thisProjectPath = Path.join(thisPath, "project.pbxproj");
if (!fs.existsSync(thisPath)) {
  console.log("Could not find push notification project: ", thisPath);
  process.exit();
}

var p = PBXProject.project(projPath).parseSync();
var d = PBXProject.project(thisProjectPath).parseSync();

//Create Library
//Check for library
const pfp = p.getFirstProject().firstProject;
var group = p.getPBXGroupByKey(pfp.mainGroup);
const libGroupObj = group.children.find(g => g.comment === "Libraries");
var libGroup;
if (libGroupObj) {
  libGroup = p.getPBXGroupByKey(libGroupObj.value);
}

//Add File reference
const file = new PBXFile(Path.relative(Path.join(pwd, "ios"), thisPath));
file.uuid = p.generateUuid();
file.fileRef = p.generateUuid();
console.log("I am adding a file", file);
p.addToPbxFileReferenceSection(file);

//Add to libraries group
libGroup.children.push({ value: file.fileRef, comment: file.basename });

const pts = getTargets(p);
// Add SL to my targets
getTargets(d).forEach((dt, i) => {
  console.log("Working with dependency target", dt.name);
  pts.forEach(t => {
    console.log("working with parent target ", t.name);
    if (dt.isTVOS == t.isTVOS) {
      console.log("These match, let's add the target", dt.name, t.uuid);
      p.addStaticLibrary(dt.name, { target: t.uuid });
    }
  });
});
const out = p.writeSync();
fs.writeFileSync(Path.join(pwd, "test.pbxproj"));
//process.exit();

fs.writeFileSync(projPath, out);
console.log("Done writing the filePath");
