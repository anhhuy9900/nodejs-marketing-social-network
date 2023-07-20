import axios, { AxiosInstance } from "axios";
import {
  FB_API_URL,
  FB_API_VERSION
} from "../../constants";
import { LIMIT_RECORDS } from './constants';
import { FbUserProfile } from './interfaces';


export class FacebookAPIService {
  public readonly axiosInstance: AxiosInstance;
  public readonly FB_API_URL: string;
  public readonly FB_API_VERSION: string;
  protected queryString?: string;

  constructor() {
    this.FB_API_VERSION = FB_API_VERSION;
    this.FB_API_URL = FB_API_URL;
    this.axiosInstance = axios.create({
      validateStatus: (status: number) => {
        return status >= 200 && status <= 500;
      },
    });
  }

  setRequestConfig(headers: Record<string, any>): void {
    this.axiosInstance.defaults.baseURL = this.FB_API_URL;
    if (headers?.length) {
      Object.keys(headers).forEach((headerKey: string) => {
        this.axiosInstance.defaults.headers.common[headerKey] =
          headers[headerKey];
      });
    }
  }

  getAdsEndpoint() {
    return `${this.FB_API_URL}/${this.FB_API_VERSION}`;
  }

  async fetchData<T extends any>(endpoint: string, params: object): Promise<T> {
    try {

      this.setRequestConfig([]);

      const { data, status } = await this.axiosInstance.get(endpoint, {
          params,
      });

      if (data.error) {
        console.error(JSON.stringify(data.error), {
          endpoint,
          query: params
        });
        throw new Error("Facebook API has error: " + data.error.message);
      }

      return data as T;

    } catch (err) {
      console.error("Facebook API fetch data has err:", JSON.stringify(err));
      throw err;
    }
  }

  async getProfile(accessToken: string) {
    const endpoint = `${this.FB_API_URL}/me`;
    return await this.fetchData<FbUserProfile>(endpoint, {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: accessToken,
    });
  }

  async getUserPermission(accessToken: string) {
    const endpoint = `${this.FB_API_URL}/me/permissions`;
    return await this.fetchData(endpoint, {
      access_token: accessToken,
    });
  }

  async getAdAccounts(userId: string, accessToken: string) {
    const endpoint = `${this.FB_API_URL}/${userId}/adaccounts`;
    return await this.fetchData(endpoint, {
      limit: LIMIT_RECORDS,
      fields: ['id', 'name'],
      access_token: accessToken,
    });
  }

  async getCampaigns(accountId: string, accessToken: string) {
    const endpoint = `${this.FB_API_URL}/${accountId}/campaigns`;
    return await this.fetchData(endpoint, {
      limit: LIMIT_RECORDS,
      fields: ['name', 'status', 'daily_budget', 'adlabels'],
      access_token: accessToken,
    });
  }

  async getAdsets(accountId: string, accessToken: string) {
    const endpoint = `${this.FB_API_URL}/${accountId}/adsets`;
    return await this.fetchData(endpoint, {
      limit: LIMIT_RECORDS,
      fields: ['campaign_id', 'name', 'id', 'status', 'promoted_object'],
      access_token: accessToken,
    });
  }

  async getAds(accountId: string, accessToken: string) {
    const endpoint = `${this.FB_API_URL}/${accountId}/ads`;
    const creativeFields = `creative{${[
      'image_hash',
      'thumbnail_id',
      'thumbnail_url',
      'video_id',
      'object_story_spec',
      'object_type',
      'body',
      'asset_feed_spec',
      'platform_customizations',
    ].join(',')}}`;

    return await this.fetchData(endpoint, {
      limit: LIMIT_RECORDS,
      fields: ['id', 'name', 'status', 'adset_id', 'campaign_id', creativeFields],
      access_token: accessToken,
    });
  }

  async getAdImages(accountId: string, accessToken: string) {
    const endpoint = `${this.FB_API_URL}/${accountId}/adimages`;
    return await this.fetchData(endpoint, {
      limit: LIMIT_RECORDS,
      fields: ['permalink_url', 'hash'],
      access_token: accessToken,
    });
  }
}
