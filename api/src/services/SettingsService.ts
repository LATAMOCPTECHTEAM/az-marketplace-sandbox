import { inject, injectable } from "tsyringe";

import { ISettings } from "@models";
import { ISettingsRepository, ISettingsService } from "@types";

@injectable()
export default class SettingsService implements ISettingsService {

    constructor(@inject("ISettingsRepository") private settingsRepository: ISettingsRepository) { }

    async updateSettings(settings: ISettings) {
        return this.settingsRepository.createOrUpdate(settings);
    }

    async getSettings(): Promise<ISettings> {
        return this.settingsRepository.get();
    }
}