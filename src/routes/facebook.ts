import express from 'express';
import path from 'path';
import { FacebookService } from '../lib/facebook';

const app = express.Router();
const facebookService = new FacebookService();

app.get("/", async (req, res) => {
    try {
        res.header("Content-Type",'application/json').status(200).send('Welcome to Meta facebook');	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/login", async (req, res) => {
    try {
        res.header("Content-Type",'text/html');
        res.sendFile(path.resolve(__dirname, '../views/index.html'))
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.post("/authenticate", async (req, res) => {
    try {
        console.log('authenticate: ', req);
        const data = await facebookService.createAuth(req.body.authResponse);

        res.header("Content-Type",'application/json').status(200).send({
            msg: "Verify authenticate successfully",
            data
        });	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/profile", async (req, res) => {
    try {
        const { accessToken } = req.query as any;
        const data = await facebookService.createUserFromFbProfile(accessToken);

        res.header("Content-Type",'application/json').status(200).send({
            msg: "Get profile info successfully",
            data
        });	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/permission", async (req, res) => {
    try {
        const { accessToken } = req.query as any;
        const data = await facebookService.getUserPermission(accessToken);

        res.header("Content-Type",'application/json').status(200).send(data);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});


app.get("/adAccounts", async (req, res) => {
    try {
        const { accessToken, userId } = req.query as any;
        const data = await facebookService.getAdAccounts(userId, accessToken);

        res.header("Content-Type",'application/json').status(200).send(data);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/campaigns", async (req, res) => {
    try {
        const { accessToken, accountId } = req.query as any;
        const data = await facebookService.getAdAccounts(accountId, accessToken);

        res.header("Content-Type",'application/json').status(200).send(data);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/adsets", async (req, res) => {
    try {
        const { accessToken, accountId } = req.query as any;
        const data = await facebookService.getAdsets(accountId, accessToken);

        res.header("Content-Type",'application/json').status(200).send(data);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/ads", async (req, res) => {
    try {
        const { accessToken, accountId } = req.query as any;
        const data = await facebookService.getAds(accountId, accessToken);

        res.header("Content-Type",'application/json').status(200).send(data);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

app.get("/adImages", async (req, res) => {
    try {
        const { accessToken, accountId } = req.query as any;
        const data = await facebookService.getAdImages(accountId, accessToken);

        res.header("Content-Type",'application/json').status(200).send(data);	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});


export default app;