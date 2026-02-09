/**
 * CORS utility functions
 */

export const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function handleCORS(request: Request): Response | null {
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			headers: corsHeaders,
		});
	}
	return null;
}

export function addCorsHeaders(response: Response): Response {
	const newResponse = response.clone();
	Object.entries(corsHeaders).forEach(([key, value]) => {
		newResponse.headers.set(key, value);
	});
	return newResponse;
}
