export default interface ISettings {
    beneficiaryTenantId: string;
    landingPageUrl: string;
    offerId: string;
    plans: {
        displayName: string,
        isPrivate: boolean,
        planId: string
    }[],
    publisherId: string;
    purchaserTenantId: string;
    webhookUrl: string;
}