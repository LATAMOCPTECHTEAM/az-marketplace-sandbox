import mongoose from "mongoose";
import { IOperation } from "models";

const OperationSchemaDetails = new mongoose.Schema(
    {
        id: String,
        activityId: String,
        subscriptionId: String,
        offerId: String,
        publisherId: String,
        planId: String,
        quantity: String,
        action: String,
        timeStamp: String,
        status: String,
    }
);

const OperationSchema = mongoose.model<IOperation & mongoose.Document>('Operation', OperationSchemaDetails);

export default OperationSchema;
export type IOperationSchema = typeof OperationSchema;