import { addCorsHeaders } from '../utils/cors';

/**
 * Health check route
 * GET /api/health
 */
export async function handleHealth(): Promise<Response> {
	return addCorsHeaders(
		new Response(
			JSON.stringify({
				success: true,
				message: 'API is healthy',
				timestamp: new Date().toISOString(),
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		),
	);
}
