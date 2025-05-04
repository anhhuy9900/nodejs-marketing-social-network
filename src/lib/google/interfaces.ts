
export interface CreateQuery {
    selects?: string[], 
    from: string,
    where?: string[], 
    orderBy?: string[], 
    limit?: number, 
}

export interface CreateQueryOptionArgs extends Omit<CreateQuery, 'from'> {
    resourceName?: string,
}

export enum AdTypes {
    CUSTOMER_DETAIL = 'customerDetail',
    CAMPAIGN = 'campaign',
    AD_GROUP = 'adGroup',
    AD = 'ad',
    CUSTOMER_CLIENT = 'customerClient'
}

export interface AdFetchTypeArgs {
    refreshToken: string
    customerId?: string, 
    loginCustomerId?: string, 
    adType?: AdTypes, 
    resourceName?: string,
}

export interface HttpHeaderOptions {
    "Content-Type": string,
    Authorization: string,
    "developer-token": string,
    "login-customer-id"?: string,
}

export interface HttpRequestOptions {
    url: string,
}