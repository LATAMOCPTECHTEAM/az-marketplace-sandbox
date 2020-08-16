import mongoose from "mongoose";

import { ISettings } from "@models";

const SettingsSchemaDetails = new mongoose.Schema(
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

const SettingsSchema = mongoose.model<ISettings & mongoose.Document>('Settings', SettingsSchemaDetails);

export default SettingsSchema;
export type ISettingsSchema = typeof SettingsSchema;