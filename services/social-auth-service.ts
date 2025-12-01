import * as AppleAuthentication from 'expo-apple-authentication'
import * as AuthSession from 'expo-auth-session'
import Constants from 'expo-constants'
import * as Crypto from 'expo-crypto'
import { Platform } from 'react-native'

// Google OAuth configuration
// For Firebase Web SDK, we use the web client ID for all platforms
// This can be found in Firebase Console > Project Settings > General > Your apps > Web app
// Or in Google Cloud Console > APIs & Services > Credentials (Web client)
const getGoogleClientId = (): string => {
  // Try to get from app.json extra config first (platform-specific)
  const platformClientId = Platform.select({
    ios: Constants.expoConfig?.extra?.googleClientIdIos as string | undefined,
    android: Constants.expoConfig?.extra?.googleClientIdAndroid as
      | string
      | undefined,
    web: Constants.expoConfig?.extra?.googleClientIdWeb as string | undefined,
  })

  if (platformClientId) {
    return platformClientId
  }

  // Fallback to web client ID from Firebase config (works for all platforms with Firebase Web SDK)
  const webClientId = Constants.expoConfig?.extra?.googleClientIdWeb as
    | string
    | undefined

  if (webClientId) {
    return webClientId
  }

  // If no client ID is configured, throw helpful error
  throw new Error(
    `Google Client ID not configured. ` +
      `Please add googleClientIdWeb to app.json extra config. ` +
      `You can find your Web client ID in Firebase Console > Project Settings > General > Your apps > Web app. ` +
      `For Firebase Web SDK, the web client ID works for all platforms.`
  )
}

// For mobile apps, we need to use a web redirect URI that Google accepts
// Google Cloud Console doesn't accept custom scheme URIs (exp://, note-taker://, etc.)
// Use http://localhost:8081 for development (Google accepts this)
// Or use the Firebase Hosting URL for production
// For mobile apps, use Firebase Hosting URL (already configured in Google Console)
// localhost won't work on physical devices, so we always use the Firebase URL
const GOOGLE_REDIRECT_URI =
  Platform.select({
    web: AuthSession.makeRedirectUri(),
    default: 'https://note-taker-d9c88.firebaseapp.com/__/auth/handler', // Use Firebase Hosting URL for mobile
  }) || 'https://note-taker-d9c88.firebaseapp.com/__/auth/handler'

export interface GoogleAuthResult {
  idToken: string
  accessToken?: string
}

export interface AppleAuthResult {
  idToken: string
  rawNonce: string
  user: {
    email: string | null
    fullName: {
      givenName: string | null
      familyName: string | null
    } | null
  }
}

export class SocialAuthService {
  /**
   * Sign in with Google using Firebase Web SDK
   * For web: Returns null to indicate Firebase Web SDK should handle it directly via signInWithPopup
   * For native: uses expo-auth-session to get ID token, then Firebase Web SDK authenticates with it
   */
  static async signInWithGoogle(): Promise<GoogleAuthResult | null> {
    if (Platform.OS === 'web') {
      // For web, Firebase Web SDK handles OAuth automatically via signInWithPopup
      // Return null to indicate Firebase should handle it directly
      return null
    } else {
      // For native, use expo-auth-session to get ID token
      // Then Firebase Web SDK will authenticate using signInWithCredential
      return this.signInWithGoogleNative()
    }
  }

  private static async signInWithGoogleNative(): Promise<GoogleAuthResult> {
    const clientId = getGoogleClientId()
    const redirectUri = GOOGLE_REDIRECT_URI

    // Log the redirect URI for debugging
    console.log('Google OAuth Redirect URI:', redirectUri)

    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    }

    // Use authorization code flow with PKCE (recommended for mobile apps)
    // This allows custom scheme redirect URIs
    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code, // Use code flow instead of IdToken
      redirectUri,
      usePKCE: true, // Enable PKCE for security (required for mobile apps)
      extraParams: {},
    })

    const result = await request.promptAsync(discovery)

    if (result.type === 'success') {
      const { code } = result.params

      if (!code) {
        throw new Error('No authorization code received from Google')
      }

      // Exchange the authorization code for tokens
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: request.codeVerifier || '',
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text()
        throw new Error(`Token exchange failed: ${errorData}`)
      }

      const tokenData = await tokenResponse.json()
      const { id_token, access_token } = tokenData

      if (!id_token) {
        throw new Error('No ID token received from token exchange')
      }

      return {
        idToken: id_token as string,
        accessToken: access_token as string | undefined,
      }
    } else if (result.type === 'cancel') {
      throw new Error('Google sign-in was cancelled')
    } else {
      throw new Error(`Google sign-in failed: ${result.type}`)
    }
  }

  /**
   * Sign in with Apple
   * NOTE: Currently disabled - keeping code for future use
   */
  static async signInWithApple(): Promise<AppleAuthResult> {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS')
    }

    if (!(await AppleAuthentication.isAvailableAsync())) {
      throw new Error('Apple Sign-In is not available on this device')
    }

    // Generate a random nonce for security
    const rawNonce = Crypto.randomUUID()
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawNonce
    )

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      })

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple')
      }

      return {
        idToken: credential.identityToken,
        rawNonce,
        user: {
          email: credential.email || null,
          fullName: credential.fullName
            ? {
                givenName: credential.fullName.givenName || null,
                familyName: credential.fullName.familyName || null,
              }
            : null,
        },
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        throw new Error('Apple Sign-In was cancelled')
      }
      throw error
    }
  }

  /**
   * Check if Apple Sign-In is available
   */
  static async isAppleSignInAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false
    }
    return await AppleAuthentication.isAvailableAsync()
  }
}
