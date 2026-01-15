import {
  EmailAuthProvider,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  verifyPasswordResetCode,
} from '@react-native-firebase/auth'

export type AuthUser = ReturnType<typeof getAuth>['currentUser']

export class EmailNotVerifiedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmailNotVerifiedError'
  }
}

export async function signInWithEmail(email: string, password: string) {
  const auth = getAuth()
  const credential = await signInWithEmailAndPassword(auth, email, password)

  await credential.user.reload()

  if (!credential.user.emailVerified) {
    await signOut(auth)
    throw new EmailNotVerifiedError(
      'Please verify your email address before signing in. Check your inbox for the verification email.'
    )
  }

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

export async function resendVerificationEmail(email: string, password: string) {
  const auth = getAuth()
  await signInWithEmailAndPassword(auth, email, password)

  const user = auth.currentUser

  if (!user) {
    throw new Error('No user currently signed in')
  }

  await user.sendEmailVerification()

  await signOut(auth)

  return true
}

export async function reauthenticateUser(password: string) {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user || !user.email) {
    throw new Error('No user currently signed in')
  }

  const credential = EmailAuthProvider.credential(user.email, password)
  await reauthenticateWithCredential(user, credential)
}

export async function updateUserPassword(password: string) {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('No user currently signed in')
  }

  await updatePassword(user, password)
}
