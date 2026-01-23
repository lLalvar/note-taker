import axios from 'axios'

const CLOUDFLARE_WORKER_URL = `${process.env.EXPO_PUBLIC_CLOUDFLARE_WORKER_URL}/api/email`

export async function sendPasswordRecoveryEmail(
  email: string,
  resetToken: string,
  userName?: string
) {
  try {
    const response = await axios.post(CLOUDFLARE_WORKER_URL, {
      email,
      resetToken,
      userName,
      type: 'password-recovery',
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    console.error('Error sending password recovery email:', error)
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      'Failed to send password recovery email'
    throw new Error(errorMessage)
  }
}

export async function sendSecurityQuestionResetEmail(
  email: string,
  resetToken: string,
  userName?: string
) {
  try {
    const response = await axios.post(CLOUDFLARE_WORKER_URL, {
      email,
      resetToken,
      userName,
      type: 'security-question-reset',
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    console.error('Error sending security question reset email:', error)
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      'Failed to send security question reset email'
    throw new Error(errorMessage)
  }
}
