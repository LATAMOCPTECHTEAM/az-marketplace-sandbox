import { injectable, inject } from "tsyringe";

import { ISettingsService, ISettingsRepository } from "types";
import { ISettings } from "models";

@injectable()
export default class SettingsService implements ISettingsService {

    constructor(@inject("ISettingsRepository") private settingsRepository: ISettingsRepository) {

    }

    async updateSettings(settings: ISettings) {
        return this.settingsRepository.createOrUpdate(settings);
    }

    async getSettings(): Promise<ISettings> {
        return this.settingsRepository.get();
    }
}