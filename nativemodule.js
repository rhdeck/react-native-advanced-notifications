import { NativeModules, NativeEventEmitter } from "react-native";
const rnins_native = NativeModules.rnins;

const rnins = {
  nativeObj: rnins_native,
  a: rnins_native.a,
  b: rnins_native.b,
  startTime: rnins_native.startTime,
  addListener: cb => {
    const e = new NativeEventEmitter(rnins_native);
    const s = e.addListener("rnins", cb);
    return s;
  },
  addListenerDemo: () => {
    rnins.addListener(arr => {
      console.log("Received a rnins event", arr.message);
    });
  },
  emitMessage: async (message, delayms) => {
    if (!delayms) delayms = 0;
    return await rnins_native.delayedSend(message, delayms);
  },
  demoWithPromise: async message => {
    //Returns a promise!
    const output = await rnins_native.demo(message);
    return output;
  }
};

export default rnins;
