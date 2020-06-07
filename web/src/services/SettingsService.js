const axios = require('axios');

export default class SettingsService {

    constructor() {

    }

    async postSettings(settings) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/settings`,
            method: "POST",
            data: settings
        }).then(res => res.data);
    }
    async getSettings() {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/settings`,
        }).then(res => res.data);
    }

}