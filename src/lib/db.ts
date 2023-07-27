import mongoose, { ConnectOptions } from 'mongoose';
import {  MONGO_URI } from '../constants';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        console.log('Connect MongoDB succeed');
    } catch (err) {
        console.log('Connect MongoDB failed by: ', err)
    }
}