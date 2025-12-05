import axios from 'axios';
import type { EmailRequest, ResendResponse, Env } from '../types';
import { addCorsHeaders } from '../utils/cors';

/**
 * Email route handler
 * POST /api/email
 */
export async function handleEmail(request: Request, env: Env): Promise<Response> {
	try {
		const body = (await request.json()) as EmailRequest;
		const { email, resetToken, userName, type } = body;

		// Validate input
		if (!email || !resetToken) {
			return addCorsHeaders(
				new Response(JSON.stringify({ error: 'Email and resetToken are required' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return addCorsHeaders(
				new Response(JSON.stringify({ error: 'Invalid email format' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
		}

		// Determine email type
		const isPasswordRecovery = type === 'password-recovery';

		const emailData = {
			from: 'DailyMood Journal <onboarding@resend.dev>', // Update with your verified domain
			to: email,
			subject: isPasswordRecovery ? 'Reset Your Diary Lock Password' : 'Reset Your Security Question',
			html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${isPasswordRecovery ? 'Reset Password' : 'Reset Security Question'}</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">${isPasswordRecovery ? '🔒 Password Reset' : '🔐 Security Question Reset'}</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hello${userName ? ` ${userName}` : ''},</p>
              <p>You requested to reset your ${isPasswordRecovery ? 'diary lock password' : 'security question'}. Use the code below to reset:</p>
              <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <code style="font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 4px;">${resetToken}</code>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 1 hour.</p>
              ${isPasswordRecovery ? '<p style="color: #666; font-size: 14px;">If you didn\'t request this, please ignore this email.</p>' : ''}
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">DailyMood Journal - Your Personal Diary</p>
            </div>
          </body>
        </html>
      `,
			text: `Hello${userName ? ` ${userName}` : ''},\n\nYou requested to reset your ${isPasswordRecovery ? 'diary lock password' : 'security question'}. Use this code to reset:\n\n${resetToken}\n\nThis code will expire in 1 hour.\n\n${isPasswordRecovery ? "If you didn't request this, please ignore this email.\n\n" : ''}---\nDailyMood Journal`,
		};

		// Use axios to call Resend API
		const response = await axios.post<ResendResponse>('https://api.resend.com/emails', emailData, {
			headers: {
				Authorization: `Bearer ${env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
			},
		});

		return addCorsHeaders(
			new Response(
				JSON.stringify({
					success: true,
					messageId: response.data.id,
					message: 'Email sent successfully',
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
	} catch (error: any) {
		console.error('Error sending email:', error);

		// Handle axios errors
		const errorMessage = error.response?.data?.message || error.message || 'Failed to send email. Please try again later.';

		return addCorsHeaders(
			new Response(
				JSON.stringify({
					error: errorMessage,
				}),
				{
					status: error.response?.status || 500,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
	}
}
