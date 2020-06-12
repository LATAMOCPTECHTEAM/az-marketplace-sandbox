import config from "../config";
const axios = require('axios');

export default class SettingsService {

    async postSettings(settings) {
        return axios({
            baseURL: `${config.api}/settings`,
            method: "POST",
            data: settings
        }).then(res => res.data);
    }
    async getSettings() {
        return axios({
            baseURL: `${config.api}/settings`,
        }).then(res => res.data);
    }

}