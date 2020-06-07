const axios = require('axios');

export default class SubscriptionService {

    async create(subscription) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/subscriptions`,
            method: "POST",
            data: subscription
        }).then(res => res.data);
    }

    async update(subscription) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/subscriptions`,
            method: "PUT",
            data: subscription
        }).then(res => res.data);
    }

    async delete(id) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/subscriptions/${id}`,
            method: "DELETE",
        }).then(res => res.data);
    }

    async get(id) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/subscriptions/${id}`,
        }).then(res => res.data);
    }

    async list() {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/subscriptions`,
        }).then(res => res.data.subscriptions);
    }

}