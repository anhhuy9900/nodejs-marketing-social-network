import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import { APP_PORT, MONGO_URI } from './constants';
import Routes from './routes'


const App = express();
App.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
App.use(bodyParser.json());

App.use(Routes);

App.get("/", async (req, res) => {
    res.status(200).send("Welcome to Nodejs-redis home page");
});

App.listen(APP_PORT, async () => {
    console.log(`Running on ${APP_PORT}...`);
    console.log(`Nodejs-redis server started open http://localhost:${APP_PORT}`);
});

export {
    App
}