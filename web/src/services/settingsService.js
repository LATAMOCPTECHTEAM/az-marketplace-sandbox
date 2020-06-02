const axios = require('axios');

export default class SettingsService {


    constructor() {

    }

    async postSettings(settings) {
        return axios({
            baseURL: "http://localhost:81/settings",
            method: "POST",
            data: settings
        }).then(res => res.data);
    }
    async getSettings() {
        return axios({
            baseURL: "http://localhost:81/settings",
        }).then(res => res.data);
    }

}