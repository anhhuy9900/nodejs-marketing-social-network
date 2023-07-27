import { FB_CLIENT_ID, FB_CLIENT_SECRET, FB_CALLBACK_URL, PROVIDERS } from '../../constants';
import { IAuthDocument, IAuthModel, AuthModel } from '../../models/auth';
import { IUserDocument, UserModel } from '../../models/user';
import { FacebookAPIService } from './service.api';
import { FBAuthResponse } from './interfaces';

export class FacebookService {

    public readonly apiService: FacebookAPIService;

    constructor(apiService: FacebookAPIService) {
        this.apiService = apiService;
    }
    
    getLoginUrl() {
        const stringifiedParams = new URLSearchParams({
            client_id: FB_CLIENT_ID,
            redirect_uri: FB_CALLBACK_URL,
            scope: ['email', 'user_friends'].join(','),
            response_type: 'code',
            auth_type: 'rerequest',
            display: 'popup',
        });
        const facebookLoginUrl = `https://www.facebook.com/v17.0/dialog/oauth?${stringifiedParams}`;
        console.log('facebookLoginUrl: ', facebookLoginUrl);
        return facebookLoginUrl;
    }

    async createAuth(body: FBAuthResponse): Promise<IAuthModel> {
        const { accessToken, userID, expiresIn, signedRequest, graphDomain, data_access_expiration_time } = body;
        const authData: IAuthDocument = {
            provider: PROVIDERS.FACEBOOK,
            accessToken,
            refreshToken: '',
            userId: userID,
            expiresIn,
            signedRequest,
            graphDomain,
            dataAccessExpirationTime: data_access_expiration_time
        };
        const auth = new AuthModel(authData);
        return await auth.save();
    }

    async createUserFromFbProfile(accessToken: string): Promise<IUserDocument> {
        const { id, email, first_name, last_name } = await this.apiService.getProfile(accessToken);
        return await new UserModel({
            networkId: id,
            email: email,
            name: `${first_name}${last_name}`,
            status: 'active'
        }).save();
    }
}