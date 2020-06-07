import mongoose from "mongoose";


export interface IOperation extends mongoose.Document {
    id: string;
    activityId: string;
    subscriptionId: string;
    offerId: string;
    publisherId: string;
    planId: string;
    quantity: string;
    action: string;
    timeStamp: string;
    status: string;
}


const OperationSchema = new mongoose.Schema(
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

export default mongoose.model<IOperation>('Operation', OperationSchema);
