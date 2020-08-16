import { ESubscriptionStatus } from "@enums";
export default interface ISubscription {
    allowedCustomerOperations: string[],
    beneficiary: {
        emailId: string,
        objectId: string,
        tenantId: string
    },
    creationDate: Date,
    id: string;
    isFreeTrial: boolean,
    isTest: boolean,
    name: string;
    offerId: string;
    planId: string;
    publisherId: string;
    purchaser: {
        emailId: string,
        objectId: string,
        tenantId: string
    },
    quantity: string;
    saasSubscriptionStatus: ESubscriptionStatus,
    sandboxType: string,
    sessionMode: string,
    term: {
        endDate: string,
        startDate: string,
        termUnit: string,
    }
}