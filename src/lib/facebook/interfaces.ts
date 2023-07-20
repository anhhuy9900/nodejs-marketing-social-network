export interface FBAuthResponse { 
    accessToken: string;
    userID: string;
    expiresIn: string;
    signedRequest: string;
    graphDomain: string;
    data_access_expiration_time: string;
}

export interface FbUserProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}