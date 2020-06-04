import { injectable } from "tsyringe";

import { ISubscriptionService } from "../types";
import SubscriptionSchema, { ISubscription } from "../models/SubscriptionSchema";

@injectable()
export default class SubscriptionService implements ISubscriptionService {

    constructor() {

    }

    async updateSubscription(subscription: ISubscription) {
        await SubscriptionSchema.findOneAndUpdate({ id: subscription.id }, subscription);
    }

    async createSubscription(subscription: ISubscription) {
        await SubscriptionSchema.create(subscription);
    }

    async getSubscription(id: string): Promise<ISubscription> {
        var subscription = await SubscriptionSchema.findOne({ id: id });
        return subscription;
    }

    async listSubscription(): Promise<ISubscription[]> {
        var subscriptionList = await SubscriptionSchema.find();
        return subscriptionList;
    }

}