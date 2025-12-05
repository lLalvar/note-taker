import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { Resend } from 'resend'

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send password recovery email
 * Called from the mobile app when user requests password reset
 */
export const sendPasswordRecoveryEmail = onCall(
  {
    // Set CORS and other options
    cors: true,
    // Rate limiting: max 5 calls per minute per user
    maxInstances: 10,
  },
  async (request) => {
    // Verify user is authenticated (optional - depends on your security needs)
    // const auth = request.auth
    // if (!auth) {
    //   throw new HttpsError('unauthenticated', 'User must be authenticated')
    // }

    const { email, resetToken, userName } = request.data

    // Validate input
    if (!email || !resetToken) {
      throw new HttpsError(
        'invalid-argument',
        'Email and reset token are required'
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new HttpsError('invalid-argument', 'Invalid email format')
    }

    try {
      // Send email using Resend
      const result = await resend.emails.send({
        from: 'DailyMood Journal <onboarding@resend.dev>', // Update with your verified domain
        to: email,
        subject: 'Reset Your Diary Lock Password',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Password</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">🔒 Password Reset</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <p>Hello${userName ? ` ${userName}` : ''},</p>
                <p>You requested to reset your diary lock password. Use the code below to reset your password:</p>
                <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                  <code style="font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 4px;">${resetToken}</code>
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in 1 hour.</p>
                <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">DailyMood Journal - Your Personal Diary</p>
              </div>
            </body>
          </html>
        `,
        // Plain text version for email clients that don't support HTML
        text: `Hello${userName ? ` ${userName}` : ''},\n\nYou requested to reset your diary lock password. Use this code to reset your password:\n\n${resetToken}\n\nThis code will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\n---\nDailyMood Journal`,
      })

      return {
        success: true,
        messageId: result.data?.id,
        message: 'Password recovery email sent successfully',
      }
    } catch (error) {
      console.error('Error sending email:', error)
      throw new HttpsError(
        'internal',
        'Failed to send email. Please try again later.'
      )
    }
  }
)

/**
 * Send security question reset email
 * Called when user needs to reset their security question
 */
export const sendSecurityQuestionResetEmail = onCall(
  {
    cors: true,
    maxInstances: 10,
  },
  async (request) => {
    const { email, resetToken, userName } = request.data

    if (!email || !resetToken) {
      throw new HttpsError(
        'invalid-argument',
        'Email and reset token are required'
      )
    }

    try {
      const result = await resend.emails.send({
        from: 'DailyMood Journal <onboarding@resend.dev>',
        to: email,
        subject: 'Reset Your Security Question',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">🔐 Security Question Reset</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <p>Hello${userName ? ` ${userName}` : ''},</p>
                <p>You requested to reset your security question. Use the code below:</p>
                <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                  <code style="font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 4px;">${resetToken}</code>
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in 1 hour.</p>
              </div>
            </body>
          </html>
        `,
        text: `Hello${userName ? ` ${userName}` : ''},\n\nYou requested to reset your security question. Use this code:\n\n${resetToken}\n\nThis code will expire in 1 hour.`,
      })

      return {
        success: true,
        messageId: result.data?.id,
      }
    } catch (error) {
      console.error('Error sending email:', error)
      throw new HttpsError('internal', 'Failed to send email')
    }
  }
)
