import { getAuth } from '@react-native-firebase/auth'
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore'
import { CryptoDigestAlgorithm, digest } from 'expo-crypto'
import * as LocalAuthentication from 'expo-local-authentication'
import { type MMKV, createMMKV } from 'react-native-mmkv'

// Lazy initialization of MMKV storage to avoid initialization errors
let storageInstance: MMKV | null = null
let initializationError: Error | null = null

function getStorage(): MMKV {
  if (initializationError) {
    throw initializationError
  }

  if (!storageInstance) {
    try {
      storageInstance = createMMKV({ id: 'diary-lock' })
    } catch (error) {
      initializationError = error as Error
      console.error('Failed to initialize MMKV storage:', error)
      throw error
    }
  }
  return storageInstance
}

// Safe storage access that returns null if storage is unavailable
function safeGetStorage(): MMKV | null {
  try {
    return getStorage()
  } catch {
    return null
  }
}

const STORAGE_KEYS = {
  PASSWORD_HASH: 'passwordHash',
  PIN_HASH: 'pinHash',
  SECURITY_ANSWER_HASH: 'securityAnswerHash',
} as const

export type LockType = 'password' | 'pin' | 'none'

export interface SecurityQuestionData {
  question: string
  answer: string
}

export interface LockSetupData {
  lockType: LockType
  password?: string
  pin?: string
  securityQuestion?: SecurityQuestionData
  recoveryEmail?: string
  enableBiometric?: boolean
}

/**
 * Hash a string using SHA-256
 */
async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await digest(CryptoDigestAlgorithm.SHA256, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Check if biometric authentication is available on the device
 */
export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    if (!compatible) return false

    const enrolled = await LocalAuthentication.isEnrolledAsync()
    return enrolled
  } catch (error) {
    console.error('Error checking biometric availability:', error)
    return false
  }
}

/**
 * Get supported biometric types
 */
export async function getSupportedBiometricTypes(): Promise<
  LocalAuthentication.AuthenticationType[]
> {
  try {
    return await LocalAuthentication.supportedAuthenticationTypesAsync()
  } catch (error) {
    console.error('Error getting supported biometric types:', error)
    return []
  }
}

/**
 * Authenticate using biometrics
 */
export async function authenticateWithBiometric(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to unlock your diary',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    })

    return result.success
  } catch (error) {
    console.error('Error during biometric authentication:', error)
    return false
  }
}

/**
 * Setup diary lock
 */
export async function setupDiaryLock(data: LockSetupData): Promise<void> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to setup diary lock')
  }

  const firestore = getFirestore()
  const securityRef = doc(firestore, `users/${user.uid}/security/lock`)

  // Hash password or PIN
  const storage = safeGetStorage()
  if (!storage) {
    throw new Error('Storage is not available. Cannot setup diary lock.')
  }

  if (data.lockType === 'password' && data.password) {
    const passwordHash = await hashString(data.password)
    storage.set(STORAGE_KEYS.PASSWORD_HASH, passwordHash)
  } else if (data.lockType === 'pin' && data.pin) {
    const pinHash = await hashString(data.pin)
    storage.set(STORAGE_KEYS.PIN_HASH, pinHash)
  }

  // Hash security answer if provided
  if (data.securityQuestion?.answer) {
    const answerHash = await hashString(
      data.securityQuestion.answer.toLowerCase().trim()
    )
    storage.set(STORAGE_KEYS.SECURITY_ANSWER_HASH, answerHash)
  }

  // Save to Firestore
  await setDoc(securityRef, {
    hasLock: true,
    lockType: data.lockType,
    securityQuestion: data.securityQuestion?.question || null,
    recoveryEmail: data.recoveryEmail || null,
    biometricEnabled: data.enableBiometric || false,
    createdAt: new Date(),
  })
}

/**
 * Verify password
 */
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    const storage = safeGetStorage()
    if (!storage) return false

    const storedHash = storage.getString(STORAGE_KEYS.PASSWORD_HASH)
    if (!storedHash) return false

    const inputHash = await hashString(password)
    return inputHash === storedHash
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

/**
 * Verify PIN
 */
export async function verifyPin(pin: string): Promise<boolean> {
  try {
    const storage = safeGetStorage()
    if (!storage) return false

    const storedHash = storage.getString(STORAGE_KEYS.PIN_HASH)
    if (!storedHash) return false

    const inputHash = await hashString(pin)
    return inputHash === storedHash
  } catch (error) {
    console.error('Error verifying PIN:', error)
    return false
  }
}

/**
 * Verify security answer
 */
export async function verifySecurityAnswer(answer: string): Promise<boolean> {
  try {
    const storage = safeGetStorage()
    if (!storage) return false

    const storedHash = storage.getString(STORAGE_KEYS.SECURITY_ANSWER_HASH)
    if (!storedHash) return false

    const inputHash = await hashString(answer.toLowerCase().trim())
    return inputHash === storedHash
  } catch (error) {
    console.error('Error verifying security answer:', error)
    return false
  }
}

/**
 * Get security question from Firestore
 */
export async function getSecurityQuestion(): Promise<string | null> {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) return null

    const firestore = getFirestore()
    const securityRef = doc(firestore, `users/${user.uid}/security/lock`)
    const securityDoc = await getDoc(securityRef)

    if (!securityDoc.exists()) return null

    const data = securityDoc.data()
    return data?.securityQuestion || null
  } catch (error) {
    console.error('Error getting security question:', error)
    return null
  }
}

/**
 * Get recovery email from Firestore
 */
export async function getRecoveryEmail(): Promise<string | null> {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) return null

    const firestore = getFirestore()
    const securityRef = doc(firestore, `users/${user.uid}/security/lock`)
    const securityDoc = await getDoc(securityRef)

    if (!securityDoc.exists()) return null

    const data = securityDoc.data()
    return data?.recoveryEmail || null
  } catch (error) {
    console.error('Error getting recovery email:', error)
    return null
  }
}

/**
 * Reset lock using security answer
 */
export async function resetLockWithSecurityAnswer(
  answer: string,
  newPassword?: string,
  newPin?: string
): Promise<boolean> {
  try {
    const isValid = await verifySecurityAnswer(answer)
    if (!isValid) return false

    // User verified, allow them to set new password/PIN
    const storage = safeGetStorage()
    if (!storage) {
      throw new Error('Storage is not available. Cannot reset lock.')
    }

    if (newPassword) {
      const passwordHash = await hashString(newPassword)
      storage.set(STORAGE_KEYS.PASSWORD_HASH, passwordHash)
    }

    if (newPin) {
      const pinHash = await hashString(newPin)
      storage.set(STORAGE_KEYS.PIN_HASH, pinHash)
    }

    return true
  } catch (error) {
    console.error('Error resetting lock with security answer:', error)
    return false
  }
}

/**
 * Disable diary lock
 */
export async function disableDiaryLock(): Promise<void> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to disable diary lock')
  }

  // Clear local storage
  const storage = safeGetStorage()
  if (storage) {
    try {
      storage.remove(STORAGE_KEYS.PASSWORD_HASH)
      storage.remove(STORAGE_KEYS.PIN_HASH)
      storage.remove(STORAGE_KEYS.SECURITY_ANSWER_HASH)
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  // Update Firestore
  const firestore = getFirestore()
  const securityRef = doc(firestore, `users/${user.uid}/security/lock`)
  await updateDoc(securityRef, {
    hasLock: false,
    lockType: 'none',
  })
}

/**
 * Check if lock is enabled
 */
export function hasLockEnabled(): boolean {
  const storage = safeGetStorage()
  if (!storage) return false

  const passwordHash = storage.getString(STORAGE_KEYS.PASSWORD_HASH)
  const pinHash = storage.getString(STORAGE_KEYS.PIN_HASH)
  return !!(passwordHash || pinHash)
}

/**
 * Get lock type
 */
export function getLockType(): LockType {
  const storage = safeGetStorage()
  if (!storage) return 'none'

  const passwordHash = storage.getString(STORAGE_KEYS.PASSWORD_HASH)
  const pinHash = storage.getString(STORAGE_KEYS.PIN_HASH)

  if (passwordHash) return 'password'
  if (pinHash) return 'pin'
  return 'none'
}
