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

export class GoogleService {
  protected readonly googleAPIService: GoogleAPIService;
  private readonly scopes: string[];

  constructor() {
    this.googleAPIService = new GoogleAPIService();
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
          grant_type: GRANT_TYPE.AUTH_CODE,
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
          grant_type: GRANT_TYPE.REFRESH_TOKEN,
          refresh_token: refreshToken,
          scope: this.scopes.join(" "),
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
    const url = this.googleAPIService.oauth2Client.generateAuthUrl({
      scope: this.scopes.join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
    });

    return url;
  }

  async getToken(code: string) {
    const { tokens } = await this.googleAPIService.oauth2Client.getToken(code);

    if (!tokens) {
      throw new Error(`The token isn't exist`);
    }

    return tokens;
  }

  async getAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error(`The refreshToken isn't exists`);
    }

    try {
      const accessToken = this.googleAPIService.getAccessToken(refreshToken);
      return accessToken;
    } catch (err) {
      throw new Error(`Get access token err: ${err}`);
    }
  }

  async getAllCustomerManagers(refreshToken: string) {
    try {
      const url = `${this.googleAPIService.GG_API_URL}${this.googleAPIService.GG_API_VERSION}/customers:listAccessibleCustomers`;
      const accessToken = await this.googleAPIService.getAccessToken(
        refreshToken
      );
      const headers = this.googleAPIService.createHeaderOptions(accessToken);
      this.googleAPIService.setRequestConfig(headers);

      const { data } = await this.googleAPIService.axiosInstance.get(url, {});
      return data;
    } catch (error) {
      console.error("Google API get customers has err:", JSON.stringify(error));
      throw error;
    }
  }

  async getAllAccounts({ customerId, refreshToken }: AdFetchTypeArgs) {
    try {
      const data = await this.googleAPIService
        .createQuery(AdTypes.CUSTOMER_CLIENT)
        .fetchData(refreshToken, customerId);
      return data;
    } catch (error) {
      console.error("Google API get accounts has err:", JSON.stringify(error));
      throw error;
    }
  }

  async fetchingAdsData({ customerId, loginCustomerId, adType, refreshToken }: AdFetchTypeArgs) {
    const data = await this.googleAPIService
      .createQuery(adType)
      .fetchData(refreshToken, customerId, loginCustomerId);
    return data;
  }

  async getCustomerDetail({ customerId, resourceName, refreshToken }: AdFetchTypeArgs) {
    try {
      const data = await this.googleAPIService
        .createQuery(AdTypes.CUSTOMER_DETAIL, { resourceName })
        .fetchData(refreshToken, customerId);
      return data;
    } catch (error) {
      console.error("Google API get accounts has err:", JSON.stringify(error));
      throw error;
    }
  }
}
