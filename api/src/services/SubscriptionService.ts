import { inject, injectable } from "tsyringe";

import { ESubscriptionStatus } from "@enums";
import { ISubscription } from "@models";
import { BadRequestError, NotFoundError } from "@errors";
import { ISubscriptionRepository, ISubscriptionService } from "@types";

@injectable()
export default class SubscriptionService implements ISubscriptionService {

    constructor(@inject("ISubscriptionRepository") private subscriptionRepository: ISubscriptionRepository) {
    }

    async listSubscriptionPaged(skip: number): Promise<{ nextSkip: number; subscriptions: ISubscription[]; }> {
        const pagedList = await this.subscriptionRepository.listPaged(skip, 10, "desc");
        return pagedList;
    }

    async activateSubscription(id: string, planId: string, quantity: string) {
        const subscription: ISubscription = await this.subscriptionRepository.getById(id);

        if (subscription.saasSubscriptionStatus === ESubscriptionStatus.Subscribed)
            return;

        if (subscription.saasSubscriptionStatus !== ESubscriptionStatus.PendingFulfillmentStart)
            throw new BadRequestError("To Activate a Subscription, the status must be 'NotStarted' or 'PendingFulfillmentStart'");

        if (subscription.planId !== planId)
            throw new BadRequestError("PlanId divergence.");

        if (!!(subscription.quantity) || !!(quantity)) {
            if (subscription.quantity !== quantity) {
                throw new BadRequestError("Quantity divergence.");
            }
        }

        subscription.saasSubscriptionStatus = ESubscriptionStatus.Subscribed;

        await this.subscriptionRepository.updateOne(subscription.id, subscription);
    }

    async updateSubscription(subscription: ISubscription) {
        await this.getSubscription(subscription.id);
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
        const subscription = await this.subscriptionRepository.getById(id);
        if (!subscription) {
            throw new NotFoundError("Subscription not found.");
        }
        return subscription;
    }

    async listSubscription(): Promise<ISubscription[]> {
        return this.subscriptionRepository.listByCreationDateDescending();
    }

    async deleteSubscription(id: string) {
        await this.getSubscription(id);
        await this.subscriptionRepository.deleteById(id);
    }
}