import { injectable } from "tsyringe";

import { ISubscriptionService } from "../types";
import SubscriptionSchema, { ISubscription } from "../models/SubscriptionSchema";

@injectable()
export default class SubscriptionService implements ISubscriptionService {

    constructor() {

    }

    async activateSubscription(id: string, planId: string, quantity: string) {
        var subscription: ISubscription = await SubscriptionSchema.findOne({ id: id });

        if (subscription.saasSubscriptionStatus == "Subscribed")
            return;

        if (subscription.saasSubscriptionStatus != "NotStarted" && subscription.saasSubscriptionStatus != "PendingFulfillmentStart")
            throw new Error("To Activate a Subscription, the status must be 'NotStarted' or 'PendingFulfillmentStart'"); //TODO[VALIDATE]

        if (subscription.planId != planId)
            throw new Error("PlanId divergence."); //TODO[VALIDATE]

        var isSubQuantityEmpty = (subscription.quantity == null || subscription.quantity == undefined || subscription.quantity == "")
        var isQuantityEmpty = (quantity == null || quantity == undefined || quantity == "");

        if (!((isSubQuantityEmpty && isQuantityEmpty) || subscription.quantity == quantity))
            throw new Error("PlanId divergence."); //TODO[VALIDATE]


        subscription.saasSubscriptionStatus = "Subscribed"

        await SubscriptionSchema.updateOne({ id: subscription.id }, subscription);
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

    async deleteSubscription(id: string) {
        await SubscriptionSchema.deleteOne({ id: id });
    }

}