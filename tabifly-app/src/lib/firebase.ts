import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Colle ici les MÊMES valeurs que celles utilisées dans le prototype web
// (Firebase > Paramètres du projet > Général > Vos applications).
const firebaseConfig = {
  apiKey: "AIzaSyAzzSSeIuoASs-rFETmG_yILVQ4ewDZ8u8",
  authDomain: "tabifly.firebaseapp.com",
  projectId: "tabifly",
  storageBucket: "tabifly.firebasestorage.app",
  messagingSenderId: "299925233483",
  appId: "1:299925233483:web:cd94631b4368d66a0dd2ce",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export function signIn(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth).then((cred) => resolve(cred.user)).catch(reject);
      }
    });
  });
}

export { doc, getDoc, setDoc, serverTimestamp };
