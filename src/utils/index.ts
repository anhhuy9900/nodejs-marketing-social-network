// @TODO

export const getCustomerId = (resourceName: string) => {
    return resourceName.split('/')[1];
}