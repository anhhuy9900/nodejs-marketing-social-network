import mongoose, { ConnectOptions } from 'mongoose';
import { MONGO_URI, GG_API_VERSION, GG_API_URL, GG_CLIENT_SECRET } from './../../src/constants';
import { GoogleAPIService } from '../../src/lib/google/service.api';
import { GoogleService } from '../../src/lib/google/index';
import {
    PROVIDERS,
} from "../../src/constants";
import { getCustomerId } from '../../src/utils';
import { AdTypes } from '../../src/lib/google/interfaces';
import { IAuthDocument, AuthModel } from '../../src/models/auth';

describe('TEST GOOGLE SERVICE API', () => {

    let googleAPIService: GoogleAPIService;
    googleAPIService = new GoogleAPIService();

    let googleService: GoogleService;
    googleService = new GoogleService();

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

    describe('Test construct of google service API', () => {
        
        test('Class defined', () => {
            expect(googleAPIService).not.toEqual(undefined);
        })

        test('CLIENT ID, CLIENT SECRET is not empty', () => {
            expect(GG_API_URL).not.toEqual(undefined);
            expect(GG_API_URL).not.toEqual(null);
            expect(GG_CLIENT_SECRET).not.toEqual(undefined);
            expect(GG_CLIENT_SECRET).not.toEqual(null);
            expect(GG_API_VERSION).not.toEqual(undefined);
            expect(GG_API_VERSION).not.toEqual(null);
        })
    })

    describe('Test get access token of google service API', () => {
        it('accessToken is not empty', async() => {
            accessToken = await googleAPIService.getAccessToken(refreshToken);
            expect(accessToken).not.toEqual(undefined);
            expect(accessToken).not.toEqual(null);
        })
    })

    describe('TEST GET USER INFO ', () => {
        let userProfile: any = null;
        beforeAll(async () => {
            userProfile = await googleService.getUserInfo(accessToken);
        }) 
        it('Verify user data is exists',() => {
            expect(userProfile).not.toEqual(undefined);
            expect(userProfile).not.toEqual(null);
            expect(userProfile).toHaveProperty('id');
            expect(userProfile).toHaveProperty('name');
            expect(userProfile).toHaveProperty('email');
            expect(userProfile).toHaveProperty('verified_email');
            expect(userProfile).toHaveProperty('given_name');
            expect(userProfile).toHaveProperty('family_name');
        })

        it('Verify user data is truth',() => {
            expect(userProfile.email).toEqual('nhahuy19902@gmail.com');
            expect(userProfile.name).toEqual('Huy Nguyen');
        })
    });

    describe('TEST GET LIST CUSTOMER MANAGER', () => {
        let data: any = null;
        beforeAll(async () => {
            data = await googleService.getAllCustomerManagers(accessToken);
            loginCustomerId = getCustomerId(data?.resourceNames[0])
        }) 
        it('Verify user data is exists',() => {
            expect(data).not.toEqual(undefined);
            expect(data).not.toEqual(null);
            expect(data).toHaveProperty('resourceNames');
            expect(data?.resourceNames?.length).toBeGreaterThan(0);
        })
    });

    describe('TEST GET ACCOUNTS', () => {
        let data: any = null;
        beforeAll(async () => {
            data = await googleService.getAllAccounts({ refreshToken, customerId: loginCustomerId });
        }) 
        it('Verify accounts have data',() => {
            expect(data).not.toEqual(undefined);
            expect(data).not.toEqual(null);
            expect(data).toHaveProperty('results');
            expect(data).toHaveProperty('fieldMask');
            expect(data?.results?.length).toBeGreaterThan(0);

            if (data?.results?.length) {
                const customerClient = data.results[0]?.customerClient;
                customerId = data.results[0]?.customerClient?.id;
                expect(data.results[0]).toHaveProperty('customerClient');
                expect(Object.keys(customerClient).length).toBeGreaterThan(0);
                expect(customerClient).toHaveProperty('resourceName');
                expect(customerClient).toHaveProperty('id');
                expect(customerClient).toHaveProperty('manager');
            }
        })
    });

    describe('TEST GET CAMPAIGNS', () => {
        let data: any = null;
        beforeAll(async () => {
            data = await googleService.fetchingAdsData({ 
                refreshToken, 
                customerId, 
                loginCustomerId, 
                adType: AdTypes.CAMPAIGN 
            });
        }) 
        it('Verify campaigns have data',() => {
            expect(data).not.toEqual(undefined);
            expect(data).not.toEqual(null);
            expect(data).toHaveProperty('results');
            expect(data).toHaveProperty('fieldMask');
            expect(data?.results?.length).toBeGreaterThan(0);

            if (data?.results?.length) {
                const campaign = data.results[0]?.campaign;
                expect(data.results[0]).toHaveProperty('campaign');
                expect(data.results[0]).toHaveProperty('metrics');
                expect(data.results[0]).toHaveProperty('campaignBudget');
                expect(Object.keys(campaign).length).toBeGreaterThan(0);
                expect(campaign).toHaveProperty('resourceName');
                expect(campaign).toHaveProperty('id');
                expect(campaign).toHaveProperty('name');
            }
        })
    });
})