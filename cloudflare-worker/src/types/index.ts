export interface Env {
	RESEND_API_KEY: string;
}

export interface EmailRequest {
	email: string;
	resetToken: string;
	userName?: string;
	type?: string;
}

export interface ResendResponse {
	id?: string;
	message?: string;
	error?: {
		message: string;
	};
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}
