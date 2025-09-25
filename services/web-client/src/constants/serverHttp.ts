export const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? 'http://core:8000';
const API_VERSION = `${INTERNAL_API_URL}/api/v1`;

const API_AUTH = `${API_VERSION}/auth`;
export const API_VERIFY_TOKEN = `${API_AUTH}/verify`;

export const API_CHATS_SERVER = `${API_VERSION}/chats`;