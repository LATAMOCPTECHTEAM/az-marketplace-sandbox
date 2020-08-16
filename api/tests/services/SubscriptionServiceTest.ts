// Imports Default
import "reflect-metadata";
import 'mocha';
import chai, { expect } from 'chai';
// eslint-disable-next-line sort-imports
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { StubbedInstance, stubInterface } from "ts-sinon";

// Imports
import { ESubscriptionStatus } from "@enums";
import { ISubscription } from "@models";
import { ISubscriptionRepository } from "@types";
import { SubscriptionService } from "@services";

describe('Services: SubscriptionService', () => {
    let subscriptionRepository: StubbedInstance<ISubscriptionRepository>;
    let subscriptionService: SubscriptionService;
    beforeEach(() => {
        subscriptionRepository = stubInterface<ISubscriptionRepository>();
        subscriptionService = new SubscriptionService(subscriptionRepository);
    });

    function createDummySubscription(): ISubscription {
        return {
            id: "1",
            name: null,
            publisherId: null,
            offerId: null,
            planId: null,
            quantity: null,
            beneficiary: {
                emailId: null,
                objectId: null,
                tenantId: null
            },
            purchaser: {
                emailId: null,
                objectId: null,
                tenantId: null
            },
            term: {
                startDate: null,
                endDate: null,
                termUnit: null
            },
            allowedCustomerOperations: [],
            sessionMode: null,
            isFreeTrial: false,
            isTest: false,
            sandboxType: null,
            saasSubscriptionStatus: null,
            creationDate: new Date()
        };
    }

    function createDummySubscriptionValidForActivation(): ISubscription {
        return {
            id: "1",
            name: "Contoso",
            publisherId: "publisherId",
            offerId: "offerId",
            planId: "planId",
            quantity: "1",
            beneficiary: {
                emailId: "email@email",
                objectId: "631af03013954504a2b3025e1c2e5c8a",
                tenantId: "631af03013954504a2b3025e1c2e5c8a"
            },
            purchaser: {
                emailId: "email@email",
                objectId: "631af03013954504a2b3025e1c2e5c8a",
                tenantId: "631af03013954504a2b3025e1c2e5c8a"
            },
            term: {
                startDate: "2020-01-01",
                endDate: "2020-01-30",
                termUnit: "1PM"
            },
            allowedCustomerOperations: [],
            sessionMode: "None",
            isFreeTrial: false,
            isTest: false,
            sandboxType: "None",
            saasSubscriptionStatus: ESubscriptionStatus.PendingFulfillmentStart,
            creationDate: new Date()
        };
    }

    describe('getSubscription', () => {
        it('should return subscription from the database with the provided Id', async () => {
            const subscription = createDummySubscription();

            const spy = subscriptionRepository.getById.withArgs("1").resolves(subscription);

            await expect(subscriptionService.getSubscription("1")).to.eventually.equal(subscription);
            expect(spy.calledOnce).equals(true);
        });

        it('should throw an error if subscription is not found', async () => {
            const spy = subscriptionRepository.getById.withArgs("1").resolves(null);

            await expect(subscriptionService.getSubscription("1"))
                .to.eventually.be.rejectedWith("Subscription not found.")
                .property('name', 'NotFoundError');
            expect(spy.calledOnce).equals(true);
        });
    });


    describe('deleteSubscription', () => {
        it('should delete the subscription provided Id', async () => {
            const subscription = createDummySubscription();
            subscriptionRepository.getById.withArgs("1").resolves(subscription);
            const spy2 = subscriptionRepository.deleteById.withArgs("1").resolves(subscription);

            await subscriptionService.deleteSubscription("1");
            expect(spy2.calledOnce).equals(true);
        });

        it('should throw an error if subscription is not found', async () => {
            subscriptionRepository.getById.withArgs("1").resolves(null);
            const deleteSpy = subscriptionRepository.deleteById.withArgs("1");

            await expect(subscriptionService.getSubscription("1"))
                .to.eventually.be.rejectedWith("Subscription not found.")
                .property('name', 'NotFoundError');
            expect(deleteSpy.called).equals(false);
        });
    });

    describe('listSubscription', () => {
        it('should return the subscription list from the database ordered', async () => {
            const subscription = createDummySubscription();
            const subscriptionList = [subscription];
            const spy = subscriptionRepository.listByCreationDateDescending.resolves(subscriptionList);

            await expect(subscriptionService.listSubscription()).to.eventually.equal(subscriptionList);
            expect(spy.calledOnce).equals(true);
        });
    });

    describe('listSubscriptionPaged', () => {
        it('should return the subscription list from the database paged', async () => {
            const subscription = createDummySubscription();
            const subscriptionList = [subscription];
            const subscriptionPagedResult = { subscriptions: subscriptionList, nextSkip: 11 };
            const spy = subscriptionRepository.listPaged.withArgs(10, 10, "desc").resolves(subscriptionPagedResult);

            await expect(subscriptionService.listSubscriptionPaged(10)).to.eventually.equal(subscriptionPagedResult);
            expect(spy.calledOnce).equals(true);
        });
    });

    describe('createSubscription', () => {
        it('should create the subscription provided Id', async () => {
            const subscription = createDummySubscription();
            const spy = subscriptionRepository.getById.withArgs("1").resolves(null);
            const spy2 = subscriptionRepository.create.withArgs(subscription);

            await subscriptionService.createSubscription(subscription);
            expect(spy.calledOnce).equals(true);
            expect(spy2.calledOnce).equals(true);
        });

        it('should throw an error if subscription with the same id already exists', async () => {
            const subscription = createDummySubscription();
            const spy = subscriptionRepository.getById.withArgs(subscription.id).resolves(subscription);

            await expect(subscriptionService.createSubscription(subscription))
                .to.eventually.be.rejectedWith("Subscription already exists.")
                .property('name', 'BadRequestError');
            expect(spy.called).equals(true);
        });
    });

    describe('updateSubscription', () => {
        it('should update the subscription provided Id', async () => {
            const subscription = createDummySubscription();
            const updateSubscription = { ...subscription };
            updateSubscription.name = "sub2";
            const spy = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            const spy2 = subscriptionRepository.updateOne.withArgs(subscription.id, updateSubscription);

            await subscriptionService.updateSubscription(updateSubscription);
            expect(spy.calledOnce).equals(true);
            expect(spy2.calledOnce).equals(true);
        });

        it('should throw an error if subscription doest exists exists', async () => {
            const subscription = createDummySubscription();
            const updateSubscription = { ...subscription };
            updateSubscription.name = "sub2";
            const spy = subscriptionRepository.getById.withArgs("1").resolves(null);

            await expect(subscriptionService.updateSubscription(updateSubscription))
                .to.eventually.be.rejectedWith("Subscription not found.")
                .property('name', 'NotFoundError');
            expect(spy.called).equals(true);
        });
    });

    describe('activateSubscription', () => {
        it('should activate the subscription if all conditions are met', async () => {
            const subscription = createDummySubscriptionValidForActivation();
            const updateSubscription = { ...subscription };
            updateSubscription.saasSubscriptionStatus = ESubscriptionStatus.Subscribed;
            const spy = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            const spy2 = subscriptionRepository.updateOne.withArgs(subscription.id, updateSubscription);

            await subscriptionService.activateSubscription(subscription.id, subscription.planId, subscription.quantity);
            expect(spy.calledOnce).equals(true);
            expect(spy2.calledOnce).equals(true);
        });

        it('should should not update the subscription if status is already subscribed', async () => {
            const subscription = createDummySubscriptionValidForActivation();
            subscription.saasSubscriptionStatus = ESubscriptionStatus.Subscribed;
            const spyGet = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            const spyUpdate = subscriptionRepository.updateOne;

            await subscriptionService.activateSubscription(subscription.id, subscription.planId, subscription.quantity);
            expect(spyGet.calledOnce).equals(true);
            expect(spyUpdate.calledOnce).equals(false);
        });

        it('should thow an error if subscription status is different from PendingFulfillmentStart', async () => {
            const subscription = createDummySubscriptionValidForActivation();
            subscription.saasSubscriptionStatus = ESubscriptionStatus.Unsubscribed;
            const spyGet = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            const spyUpdate = subscriptionRepository.updateOne;

            await expect(subscriptionService.activateSubscription(subscription.id, subscription.planId, subscription.quantity))
                .to.eventually.be.rejectedWith("To Activate a Subscription, the status must be 'NotStarted' or 'PendingFulfillmentStart'")
                .property('name', 'BadRequestError');

            expect(spyGet.calledOnce).equals(true);
            expect(spyUpdate.calledOnce).equals(false);

        });

        it('should thow an error if subscription plan is different from the planId provided', async () => {
            const subscription = createDummySubscriptionValidForActivation();
            subscription.saasSubscriptionStatus = ESubscriptionStatus.PendingFulfillmentStart;
            const spyGet = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            const spyUpdate = subscriptionRepository.updateOne;

            await expect(subscriptionService.activateSubscription(subscription.id, "anythingelse", subscription.quantity))
                .to.eventually.be.rejectedWith("PlanId divergence.")
                .property('name', 'BadRequestError');

            expect(spyGet.calledOnce).equals(true);
            expect(spyUpdate.calledOnce).equals(false);

        });

        it('should thow an error if subscription quantity is different from the quantity provided', async () => {
            const subscription = createDummySubscriptionValidForActivation();
            const spyGet = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            const spyUpdate = subscriptionRepository.updateOne;

            await expect(subscriptionService.activateSubscription(subscription.id, subscription.planId, "2"))
                .to.eventually.be.rejectedWith("Quantity divergence.")
                .property('name', 'BadRequestError');

            expect(spyGet.calledOnce).equals(true);
            expect(spyUpdate.calledOnce).equals(false);

        });

        it('should activate the subscription if all conditions are met with quantities null', async () => {
            const subscription = createDummySubscriptionValidForActivation();
            subscription.quantity = null;
            const updateSubscription = { ...subscription };
            updateSubscription.saasSubscriptionStatus = ESubscriptionStatus.Subscribed;
            const spy = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            const spy2 = subscriptionRepository.updateOne.withArgs(subscription.id, updateSubscription);

            await subscriptionService.activateSubscription(subscription.id, subscription.planId, undefined);
            expect(spy.calledOnce).equals(true);
            expect(spy2.calledOnce).equals(true);
        });

    });
});