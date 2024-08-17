// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  apiKey,
  appId,
  authDomain,
  messagingSenderId,
  projectId,
  storageBucket,
} from './Config.js'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Firestore and Authentication
export const db = getFirestore(app)
export const auth = getAuth(app)
export const Storage = getStorage(app)
