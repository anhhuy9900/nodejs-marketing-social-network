import { FB_CLIENT_ID, FB_CLIENT_SECRET, FB_CALLBACK_URL } from '../constants';



export class FacebookLib {
    
    getLoginUrl() {
        const stringifiedParams = new URLSearchParams({
            client_id: FB_CLIENT_ID,
            redirect_uri: 'https://google.com/authenticate',
            scope: ['email', 'user_friends'].join(','),
            response_type: 'code',
            auth_type: 'rerequest',
            display: 'popup',
        });
        const facebookLoginUrl = `https://www.facebook.com/v17.0/dialog/oauth?${stringifiedParams}`;
        console.log('facebookLoginUrl: ', facebookLoginUrl);
        return facebookLoginUrl;
    }
}