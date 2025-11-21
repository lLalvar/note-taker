import { type FirebaseApp, getApps, initializeApp } from 'firebase/app'
import { type Auth, getAuth } from 'firebase/auth'

// Firebase configuration
// For Expo, we use the web SDK which works across all platforms
const firebaseConfig = {
  apiKey: 'AIzaSyBCD-QUaJ9ZxOmOj-FspdH4xo0NF_FPnfg',
  authDomain: 'note-taker-d9c88.firebaseapp.com',
  projectId: 'note-taker-d9c88',
  storageBucket: 'note-taker-d9c88.firebasestorage.app',
  messagingSenderId: '611802169319',
  appId: '1:611802169319:web:5bc6211a5b8396f91dc742',
}

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Auth
export const auth: Auth = getAuth(app)

// Export app instance if needed elsewhere
export { app }
