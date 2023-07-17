import express from 'express';
import axios from 'axios';
import path from 'path';
import { FacebookLib } from '../lib/facebook';
import { IAuthDocument, AuthModel } from '../models/auth';
import { UserModel } from '../models/user';

const app = express.Router();

app.get("/", async (req, res) => {
    try {
        const data = {};
        res.header("Content-Type",'application/json');
        res.status(200).send(data);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.post("/authenticate", async (req, res) => {
    try {
        console.log('authenticate: ', req);
        const { accessToken, userID, expiresIn, signedRequest, graphDomain, data_access_expiration_time } = req.body.authResponse;
        const body: IAuthDocument = {
            accessToken,
            userId: userID,
            expiresIn,
            signedRequest,
            graphDomain,
            dataAccessExpirationTime: data_access_expiration_time
        };
        console.log('authenticate - body: ', body);
        const auth = new AuthModel(body);
        await auth.save();
        res.header("Content-Type",'application/json');
        res.status(200).send("Verify authenticate successfully");	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/profile", async (req, res) => {
    try {
        console.log(req);
        const { accessToken } = req.query;
        
        const { data } = await axios({
            url: 'https://graph.facebook.com/me',
            method: 'get',
            params: {
              fields: ['id', 'email', 'first_name', 'last_name'].join(','),
              access_token: accessToken,
            },
        });
        console.log(data);
        await new UserModel({
            userFbId: data.id,
            email: data.email,
            name: `${data.first_name}${data.last_name}`,
            status: 'active'
        }).save();

        res.status(200).send("Get profile info successfully");	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/login", async (req, res) => {
    try {
        res.header("Content-Type",'text/html');
        // res.write(`<a href=${facebookLoginUrl}>
        //                 Login with Facebook
        //             </a>`);	

        res.sendFile(path.resolve(__dirname, '../views/index.html'))
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});


export default app;