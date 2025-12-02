import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth'
import {
  GoogleSignin,
  type SignInResponse,
} from '@react-native-google-signin/google-signin'

// Configure Google Sign-In.
GoogleSignin.configure({
  webClientId:
    '611802169319-3reqf7lhaaep2fcc35olk7c37imah0sp.apps.googleusercontent.com',
})

export async function signInWithGoogle() {
  // Ensure the device supports Google Play services
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

  // Perform Google Sign-In and obtain the response
  const signInResult: SignInResponse = await GoogleSignin.signIn()

  if (signInResult.type !== 'success') {
    throw new Error('Google Sign-In was cancelled or failed')
  }

  const { idToken } = signInResult.data

  if (!idToken) {
    throw new Error('Google Sign-In failed: missing ID token')
  }

  // Create a Google credential with the token
  const googleCredential = GoogleAuthProvider.credential(idToken)

  // Sign-in the user with the credential
  const auth = getAuth()
  const userCredential = await signInWithCredential(auth, googleCredential)

  return userCredential.user
}
