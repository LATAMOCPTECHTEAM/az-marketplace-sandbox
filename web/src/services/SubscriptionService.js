const axios = require('axios');

export default class SubscriptionService {

    constructor() {

    }

    async create(subscription) {
        return axios({
            baseURL: `http://localhost:81/subscriptions`,
            method: "POST",
            data: subscription
        }).then(res => res.data);
    }

    async update(subscription) {
        return axios({
            baseURL: `http://localhost:81/subscriptions`,
            method: "PUT",
            data: subscription
        }).then(res => res.data);
    }

    async delete(id) {
        return axios({
            baseURL: `http://localhost:81/subscriptions/${id}`,
            method: "DELETE",
        }).then(res => res.data);
    }

    async get(id) {
        return axios({
            baseURL: `http://localhost:81/subscriptions/${id}`,
        }).then(res => res.data);
    }

    async list() {
        return axios({
            baseURL: "http://localhost:81/subscriptions",
        }).then(res => res.data.subscriptions);
    }

}