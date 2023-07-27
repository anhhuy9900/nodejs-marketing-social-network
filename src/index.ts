import mongoose, { ConnectOptions } from 'mongoose';
import { APP_PORT, MONGO_URI } from './constants';
import { App } from './app';
import { connectDB } from './lib/db';

(async() => {
    // Connect to mongodb
    await connectDB();
    
    App.listen(APP_PORT, async () => {
        console.log(`Running on ${APP_PORT}...`);
        console.log(`Nodejs-redis server started open http://localhost:${APP_PORT}`);
    });
})();