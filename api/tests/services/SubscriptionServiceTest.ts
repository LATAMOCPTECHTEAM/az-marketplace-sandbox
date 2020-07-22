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
import { NotFoundError } from "../../src/errors";

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
    /*
        describe('list', () => {
            it('should run list command with args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm list --anything").returns(successResult);
    
                await expect(helm.list("--anything")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run list command without args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm list").returns(successResult);
    
                await expect(helm.list(null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the list command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "helm list" });
    
                await helm.list(null);
    
                expect(spyLogger.calledOnce).equals(true);
            });
        });
    
        describe('upgrade', () => {
            it('should run upgrade command with args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm upgrade nginx stable\\nginx --anything").returns(successResult);
    
                await expect(helm.upgrade("nginx", "stable\\nginx", "--anything")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run upgrade command without args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm upgrade nginx stable\\nginx").returns(successResult);
    
                await expect(helm.upgrade("nginx", "stable\\nginx", null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the upgrade command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "helm upgrade nginx stable\\nginx" });
    
                await helm.upgrade("nginx", "stable\\nginx", null);
                expect(spyLogger.calledOnce).equals(true);
            });
        });
    
        describe('delete', () => {
            it('should run delete command with args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm delete nginx --anything").returns(successResult);
    
                await expect(helm.delete("nginx", "--anything")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run delete command with args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm delete nginx").returns(successResult);
    
                await expect(helm.delete("nginx", null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the delete command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "helm delete nginx" });
    
                await helm.delete("nginx", null);
                expect(spyLogger.calledOnce).equals(true);
            });
        });
    
        describe('rollback', () => {
            it('should run rollback command with args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm rollback nginx 0 --anything").returns(successResult);
    
                await expect(helm.rollback("nginx", "0", "--anything")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run rollback command without args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm rollback nginx 0").returns(successResult);
    
                await expect(helm.rollback("nginx", "0", null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the rollback command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "helm rollback nginx 0" });
    
                await helm.rollback("nginx", "0", null);
                expect(spyLogger.calledOnce).equals(true);
            });
        });
    
        describe('get', () => {
            it('should run get command with args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm get all nginx --anything").returns(successResult);
    
                await expect(helm.get("all", "nginx", "--anything")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run get command without args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm get all nginx").returns(successResult);
    
                await expect(helm.get("all", "nginx", null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the get command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "helm get all nginx" });
    
                await helm.get("all", "nginx", null);
                expect(spyLogger.calledOnce).equals(true);
            });
        });
    
        describe('repoAdd', () => {
            it('should run repo add command without args & credentials parameters and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm repo add nginx nginx.url").returns(successResult);
    
                await expect(helm.repoAdd("nginx", "nginx.url", null, null, null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run repo add command with credentials parameters', async () => {
                var spy = execHelperStub.exec.withArgs("helm repo add nginx nginx.url --username username --password password").returns(successResult);
    
                await expect(helm.repoAdd("nginx", "nginx.url", "username", "password", null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run repo add command with args parameters', async () => {
                var spy = execHelperStub.exec.withArgs("helm repo add nginx nginx.url --anything").returns(successResult);
    
                await expect(helm.repoAdd("nginx", "nginx.url", null, null, "--anything")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the repo add command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "helm repo add nginx nginx.url" });
    
                await helm.repoAdd("nginx", "nginx.url", null, null, null);
                expect(spyLogger.calledOnce).equals(true);
            });
        });
    
        describe('repoUpdate', () => {
            it('should run repo update command with args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm repo update --anything").returns(successResult);
    
                await expect(helm.repoUpdate("--anything")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run repo update command without args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm repo update").returns(successResult);
    
                await expect(helm.repoUpdate(null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the repo update command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "helm repo update" });
    
                await helm.repoUpdate(null);
                expect(spyLogger.calledOnce).equals(true);
            });
        });
    
        describe('registryLogin', () => {
            it('should run registry login command with args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("export HELM_EXPERIMENTAL_OCI=1 && helm registry login host --username user --password password --anything").returns(successResult);
    
                await expect(helm.registryLogin("host", "user", "password", "--anything")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should run registry login command without args parameter and return result', async () => {
                var spy = execHelperStub.exec.withArgs("export HELM_EXPERIMENTAL_OCI=1 && helm registry login host --username user --password password").returns(successResult);
    
                await expect(helm.registryLogin("host", "user", "password", null)).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the registry login command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "export HELM_EXPERIMENTAL_OCI=1 && helm registry login host --username user --password password" });
    
                await helm.registryLogin("host", "user", "password", null);
                expect(spyLogger.calledOnce).equals(true);
            });
        });
    
        describe('command', () => {
            it('should run command command and return result', async () => {
                var spy = execHelperStub.exec.withArgs("helm version").returns(successResult);
    
                await expect(helm.command("version")).to.eventually.equal("Success");
                expect(spy.calledOnce).equals(true);
            });
    
            it('should log the command', async () => {
                execHelperStub.exec.returns(successResult);
                var spyLogger = loggerStub.log.withArgs({ level: "info", message: "helm version" });
    
                await helm.command("version");
                expect(spyLogger.calledOnce).equals(true);
            });
        });*/
});