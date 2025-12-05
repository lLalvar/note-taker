import type { Env } from './types';
import { handleCORS } from './utils/cors';
import { handleEmail } from './routes/email';
import { handleHealth } from './routes/health';

/**
 * Main API router for Note Taker backend
 * Handles routing to different endpoints
 */
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Handle CORS preflight
		const corsResponse = handleCORS(request);
		if (corsResponse) return corsResponse;

		const url = new URL(request.url);
		const path = url.pathname;

		// Route to different handlers based on path
		try {
			// Health check endpoint
			if (path === '/api/health' && request.method === 'GET') {
				return handleHealth();
			}

			// Email endpoint
			if (path === '/api/email' && request.method === 'POST') {
				return handleEmail(request, env);
			}

			// 404 for unknown routes
			return new Response(
				JSON.stringify({
					error: 'Not Found',
					message: `Route ${path} not found`,
				}),
				{
					status: 404,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				},
			);
		} catch (error: any) {
			console.error('Unhandled error:', error);
			return new Response(
				JSON.stringify({
					error: 'Internal Server Error',
					message: error.message || 'An unexpected error occurred',
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				},
			);
		}
	},
} satisfies ExportedHandler<Env>;
