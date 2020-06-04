import mongoose from "mongoose";


export interface ISettings extends mongoose.Document {
    landingPageUrl: string;
    webhookUrl: string;
    publisherId: string;
    offerId: string;
    beneficiaryTenantId: string;
    purchaserTenantId: string;
    plans: string[]
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
                type: String
            }
        ]

    }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
