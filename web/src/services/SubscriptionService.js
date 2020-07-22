import axios from "helpers/axios";

export default class SubscriptionService {

    async create(subscription) {
        return axios({
            url: `/subscriptions`,
            method: "POST",
            data: subscription
        }).then(res => res.data);
    }

    async update(subscription) {
        return axios({
            url: `/subscriptions`,
            method: "PUT",
            data: subscription
        }).then(res => res.data);
    }

    async delete(id) {
        return axios({
            url: `/subscriptions/${id}`,
            method: "DELETE",
        }).then(res => res.data);
    }

    async get(id) {
        return axios({
            url: `/subscriptions/${id}`,
        }).then(res => res.data);
    }

    async list() {
        return axios({
            url: `/subscriptions`,
        }).then(res => res.data.subscriptions);
    }

}