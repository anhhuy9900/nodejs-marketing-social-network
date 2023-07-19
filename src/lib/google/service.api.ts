import axios, { AxiosInstance } from "axios";
import { google, Common } from "googleapis";
import {
  GG_CLIENT_ID,
  GG_CLIENT_SECRET,
  GG_CALLBACK_URL,
  GG_API_URL,
  GG_API_VERSION,
  GG_DEVELOPER_TOKEN,
} from "../../constants";

import { QUERY_TABLES } from "./constants";
import { QueryOptionArgs, AdTypes } from "./interfaces";

export class GoogleAPIService {
  public readonly axiosInstance: AxiosInstance;
  public readonly GG_API_URL: string;
  public readonly GG_API_VERSION: string;
  private readonly DEVELOPER_TOKEN: string;
  public readonly oauth2Client: Common.OAuth2Client;
  protected type?: AdTypes;
  protected queryString?: string;

  constructor() {
    this.GG_API_VERSION = GG_API_VERSION;
    this.GG_API_URL = GG_API_URL;
    this.axiosInstance = axios.create({
      validateStatus: (status: number) => {
        return status >= 200 && status <= 500;
      },
    });
    this.DEVELOPER_TOKEN = GG_DEVELOPER_TOKEN;
    this.oauth2Client = new google.auth.OAuth2(
      GG_CLIENT_ID,
      GG_CLIENT_SECRET,
      GG_CALLBACK_URL
    );
  }

  setRequestConfig(headers: Record<string, any>): void {
    this.axiosInstance.defaults.baseURL = this.GG_API_URL;
    Object.keys(headers).forEach((headerKey: string) => {
      this.axiosInstance.defaults.headers.common[headerKey] =
        headers[headerKey];
    });
  }

  /**
   * Get access token by using refresh token
   */
  async getAccessToken(refreshToken: string): Promise<string> {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { token } = await this.oauth2Client.getAccessToken();
      if (!token) {
        throw new Error("Access token not found");
      }

      return token;
    } catch (err) {
      console.error("Google API get access token err: ", err);
      throw new Error(`Access token err: ${err}`);
    }
  }

  createQuery(
    type: AdTypes | undefined,
    { resourceName }: QueryOptionArgs = {}
  ) {
    if (!type) {
      throw new Error("The google ads type is not null");
    }
    let selects: string[] | string = [];
    let from: string = "";
    let where: string[] | string = [];
    let orderBy: string[] | string = [];
    let limit: number = 0;
    switch (type) {
      case AdTypes.CAMPAIGN:
        selects = [
          ...selects,
          "campaign.id",
          "campaign.name",
          "campaign.bidding_strategy_type",
          "campaign_budget.amount_micros",
          "metrics.cost_micros",
          "metrics.clicks",
          "metrics.impressions",
          "metrics.all_conversions",
        ];
        from = QUERY_TABLES.CAMPAIGN;
        break;
      case AdTypes.AD_GROUP:
        selects = [
          ...selects,
          "campaign.id",
          "campaign.name",
          "ad_group.name",
          "ad_group.id",
          "metrics.cost_micros",
          "metrics.clicks",
          "metrics.impressions",
          "metrics.all_conversions",
        ];
        from = QUERY_TABLES.AD_GROUP;
        break;
      case AdTypes.AD:
        selects = [
          ...selects,
          "campaign.id",
          "campaign.name",
          "ad_group.name",
          "ad_group.id",
          "ad_group_ad.ad.id",
          "ad_group_ad.ad.name",
          "ad_group_ad.ad.resource_name",
          "metrics.cost_micros",
          "metrics.clicks",
          "metrics.impressions",
          "metrics.all_conversions",
        ];
        (where = [...where]), (from = QUERY_TABLES.AD);
        break;
      case AdTypes.CUSTOMER_CLIENT:
        selects = [
          ...selects,
          "customer_client.id",
          "customer_client.resource_name",
          "customer_client.descriptive_name",
          "customer_client.manager",
        ];
        where = [
          ...where,
          //   `customer_client.resource_name = '${resourceName}'`,
          //   `customer_client.client_customer != '${resourceName}'`,
          `customer_client.manager != TRUE`,
        ];
        from = QUERY_TABLES.CUSTOMER_CLIENT;
        break;
      case AdTypes.CUSTOMER_DETAIL:
        selects = [
          ...selects,
          "customer.id",
          "customer.descriptive_name",
          "customer.manager",
          "customer.test_account",
        ];
        (where = [
          ...where,
          `customer.resource_name = '${resourceName}'`,
          `customer.manager != TRUE`,
        ]),
          (from = QUERY_TABLES.CUSTOMER);
        break;
    }

    selects = selects.join(",");

    let query = `SELECT ${selects} FROM ${from}`;

    if (where.length) {
      query = `${query} WHERE ${where.join(" AND ")}`;
    }

    if (orderBy.length) {
      query = `${query} ORDER BY ${orderBy.join(",")}`;
    }

    if (limit) {
      query = `${query} LIMIT ${limit}`;
    }
    console.log(
      "🚀 ------------------------------------------------------------------------------🚀"
    );
    console.log(
      "🚀 ~ file: service.api.ts:140 ~ GoogleAPiService ~ createQuery ~ query:",
      query
    );

    this.queryString = query;

    return this;
  }

  createHeaderOptions(accessToken: string, loginCustomerId?: string): object {
    let headers: object = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "developer-token": this.DEVELOPER_TOKEN,
    };

    if (loginCustomerId) {
      headers = { ...headers, "login-customer-id": loginCustomerId };
    }

    return headers;
  }

  private createQueryUrl(customerId?: string): string {
    return `${this.GG_API_URL}${this.GG_API_VERSION}/customers/${customerId}/googleAds:search`;
  }

  async fetchData(
    refreshToken: string,
    customerId?: string,
    loginCustomerId?: string
  ) {
    try {
      const accessToken = await this.getAccessToken(refreshToken);
      console.log(
        "🚀 ----------------------------------------------------------------------------🚀"
      );
      console.log(
        "🚀 ~ file: service.api.ts:212 ~ GoogleAPIService ~ accessToken:",
        accessToken
      );

      const endpoint = this.createQueryUrl(customerId);
      const headers = this.createHeaderOptions(accessToken, loginCustomerId);
      this.setRequestConfig(headers);

      const { data, status } = await this.axiosInstance.post(endpoint, {
        query: this.queryString,
      });

      if (data.error) {
        console.error(JSON.stringify(data.error), {
          endpoint,
          query: this.queryString,
        });
        throw new Error("Google API has error: " + data.error.message);
      }

      return data;
    } catch (error) {
      console.error("Google API fetch data has err:", JSON.stringify(error));
      throw error;
    }
  }
}
