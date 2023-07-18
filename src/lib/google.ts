import axios from "axios";
import { google } from 'googleapis';
import { GoogleAdsApi, enums } from "google-ads-api";
import {
  GG_CLIENT_ID,
  GG_CLIENT_SECRET,
  GG_TOKEN_URL,
  GG_USER_INFO_URL,
  GG_CALLBACK_URL,
  GG_AUTH_URL,
} from "../constants";

const client = new GoogleAdsApi({
    client_id: GG_CLIENT_ID,
    client_secret: GG_CLIENT_SECRET,
    developer_token: "D5_xDMB9ctVSU8Pv8JDdEg",
});

const oauth2Client = new google.auth.OAuth2(
  GG_CLIENT_ID,
  GG_CLIENT_SECRET,
  GG_CALLBACK_URL
);

export class GoogleService {
    customer: any;
  getLoginUrl() {
    try {
        const stringifiedParams = new URLSearchParams({
        client_id: GG_CLIENT_ID,
        redirect_uri: GG_CALLBACK_URL,
        scope: [
            'https://www.googleapis.com/auth/adwords'
        ].join(" "),
        response_type: "code",
        access_type: "offline",
        prompt: "consent",
        });

        const googleLoginUrl = `${GG_AUTH_URL}?${stringifiedParams}`;

        return googleLoginUrl;
    } catch (err) {
        throw new Error(`ERROR AUTH: ${err}`);
    }
  }

  async getAccessTokenByCode(code: string) {
    if (!code) {
      throw new Error(`The code isn't exists`);
    }

    try {
        const { data } = await axios({
            url: GG_TOKEN_URL,
            method: "POST",
            data: {
                client_id: GG_CLIENT_ID,
                client_secret: GG_CLIENT_SECRET,
                redirect_uri: GG_CALLBACK_URL,
                grant_type: "authorization_code",
                code,
            },
        });
        console.log("getAccessToken: ", data);
        return data;
    } catch (err) {
        throw new Error(`ERROR GET ACCESS TOKEN: ${err}`);
    }
  }

  async getAccessTokenByRefreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error(`The refreshToken isn't exists`);
    }

    try {
        const { data } = await axios({
            url: GG_TOKEN_URL,
            method: "POST",
            data: {
                client_id: GG_CLIENT_ID,
                client_secret: GG_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                scope: [
                    'https://www.googleapis.com/auth/adwords'
                ].join(" "),
            },
        });
        console.log("getAccessTokenByRefreshToken: ", data);
        return data;
    } catch (err) {
        throw new Error(`ERROR GET ACCESS TOKEN: ${err}`);
    }
  }

  async getUserInfo(accessToken: string) {
    try {
        const { data } = await axios({
            url: GG_USER_INFO_URL,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(data); // { id, email, given_name, family_name }
          return data;
    } catch (err) {
        throw new Error(`ERROR GET USER INFO: ${err}`);
    }
  }

  getAuthUrl() {
    const url = oauth2Client.generateAuthUrl({    
        // If you only need one scope you can pass it as a string
        scope: [
            'https://www.googleapis.com/auth/adwords'
        ].join(" "),
        response_type: "code",
        access_type: "offline",
        prompt: "consent",
    });

    return url;
  }

  async getListCustomers(refreshToken: string) {
    const customers = await client.listAccessibleCustomers(refreshToken);
    return customers;
  }

  async getCustomer(refreshToken: string) {
    const customer = client.Customer({
        customer_id: "9273297294",
        refresh_token: refreshToken,
        login_customer_id: "6357156025"
      });
    console.log("🚀 ---------------------------------------------------------------------------🚀");
    console.log("🚀 ~ file: google.ts:92 ~ GoogleService ~ getCustomer ~ customer:", customer);
    console.log("🚀 ---------------------------------------------------------------------------🚀");
    this.customer = customer;
    return this;
  }

  async getCustomers() {
    try {
      console.log("🚀 ~ file: google.ts:116 ~ GoogleService ~ getCustomers ~ test:", this.customer);
      const customers = await this.customer.query(`
        SELECT 
          customer.id
        FROM 
          customer
        LIMIT 20
      `);
      console.log("🚀 -------------------------------------------------------------------------------🚀");
      console.log("🚀 ~ file: google.ts:116 ~ GoogleService ~ getCustomers ~ campaigns:", customers);
      console.log("🚀 -------------------------------------------------------------------------------🚀");

      return customers;
    } catch(err) {
      console.log("🚀 -------------------------------------------------------------------------------🚀");
      console.log("🚀 ~ file: google.ts:116 ~ GoogleService ~ getCustomers ~ ERR:", err);
    }
  }

  async getCampaigns() {
    try {
      console.log("🚀 ~ file: google.ts:116 ~ GoogleService ~ getCampaigns ~ test:", this.customer);
      const campaigns = await this.customer.query(`
        SELECT 
          campaign.id, 
          campaign.name,
          campaign.bidding_strategy_type,
          campaign_budget.amount_micros,
          metrics.cost_micros,
          metrics.clicks,
          metrics.impressions,
          metrics.all_conversions
        FROM 
          campaign
        LIMIT 20
      `);
      console.log("🚀 -------------------------------------------------------------------------------🚀");
      console.log("🚀 ~ file: google.ts:116 ~ GoogleService ~ getCampaigns ~ campaigns:", campaigns);
      console.log("🚀 -------------------------------------------------------------------------------🚀");

      return campaigns;
    } catch(err) {
      console.log("🚀 -------------------------------------------------------------------------------🚀");
      console.log("🚀 ~ file: google.ts:116 ~ GoogleService ~ getCampaigns ~ ERR:", err);
    }
  }
}
