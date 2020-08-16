// Imports Default
import "reflect-metadata";
import chai, { expect } from 'chai';
// eslint-disable-next-line sort-imports
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import 'mocha';
import { StubbedInstance, stubInterface as StubInterface } from "ts-sinon";

// Imports
import { ISettings } from "@models";
import { ISettingsRepository } from "@types";
import { SettingsService } from "@services";

describe('Services: SubscriptionService', () => {
    let settingsRepository: StubbedInstance<ISettingsRepository>;
    let settingsService: SettingsService;
    beforeEach(() => {
        settingsRepository = StubInterface<ISettingsRepository>();
        settingsService = new SettingsService(settingsRepository);
    });

    function createDummySettings() {
        const settings: ISettings = {
            beneficiaryTenantId: "tenantId",
            landingPageUrl: "landingPageUrl",
            offerId: "offerId",
            plans: [
                {
                    displayName: "Plan 1",
                    isPrivate: false,
                    planId: "plan1"
                },
                {
                    displayName: "Plan 2",
                    isPrivate: true,
                    planId: "plan2"
                }],
            publisherId: "pulbisherId",
            purchaserTenantId: "purchaserId",
            webhookUrl: "webhookUrl"
        }
        return settings;
    }

    describe('updateSettings', () => {
        it('should createOrUpdate settings in the database', async () => {
            const settings = createDummySettings();

            const spy = settingsRepository.createOrUpdate.withArgs(settings);

            await settingsService.updateSettings(settings);
            expect(spy.calledOnce).equals(true);
        });
    });

    describe('getSettings', () => {
        it('should get settings from the database', async () => {
            const settings = createDummySettings();

            const spy = settingsRepository.get.returns(Promise.resolve(settings));

            await expect(settingsService.getSettings()).to.eventually.equal(settings);

            expect(spy.calledOnce).equals(true);
        });
    });
});