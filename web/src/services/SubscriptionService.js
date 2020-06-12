import config from "../config";
const axios = require('axios');

export default class SubscriptionService {

    async create(subscription) {
        return axios({
            baseURL: `${config.api}/subscriptions`,
            method: "POST",
            data: subscription
        }).then(res => res.data);
    }

    async update(subscription) {
        return axios({
            baseURL: `${config.api}/subscriptions`,
            method: "PUT",
            data: subscription
        }).then(res => res.data);
    }

    async delete(id) {
        return axios({
            baseURL: `${config.api}/subscriptions/${id}`,
            method: "DELETE",
        }).then(res => res.data);
    }

    async get(id) {
        return axios({
            baseURL: `${config.api}/subscriptions/${id}`,
        }).then(res => res.data);
    }

    async list() {
        return axios({
            baseURL: `${config.api}/subscriptions`,
        }).then(res => res.data.subscriptions);
    }

}