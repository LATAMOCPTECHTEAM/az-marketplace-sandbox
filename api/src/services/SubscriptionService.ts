import { injectable, inject } from "tsyringe";

import { ESubscriptionStatus } from "../enums";

import { ISubscriptionService, ISubscriptionRepository } from "types";
import { ISubscription } from "models";

import { NotFoundError, BadRequestError, ValidationError } from "../errors";

@injectable()
export default class SubscriptionService implements ISubscriptionService {

    constructor(@inject("ISubscriptionRepository") private subscriptionRepository: ISubscriptionRepository) {
    }

    async listSubscriptionPaged(skip: number): Promise<{ subscriptions: ISubscription[]; nextSkip: number; }> {
        let pagedList = await this.subscriptionRepository.listPaged(skip, 10, "desc");
        return pagedList;
    }

    async activateSubscription(id: string, planId: string, quantity: string) {
        var subscription: ISubscription = await this.subscriptionRepository.getById(id);

        if (subscription.saasSubscriptionStatus == "Subscribed")
            return;

        if (subscription.saasSubscriptionStatus != "PendingFulfillmentStart")
            throw new BadRequestError("To Activate a Subscription, the status must be 'NotStarted' or 'PendingFulfillmentStart'");

        if (subscription.planId != planId)
            throw new BadRequestError("PlanId divergence.");

        if (!!(subscription.quantity) || !!(quantity)) {
            if (subscription.quantity != quantity) {
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
        await this.getSubscription(id);
        await this.subscriptionRepository.deleteById(id);
    }
}