import { getFunctions, httpsCallable } from '@react-native-firebase/functions'

/**
 * Email service for sending emails via Firebase Cloud Functions
 * This service calls Cloud Functions which use Resend to send emails
 */

const functions = getFunctions()

/**
 * Send password recovery email
 * @param email - User's email address
 * @param resetToken - Token/code for password reset
 * @param userName - Optional user name for personalization
 */
export async function sendPasswordRecoveryEmail(
  email: string,
  resetToken: string,
  userName?: string
) {
  try {
    const sendEmail = httpsCallable(
      functions,
      'sendPasswordRecoveryEmail'
    )

    const result = await sendEmail({
      email,
      resetToken,
      userName,
    })

    return {
      success: true,
      data: result.data,
    }
  } catch (error: any) {
    console.error('Error sending password recovery email:', error)
    throw new Error(
      error.message || 'Failed to send password recovery email'
    )
  }
}

/**
 * Send security question reset email
 * @param email - User's email address
 * @param resetToken - Token/code for security question reset
 * @param userName - Optional user name for personalization
 */
export async function sendSecurityQuestionResetEmail(
  email: string,
  resetToken: string,
  userName?: string
) {
  try {
    const sendEmail = httpsCallable(
      functions,
      'sendSecurityQuestionResetEmail'
    )

    const result = await sendEmail({
      email,
      resetToken,
      userName,
    })

    return {
      success: true,
      data: result.data,
    }
  } catch (error: any) {
    console.error('Error sending security question reset email:', error)
    throw new Error(
      error.message || 'Failed to send security question reset email'
    )
  }
}

