import dotenv from 'dotenv';
import path from 'path';

const config = dotenv.config({ path: path.resolve(__dirname, '../../.env') }).parsed;

export const APP_PORT = config?.PORT || null;
export const MONGO_URI = config?.MONGO_URI || '';

export const FB_CLIENT_ID = config?.FB_CLIENT_ID || '';
export const FB_CLIENT_SECRET = config?.FB_CLIENT_SECRET || '';
export const FB_CALLBACK_URL = config?.FB_CALLBACK_URL || '';
