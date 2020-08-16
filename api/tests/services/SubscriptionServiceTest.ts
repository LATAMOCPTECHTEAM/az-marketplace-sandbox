//# Imports Default
import "reflect-metadata";
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import 'mocha';
import { StubbedInstance, stubInterface as StubInterface } from "ts-sinon";

//# Imports
import SubscriptionService from "../../src/services/SubscriptionService";
import { ISubscriptionRepository } from "../../src/types";
import { ISubscription } from "../../src/models";
import { ESubscriptionStatus } from "../../src/enums";

describe('Services: SubscriptionService', () => {
    let subscriptionRepository: StubbedInstance<ISubscriptionRepository>;
    let subscriptionService: SubscriptionService;
    beforeEach(() => {
        subscriptionRepository = StubInterface<ISubscriptionRepository>();
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
            let subscription = createDummySubscription();

            let spy = subscriptionRepository.getById.withArgs("1").resolves(subscription);

            await expect(subscriptionService.getSubscription("1")).to.eventually.equal(subscription);
            expect(spy.calledOnce).equals(true);
        });

        it('should throw an error if subscription is not found', async () => {
            let spy = subscriptionRepository.getById.withArgs("1").resolves(null);

            await expect(subscriptionService.getSubscription("1"))
                .to.eventually.be.rejectedWith("Subscription not found.")
                .property('name', 'NotFoundError');
            expect(spy.calledOnce).equals(true);
        });
    });


    describe('deleteSubscription', () => {
        it('should delete the subscription provided Id', async () => {
            let subscription = createDummySubscription();
            subscriptionRepository.getById.withArgs("1").resolves(subscription);
            let spy2 = subscriptionRepository.deleteById.withArgs("1").resolves(subscription);

            await subscriptionService.deleteSubscription("1");
            expect(spy2.calledOnce).equals(true);
        });

        it('should throw an error if subscription is not found', async () => {
            subscriptionRepository.getById.withArgs("1").resolves(null);
            let deleteSpy = subscriptionRepository.deleteById.withArgs("1");

            await expect(subscriptionService.getSubscription("1"))
                .to.eventually.be.rejectedWith("Subscription not found.")
                .property('name', 'NotFoundError');
            expect(deleteSpy.called).equals(false);
        });
    });

    describe('listSubscription', () => {
        it('should return the subscription list from the database ordered', async () => {
            let subscription = createDummySubscription();
            let subscriptionList = [subscription];
            let spy = subscriptionRepository.listByCreationDateDescending.resolves(subscriptionList);

            await expect(subscriptionService.listSubscription()).to.eventually.equal(subscriptionList);
            expect(spy.calledOnce).equals(true);
        });
    });

    describe('listSubscriptionPaged', () => {
        it('should return the subscription list from the database paged', async () => {
            let subscription = createDummySubscription();
            let subscriptionList = [subscription];
            let subscriptionPagedResult = { subscriptions: subscriptionList, nextSkip: 11 };
            let spy = subscriptionRepository.listPaged.withArgs(10, 10, "desc").resolves(subscriptionPagedResult);

            await expect(subscriptionService.listSubscriptionPaged(10)).to.eventually.equal(subscriptionPagedResult);
            expect(spy.calledOnce).equals(true);
        });
    });

    describe('createSubscription', () => {
        it('should create the subscription provided Id', async () => {
            let subscription = createDummySubscription();
            let spy = subscriptionRepository.getById.withArgs("1").resolves(null);
            let spy2 = subscriptionRepository.create.withArgs(subscription);

            await subscriptionService.createSubscription(subscription);
            expect(spy.calledOnce).equals(true);
            expect(spy2.calledOnce).equals(true);
        });

        it('should throw an error if subscription with the same id already exists', async () => {
            let subscription = createDummySubscription();
            let spy = subscriptionRepository.getById.withArgs(subscription.id).resolves(subscription);

            await expect(subscriptionService.createSubscription(subscription))
                .to.eventually.be.rejectedWith("Subscription already exists.")
                .property('name', 'BadRequestError');
            expect(spy.called).equals(true);
        });
    });

    describe('updateSubscription', () => {
        it('should update the subscription provided Id', async () => {
            let subscription = createDummySubscription();
            let updateSubscription = { ...subscription };
            updateSubscription.name = "sub2";
            let spy = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            let spy2 = subscriptionRepository.updateOne.withArgs(subscription.id, updateSubscription);

            await subscriptionService.updateSubscription(updateSubscription);
            expect(spy.calledOnce).equals(true);
            expect(spy2.calledOnce).equals(true);
        });

        it('should throw an error if subscription doest exists exists', async () => {
            let subscription = createDummySubscription();
            let updateSubscription = { ...subscription };
            updateSubscription.name = "sub2";
            let spy = subscriptionRepository.getById.withArgs("1").resolves(null);

            await expect(subscriptionService.updateSubscription(updateSubscription))
                .to.eventually.be.rejectedWith("Subscription not found.")
                .property('name', 'NotFoundError');
            expect(spy.called).equals(true);
        });
    });

    describe('activateSubscription', () => {
        it('should activate the subscription if all conditions are met', async () => {
            let subscription = createDummySubscriptionValidForActivation();
            let updateSubscription = { ...subscription };
            updateSubscription.saasSubscriptionStatus = ESubscriptionStatus.Subscribed;
            let spy = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            let spy2 = subscriptionRepository.updateOne.withArgs(subscription.id, updateSubscription);

            await subscriptionService.activateSubscription(subscription.id, subscription.planId, subscription.quantity);
            expect(spy.calledOnce).equals(true);
            expect(spy2.calledOnce).equals(true);
        });

        it('should should not update the subscription if status is already subscribed', async () => {
            let subscription = createDummySubscriptionValidForActivation();
            subscription.saasSubscriptionStatus = ESubscriptionStatus.Subscribed;
            let spyGet = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            let spyUpdate = subscriptionRepository.updateOne;

            await subscriptionService.activateSubscription(subscription.id, subscription.planId, subscription.quantity);
            expect(spyGet.calledOnce).equals(true);
            expect(spyUpdate.calledOnce).equals(false);
        });

        it('should thow an error if subscription status is different from PendingFulfillmentStart', async () => {
            let subscription = createDummySubscriptionValidForActivation();
            subscription.saasSubscriptionStatus = ESubscriptionStatus.Unsubscribed;
            let spyGet = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            let spyUpdate = subscriptionRepository.updateOne;

            await expect(subscriptionService.activateSubscription(subscription.id, subscription.planId, subscription.quantity))
                .to.eventually.be.rejectedWith("To Activate a Subscription, the status must be 'NotStarted' or 'PendingFulfillmentStart'")
                .property('name', 'BadRequestError');

            expect(spyGet.calledOnce).equals(true);
            expect(spyUpdate.calledOnce).equals(false);

        });

        it('should thow an error if subscription plan is different from the planId provided', async () => {
            let subscription = createDummySubscriptionValidForActivation();
            subscription.saasSubscriptionStatus = ESubscriptionStatus.PendingFulfillmentStart;
            let spyGet = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            let spyUpdate = subscriptionRepository.updateOne;

            await expect(subscriptionService.activateSubscription(subscription.id, "anythingelse", subscription.quantity))
                .to.eventually.be.rejectedWith("PlanId divergence.")
                .property('name', 'BadRequestError');

            expect(spyGet.calledOnce).equals(true);
            expect(spyUpdate.calledOnce).equals(false);

        });

        it('should thow an error if subscription quantity is different from the quantity provided', async () => {
            let subscription = createDummySubscriptionValidForActivation();
            let spyGet = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            let spyUpdate = subscriptionRepository.updateOne;

            await expect(subscriptionService.activateSubscription(subscription.id, subscription.planId, "2"))
                .to.eventually.be.rejectedWith("Quantity divergence.")
                .property('name', 'BadRequestError');

            expect(spyGet.calledOnce).equals(true);
            expect(spyUpdate.calledOnce).equals(false);

        });

        it('should activate the subscription if all conditions are met with quantities null', async () => {
            let subscription = createDummySubscriptionValidForActivation();
            subscription.quantity = null;
            let updateSubscription = { ...subscription };
            updateSubscription.saasSubscriptionStatus = ESubscriptionStatus.Subscribed;
            let spy = subscriptionRepository.getById.withArgs("1").resolves(subscription);
            let spy2 = subscriptionRepository.updateOne.withArgs(subscription.id, updateSubscription);

            await subscriptionService.activateSubscription(subscription.id, subscription.planId, undefined);
            expect(spy.calledOnce).equals(true);
            expect(spy2.calledOnce).equals(true);
        });

    });
});