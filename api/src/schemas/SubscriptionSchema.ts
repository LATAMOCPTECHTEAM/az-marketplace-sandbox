import mongoose from "mongoose";
import { ISubscription } from "models";

const SubscriptionSchemaDetails = new mongoose.Schema(
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

const SubscriptionSchema = mongoose.model<ISubscription & mongoose.Document>('Subscription', SubscriptionSchemaDetails);

export default SubscriptionSchema;
export type ISubscriptionSchema = typeof SubscriptionSchema;