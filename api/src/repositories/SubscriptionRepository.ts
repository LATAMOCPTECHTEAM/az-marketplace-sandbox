import { inject, injectable } from "tsyringe";

import { ISubscription } from "@models";
import { ISubscriptionRepository } from "@types";
import { ISubscriptionSchema } from "@schemas";

@injectable()
export default class SubscriptionRepository implements ISubscriptionRepository {

    constructor(@inject("SubscriptionSchema") private subscriptionSchema: ISubscriptionSchema) {
    }

    async listPaged(skip: number, take: number, order: string = "desc"): Promise<{ nextSkip: number; subscriptions: ISubscription[]; }> {
        let nextSkip = 0;
        const totalSubscriptions = await this.subscriptionSchema.count({});
        const subscriptionList = await this.subscriptionSchema.find({})
            .sort(order)
            .skip(skip)
            .limit(take);
        if (skip + subscriptionList.length < totalSubscriptions) {
            nextSkip = skip + subscriptionList.length;
        }
        return { subscriptions: subscriptionList, nextSkip: nextSkip };
    }

    async updateOne(id: string, subscription: ISubscription) {
        await this.subscriptionSchema.findOneAndUpdate({ id: id }, subscription);
    }

    async create(subscription: ISubscription) {
        await this.subscriptionSchema.create(subscription);
    }

    async getById(id: string): Promise<ISubscription> {
        return this.subscriptionSchema.findOne({ id: id });
    }

    async listByCreationDateDescending(): Promise<ISubscription[]> {
        return this.subscriptionSchema.find({}, null, { sort: { creationDate: -1 } });
    }

    async deleteById(id: string) {
        await this.subscriptionSchema.deleteOne({ id: id });
    }
}