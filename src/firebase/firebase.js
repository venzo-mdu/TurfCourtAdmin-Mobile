// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getDatabase} from 'firebase/database';
import {getStorage} from 'firebase/storage';
import {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
} from '@env';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyCbAHuyLzXWGP0YpGdyKAUMhDxNuMNQmM8',
  authDomain: 'venzoturfbooking.firebaseapp.com',
  databaseURL:
    'https://venzoturfbooking-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'venzoturfbooking',
  storageBucket: 'venzoturfbooking.appspot.com',
  messagingSenderId: '744304593354',
  appId: '1:744304593354:web:83703623a3b45435296733',
  measurementId: 'G-2K9NZS11N9',
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
