import mongoose from "mongoose";

export interface ISettings extends mongoose.Document {
    landingPageUrl: string;
    webhookUrl: string;
    publisherId: string;
    offerId: string;
    beneficiaryTenantId: string;
    purchaserTenantId: string;
    plans: {
        planId: string,
        displayName: string,
        isPrivate: boolean
    }[]
}

const SettingsSchema = new mongoose.Schema(
    {
        landingPageUrl: String,
        webhookUrl: String,
        publisherId: String,
        offerId: String,
        beneficiaryTenantId: String,
        purchaserTenantId: String,
        plans: [
            {
                planId: String,
                displayName: String,
                isPrivate: Boolean
            }
        ]

    }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);