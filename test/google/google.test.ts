import supertest from "supertest";
import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { GoogleService } from '../../src/lib/google';
import {
    PROVIDERS,
    MONGO_URI
} from "../../src/constants";
import { IAuthDocument, AuthModel } from '../../src/models/auth';
import Routes from '../../src/routes'
import { App } from '../../src/app';

describe('RUN INTEGRATION TEST WITH GOOGLE', () => {
    const request = supertest(App);
    let googleService: GoogleService;
    googleService = new GoogleService();

    let refreshToken: string;

    beforeAll(async () => {
        console.log('beforeAll');
        try {
            await mongoose.connect(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              } as ConnectOptions)
        } catch (err) {
            console.log('CONNECT MongoDb failed by: ', err)
        }

        const auth = await AuthModel.findOne({ provider: PROVIDERS.GOOGLE }) as IAuthDocument;
        if (auth) {
            refreshToken = auth.refreshToken || '';
        }
    }) 

    describe('Test get access token', () => {
        test('Should url /google/get-access-token work', async() => {
            const res = await request.get("/google/get-access-token").query({ refreshToken });
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body?.accessToken).not.toEqual(null);
        })
    })
})