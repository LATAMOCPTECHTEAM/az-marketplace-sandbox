import mongoose from "mongoose";


export interface ISubscription extends mongoose.Document {
    id: string;
    name: string;
    publisherId: string;
    offerId: string;
    planId: string;
    quantity: string;
    beneficiary: {
        emailId: string,
        objectId: string,
        tenantId: string
    },
    purchaser: {
        emailId: string,
        objectId: string,
        tenantId: string
    },
    term: {
        startDate: string,
        endDate: string,
        termUnit: string,
    },
    allowedCustomerOperations: string[],
    sessionMode: string,
    isFreeTrial: boolean,
    isTest: boolean,
    sandboxType: string,
    saasSubscriptionStatus: string,
    creationDate: Date
}


const SubscriptionSchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        publisherId: String,
        offerId: String,
        planId: String,
        quantity: String,
        beneficiary: {
            emailId: String,
            objectId: String,
            tenantId: String
        },
        purchaser: {
            emailId: String,
            objectId: String,
            tenantId: String
        },
        term: {
            startDate: String,
            endDate: String,
            termUnit: String,
        },
        allowedCustomerOperations: [{
            type: String
        }],
        sessionMode: String,
        isFreeTrial: Boolean,
        isTest: Boolean,
        sandboxType: String,
        saasSubscriptionStatus: String,
        creationDate: Date
    }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);