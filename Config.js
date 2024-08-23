import 'dotenv/config'
const Port = process.env.Port
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY
const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
const storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
const appId = process.env.REACT_APP_FIREBASE_APP_ID
const Gemni_Api = process.env.Google_Gemni_APi

export {
  Port,
  apiKey,
  appId,
  authDomain,
  storageBucket,
  messagingSenderId,
  Gemni_Api,
  projectId,
}
