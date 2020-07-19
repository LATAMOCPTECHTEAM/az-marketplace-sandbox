import { injectable, inject } from "tsyringe";

import { ISubscriptionService, ISubscriptionRepository } from "types";
import { ISubscription } from "models";
import { NotFoundError, BadRequestError } from "../errors";

@injectable()
export default class SubscriptionService implements ISubscriptionService {

    constructor(@inject("ISubscriptionRepository") private subscriptionRepository: ISubscriptionRepository) {
    }

    async listSubscriptionPaged(skip: number): Promise<{ subscriptions: ISubscription[]; nextSkip: number; }> {
        var { nextSkip, subscriptions } = await this.subscriptionRepository.listPaged(skip, 10, "desc");
        return { subscriptions, nextSkip };
    }

    async activateSubscription(id: string, planId: string, quantity: string) {
        var subscription: ISubscription = await this.subscriptionRepository.getById(id);

        if (subscription.saasSubscriptionStatus == "Subscribed")
            return;

        if (subscription.saasSubscriptionStatus != "NotStarted" && subscription.saasSubscriptionStatus != "PendingFulfillmentStart")
            throw new Error("To Activate a Subscription, the status must be 'NotStarted' or 'PendingFulfillmentStart'"); //TODO[VALIDATE]

        if (subscription.planId != planId)
            throw new Error("PlanId divergence."); //TODO[VALIDATE]

        var isSubQuantityEmpty = (subscription.quantity == null || subscription.quantity == undefined || subscription.quantity == "")
        var isQuantityEmpty = (quantity == null || quantity == undefined || quantity == "");

        if (!((isSubQuantityEmpty && isQuantityEmpty) || subscription.quantity == quantity))
            throw new Error("Quantity divergence."); //TODO[VALIDATE]

        subscription.saasSubscriptionStatus = "Subscribed"

        await this.subscriptionRepository.updateOne(subscription.id, subscription);
    }

    async updateSubscription(subscription: ISubscription) {
        await this.subscriptionRepository.updateOne(subscription.id, subscription);
    }

    async createSubscription(subscription: ISubscription): Promise<void> {
        if (await this.subscriptionRepository.getById(subscription.id)) {
            throw new BadRequestError("Subscription already exists.");
        }
        subscription.creationDate = new Date();
        await this.subscriptionRepository.create(subscription);
    }

    async getSubscription(id: string): Promise<ISubscription> {
        let subscription = await this.subscriptionRepository.getById(id);
        if (!subscription) {
            throw new NotFoundError("Subscription not found.");
        }
        return subscription;
    }

    async listSubscription(): Promise<ISubscription[]> {
        return this.subscriptionRepository.listByCreationDateDescending();
    }

    async deleteSubscription(id: string) {
        let subscription = await this.getSubscription(id);
        await this.subscriptionRepository.deleteById(id);
    }

}