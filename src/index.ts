import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import { APP_PORT, MONGO_URI } from './constants';
import Routes from './routes'


(async() => {

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          } as ConnectOptions)
    } catch (err) {
        console.log('CONNECT MongoDb failed by: ', err)
    }
    

    const app = express();
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    app.use(bodyParser.json());
    
    app.use(Routes);

    app.get("/", async (req, res) => {
        res.status(200).send("Welcome to Nodejs-redis home page");
    });

    app.listen(APP_PORT, async () => {
        console.log(`Running on ${APP_PORT}...`);
        console.log(`Nodejs-redis server started open http://localhost:${APP_PORT}`);
    });
})();