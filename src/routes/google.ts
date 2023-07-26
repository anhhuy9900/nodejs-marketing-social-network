import express from 'express';
import { GoogleService } from '../lib/google';
import { GoogleAPIService } from '../lib/google/service.api';
import { IAuthDocument, AuthModel } from '../models/auth';
import { UserModel } from '../models/user';
import { PROVIDERS } from '../constants';
import { AdTypes } from '../lib/google/interfaces';

const app = express.Router();

const googleService = new GoogleService();
const googleAPIService = new GoogleAPIService();

app.get("/test", async (req, res) => {
    try {
        const { refreshToken } = req.query as any;
        // const data = await googleAPIService.createQuery(AdTypes.CAMPAIGN).fetchData(refreshToken, '9273297294', '6357156025');

        const auth = await AuthModel.findOne({ provider: PROVIDERS.GOOGLE });
        console.log("🚀 -----------------------------------------------------------------------🚀");
        console.log("🚀 ~ file: google.ts:16 ~ app.get ~ data:", auth);
        console.log("🚀 -----------------------------------------------------------------------🚀");

        res.header("Content-Type",'application/json').send(auth);
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/login", async (req, res) => {
    try {
        // const loginUrl = new GoogleService().getLoginUrl();
        const loginUrl = googleService.getAuthUrl();
        res.header("Content-Type",'text/html');
        res.write(`<a href=${loginUrl}>Login with Google</a>`);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/authenticate", async (req, res) => {
    try {
        console.log('authenticate: ', req);
        const { code } = req.query as any;
        const { access_token, expires_in, refresh_token } = await googleService.getAccessTokenByCode(code || '');
        const body: IAuthDocument = {
            provider: PROVIDERS.GOOGLE,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
        };
        const auth = new AuthModel(body);
        await auth.save();
        
        res.status(200).send("Verify authenticate successfully");	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/user-info", async (req, res) => {
    try {
        const { accessToken } = req.query as any;
        const { id, email, name } = await googleService.getUserInfo(accessToken);
        const user = await new UserModel({
            provider: PROVIDERS.GOOGLE,
            networkId: id,
            email,
            name,
            status: 'active'
        }).save();

        res.header("Content-Type",'application/json').status(200).send({ user });	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/get-access-token", async (req, res) => {
    try {
        const { refreshToken } = req.query as any;
        const accessToken = await googleService.getAccessToken(refreshToken);
        
        res.header("Content-Type",'application/json').status(200).send({
            accessToken
        });	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/customer-managers", async (req, res) => {
    try {
        const { refreshToken } = req.query as any;
        const customers = await googleService.getAllCustomerManagers(refreshToken);
        res.header("Content-Type",'application/json').send(customers);
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/accounts", async (req, res) => {
    try {
        const { refreshToken, customerId } = req.query as any;
        const accounts = await googleService.getAllAccounts({ refreshToken, customerId });
        res.header("Content-Type",'application/json').send(accounts);
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/campaigns", async (req, res) => {
    try {
        const { refreshToken, customerId, loginCustomerId } = req.query as any;
        const campaigns = await googleService.fetchingAdsData({ customerId, loginCustomerId, adType: AdTypes.CAMPAIGN, refreshToken });
        res.header("Content-Type",'application/json').send(campaigns);
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/ad-groups", async (req, res) => {
    try {
        const { refreshToken, customerId, loginCustomerId  } = req.query as any;
        const adGroups = await googleService.fetchingAdsData({ customerId, loginCustomerId, adType: AdTypes.AD_GROUP, refreshToken });
        res.header("Content-Type",'application/json').send(adGroups);
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/ads", async (req, res) => {
    try {
        const { refreshToken, customerId, loginCustomerId } = req.query as any;
        const ads = await googleService.fetchingAdsData({ customerId, loginCustomerId, adType: AdTypes.AD, refreshToken });
        res.header("Content-Type",'application/json').send(ads);
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/customer-detail", async (req, res) => {
    try {
        const { refreshToken, resourceName, customerId } = req.query as any;
        const ads = await googleService.getCustomerDetail({ refreshToken, customerId, resourceName });
        res.header("Content-Type",'application/json').send(ads);
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});


export default app;