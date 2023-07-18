import express from 'express';
import axios from 'axios';
import path from 'path';
import { Request } from 'express';
import { GoogleService } from '../lib/google';
import { IAuthDocument, AuthModel } from '../models/auth';
import { UserModel } from '../models/user';
import { PROVIDERS } from '../constants';

const app = express.Router();

app.get("/test", async (req, res) => {
    try {
        const { refreshToken } = req.query as any;
        const getListCustomers = await (new GoogleService()).getListCustomers(refreshToken);

        console.log("🚀 -----------------------------------------------------------------------🚀");
        console.log("🚀 ~ file: google.ts:16 ~ app.get ~ getListCustomers:", getListCustomers);
        console.log("🚀 -----------------------------------------------------------------------🚀");

        const data = await (new GoogleService()).getCustomer(refreshToken);
        const customers = await data.getCustomers();

        // const campaigns = await data.getCampaigns();

        // const url = new GoogleService().getAuthUrl();
        console.log("🚀 ---------------------------------------------🚀");
        console.log("🚀 ~ file: google.ts:19 ~ app.get ~ customers:", customers);
        console.log("🚀 ---------------------------------------------🚀");
        
        res.send(null);
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/login", async (req, res) => {
    try {
        // const loginUrl = new GoogleService().getLoginUrl();
        const loginUrl = new GoogleService().getAuthUrl();
        res.header("Content-Type",'text/html');
        res.write(`<a href=${loginUrl}>
                        Login with Google
                    </a>`);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/authenticate", async (req, res) => {
    try {
        console.log('authenticate: ', req);
        const { code } = req.query as any;
        const { access_token, expires_in, refresh_token } = await (new GoogleService()).getAccessTokenByCode(code || '');
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
        const { id, email, name } = await (new GoogleService()).getUserInfo(accessToken);
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
        const data= await (new GoogleService()).getAccessTokenByRefreshToken(refreshToken);
        console.log('data: ', data);

        res.header("Content-Type",'application/json').status(200).send(data);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});


export default app;