import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
// Firebase config
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId,
  databaseURL: Constants.expoConfig.extra.databaseURL,
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
export const functions = getFunctions(); 
export const storage = getStorage();
export const firestore = getFirestore();
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import Constants from "expo-constants";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   getReactNativePersistence,
//   initializeAuth,
// } from "firebase/auth";
// // Firebase config
// const firebaseConfig = {
//   apiKey: Constants.expoConfig.extra.apiKey,
//   authDomain: Constants.expoConfig.extra.authDomain,
//   projectId: Constants.expoConfig.extra.projectId,
//   storageBucket: Constants.expoConfig.extra.storageBucket,
//   messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
//   appId: Constants.expoConfig.extra.appId,
//   databaseURL: Constants.expoConfig.extra.databaseURL,
//   //   @deprecated is deprecated Constants.manifest
// };
// // initialize firebase
// initializeApp(firebaseConfig);
// //export const auth = getAuth();
// export const database = getFirestore();
// export const auth = initializeAuth(firebaseConfigy, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });