import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth'

export type AuthUser = ReturnType<typeof getAuth>['currentUser']

export async function signInWithEmail(email: string, password: string) {
  const auth = getAuth()

  const credential = await signInWithEmailAndPassword(auth, email, password)

  return credential.user
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
) {
  const auth = getAuth()

  const credential = await createUserWithEmailAndPassword(auth, email, password)

  if (name) {
    await updateProfile(credential.user, { displayName: name })
  }

  return credential.user
}

export async function signOutUser() {
  const auth = getAuth()

  await signOut(auth)
}
