import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  verifyPasswordResetCode,
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

  await credential.user.sendEmailVerification()

  return credential.user
}

export async function signOutUser() {
  const auth = getAuth()

  await signOut(auth)
}

export async function sendPasswordReset(email: string) {
  const auth = getAuth()

  await sendPasswordResetEmail(auth, email)
}

export async function verifyResetCode(code: string) {
  const auth = getAuth()

  const email = await verifyPasswordResetCode(auth, code)

  return email
}

export async function resetPassword(code: string, newPassword: string) {
  const auth = getAuth()

  await confirmPasswordReset(auth, code, newPassword)
}
