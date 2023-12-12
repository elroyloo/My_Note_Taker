import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCQvGkR8vyRjB6YN_DxIpvOqcS4f09UzcU",
  authDomain: "note-taking-app-6c69e.firebaseapp.com",
  projectId: "note-taking-app-6c69e",
  storageBucket: "note-taking-app-6c69e.appspot.com",
  messagingSenderId: "1090337896924",
  appId: "1:1090337896924:web:3ec5cd03fe78bc5f2d3719",
  measurementId: "G-GVF7L9HQZP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);