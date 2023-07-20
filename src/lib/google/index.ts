import axios from "axios";
import {
  GG_CLIENT_ID,
  GG_CLIENT_SECRET,
  GG_TOKEN_URL,
  GG_USER_INFO_URL,
  GG_CALLBACK_URL,
  GG_AUTH_URL,
} from "../../constants";
import { GoogleAPIService } from "./service.api";
import { AdTypes, AdFetchTypeArgs } from "./interfaces";
import { GRANT_TYPE, GG_SCOPES } from "../google/constants";

export class GoogleService extends GoogleAPIService {
  private readonly scopes: string[];

  constructor() {
    super();
    this.scopes = GG_SCOPES;
  }

  getLoginUrl() {
    try {
      const stringifiedParams = new URLSearchParams({
        client_id: GG_CLIENT_ID,
        redirect_uri: GG_CALLBACK_URL,
        scope: this.scopes.join(" "),
        response_type: "code",
        access_type: "offline",
        prompt: "consent",
      });

      return `${GG_AUTH_URL}?${stringifiedParams}`;
    } catch (err) {
      throw new Error(`Error auth: ${err}`);
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
          grant_type: GRANT_TYPE.AUTH_CODE,
          code,
        },
      });

      return data;
    } catch (err) {
      throw new Error(`Get access token by code err: ${err}`);
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
          grant_type: GRANT_TYPE.REFRESH_TOKEN,
          refresh_token: refreshToken,
          scope: this.scopes.join(" "),
        },
      });
      console.log("getAccessTokenByRefreshToken: ", data);
      return data;
    } catch (err) {
      throw new Error(`Get access token err: ${err}`);
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
      throw new Error(`Get user info error: ${err}`);
    }
  }

  getAuthUrl() {
    const url = this.oauth2Client.generateAuthUrl({
      scope: this.scopes.join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
    });

    return url;
  }

  async getAllCustomerManagers(refreshToken: string) {
    try {
      const url = `${this.GG_API_URL}${this.GG_API_VERSION}/customers:listAccessibleCustomers`;
      const accessToken = await this.getAccessToken(refreshToken);
      const headers = this.createHeaderOptions(accessToken);
      this.setRequestConfig(headers);

      const { data } = await this.axiosInstance.get(url, {});
      return data;
    } catch (error) {
      console.error("Google API get customers has err:", JSON.stringify(error));
      throw error;
    }
  }

  async getAllAccounts({ customerId, refreshToken }: AdFetchTypeArgs) {
    const data = await this
      .createQuery(AdTypes.CUSTOMER_CLIENT)
      .fetchData(refreshToken, customerId);
    return data;
  }

  async fetchingAdsData({ customerId, loginCustomerId, adType, refreshToken }: AdFetchTypeArgs) {
    const data = await this
      .createQuery(adType)
      .fetchData(refreshToken, customerId, loginCustomerId);
    return data;
  }

  async getCustomerDetail({ customerId, resourceName, refreshToken }: AdFetchTypeArgs) {
    const data = await this
      .createQuery(AdTypes.CUSTOMER_DETAIL, { resourceName })
      .fetchData(refreshToken, customerId);
    return data;
  }
}
