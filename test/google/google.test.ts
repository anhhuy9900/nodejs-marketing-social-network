import supertest from "supertest";
import mongoose, { ConnectOptions } from 'mongoose';
import { GoogleService } from '../../src/lib/google';
import { GoogleAPIService } from '../../src/lib/google/service.api';
import {
    PROVIDERS,
    MONGO_URI
} from "../../src/constants";
import { IAuthDocument, AuthModel } from '../../src/models/auth';
import { getCustomerId } from '../../src/utils';
import { App } from '../../src/app';

describe('RUN INTEGRATION TEST WITH GOOGLE', () => {
    const request = supertest(App);
    let googleService = new GoogleService(new GoogleAPIService());

    let refreshToken: string;
    let accessToken: string;
    let loginCustomerId: string;
    let customerId: string;

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

    describe('Run test route -> get access token', () => {
        test('Should url /google/get-access-token -> work', async() => {
            const res = await request.get("/google/get-access-token").query({ refreshToken });
            accessToken = res.body?.accessToken;
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body?.accessToken).not.toEqual(null);
        })
    })

    describe('Run test route -> get user info', () => {
        test('Should url /google/get-user-info -> work', async() => {
            const res = await request.get("/google/get-user-info").query({ accessToken });
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
            expect(res.body).toHaveProperty('user');
            expect(res.body?.user).not.toEqual(null);
            expect(res.body?.user?.id).not.toEqual(null);
            expect(res.body?.user?.email).not.toEqual(null);
            expect(res.body?.user?.name).not.toEqual(null);
        })
    })

    describe('RUN test route -> get customer managers', () => {
        test('Should url /google/customer-managers -> work', async() => {
            const res = await request.get("/google/customer-managers").query({ refreshToken });
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
            expect(res.body).not.toEqual(undefined);
            expect(res.body).toHaveProperty('resourceNames');
            expect(res.body?.resourceNames?.length).toBeGreaterThan(0);

            loginCustomerId = getCustomerId(res.body?.resourceNames[0])
        })
    })

    describe('RUN test route -> get accounts ', () => {
        test('Should url /google/accounts -> work', async() => {
            const res = await request.get("/google/accounts").query({ refreshToken, customerId: loginCustomerId });
            customerId = res.body?.results[0]?.customerClient?.id;
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
            expect(res.body).not.toEqual(undefined);
            expect(res.body).toHaveProperty('results');
            expect(res.body).toHaveProperty('fieldMask');
            expect(res.body?.results?.length).toBeGreaterThan(0);
        })
    })

    describe('RUN test route -> get campaigns ', () => {
        test('Should url /google/campaigns -> work', async() => {
            const res = await request.get("/google/campaigns").query({ refreshToken, customerId, loginCustomerId });
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
            expect(res.body).not.toEqual(undefined);
            expect(res.body).toHaveProperty('results');
            expect(res.body).toHaveProperty('fieldMask');
            expect(res.body?.results?.length).toBeGreaterThan(0);
        })
    })
})