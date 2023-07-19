import dotenv from 'dotenv';
import path from 'path';

const config = dotenv.config({ path: path.resolve(__dirname, '../../.env') }).parsed;

export const APP_PORT = config?.PORT || null;
export const MONGO_URI = config?.MONGO_URI || '';

export const FB_CLIENT_ID = config?.FB_CLIENT_ID || '';
export const FB_CLIENT_SECRET = config?.FB_CLIENT_SECRET || '';
export const FB_CALLBACK_URL = config?.FB_CALLBACK_URL || '';

export const GG_CLIENT_ID = config?.GG_CLIENT_ID || '';
export const GG_CLIENT_SECRET = config?.GG_CLIENT_SECRET || '';
export const GG_CALLBACK_URL = config?.GG_CALLBACK_URL || '';
export const GG_AUTHORIZATION_URL = config?.GG_AUTHORIZATION_URL || '';
export const GG_TOKEN_URL = config?.GG_TOKEN_URL || '';
export const GG_USER_INFO_URL = config?.GG_USER_INFO_URL || '';
export const GG_AUTH_URL = config?.GG_AUTH_URL || '';
export const GG_API_URL = config?.GG_API_URL || '';
export const GG_API_VERSION = config?.GG_API_VERSION || '';
export const GG_DEVELOPER_TOKEN = config?.GG_DEVELOPER_TOKEN || '';

export enum PROVIDERS {
    GOOGLE = 'google',
    FACEBOOK = 'facebook'
}
