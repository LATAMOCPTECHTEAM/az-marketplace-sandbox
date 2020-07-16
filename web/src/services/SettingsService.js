import axios from "helpers/axios";

export default class SettingsService {

    async postSettings(settings) {
        return axios({
            url: `/settings`,
            method: "POST",
            data: settings
        }).then(res => res.data);
    }
    async getSettings() {
        return axios({
            url: `/settings`,
        }).then(res => res.data);
    }

}