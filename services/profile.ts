import { getAuth, updateProfile } from '@react-native-firebase/auth'
import {
  Timestamp,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export interface UserProfile {
  displayName: string | null
  email: string | null
  photoURL: string | null
  bio?: string
  updatedAt: FirebaseFirestoreTypes.Timestamp
}

export interface ProfileUpdateData {
  displayName?: string
  bio?: string
  photoURL?: string
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to get profile')
  }

  const db = getFirestore()
  const profileRef = doc(db, 'users', user.uid, 'profile', 'data')

  try {
    const profileDoc = await getDoc(profileRef)

    if (!profileDoc.exists()) {
      // Return profile from auth if no Firestore profile exists
      return {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        bio: '',
        updatedAt: Timestamp.now(),
      }
    }

    const data = profileDoc.data()
    if (!data) {
      // Return profile from auth if data is undefined
      return {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        bio: '',
        updatedAt: Timestamp.now(),
      }
    }

    return {
      displayName: data.displayName ?? user.displayName,
      email: user.email,
      photoURL: data.photoURL ?? user.photoURL,
      bio: data.bio ?? '',
      updatedAt: data.updatedAt as FirebaseFirestoreTypes.Timestamp,
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

/**
 * Update user profile in both Auth and Firestore
 */
export async function updateUserProfile(
  data: ProfileUpdateData
): Promise<void> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to update profile')
  }

  const db = getFirestore()
  const profileRef = doc(db, 'users', user.uid, 'profile', 'data')

  // Update Firebase Auth profile
  const authUpdates: { displayName?: string; photoURL?: string } = {}
  if (data.displayName !== undefined) {
    authUpdates.displayName = data.displayName
  }
  if (data.photoURL !== undefined) {
    authUpdates.photoURL = data.photoURL
  }

  if (Object.keys(authUpdates).length > 0) {
    await updateProfile(user, authUpdates)
  }

  // Update Firestore profile
  const firestoreUpdates: {
    displayName?: string
    bio?: string
    photoURL?: string
    updatedAt: FirebaseFirestoreTypes.FieldValue
  } = {
    updatedAt: serverTimestamp(),
  }

  if (data.displayName !== undefined) {
    firestoreUpdates.displayName = data.displayName
  }
  if (data.bio !== undefined) {
    firestoreUpdates.bio = data.bio
  }
  if (data.photoURL !== undefined) {
    firestoreUpdates.photoURL = data.photoURL
  }

  // Use setDoc with merge to create if doesn't exist, or update if it does
  await setDoc(profileRef, firestoreUpdates, { merge: true })
}
