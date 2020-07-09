import config from "../config";
const axios = require('axios');

export default class OperationService {

    async delete(operationId) {
        return axios({
            baseURL: `${config.api}/operations/${operationId}`,
            method: "DELETE"
        }).then(res => res.data);
    }

    async simulateSuspend(operation) {
        return axios({
            baseURL: `${config.api}/operations/suspend`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async simulateReinstate(operation) {
        return axios({
            baseURL: `${config.api}/operations/reinstate`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async simulateUnsubscribe(operation) {
        return axios({
            baseURL: `${config.api}/operations/unsubscribe`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }


    async simulateChangePlan(operation) {
        return axios({
            baseURL: `${config.api}/operations/changePlan`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async simulateChangeQuantity(operation) {
        return axios({
            baseURL: `${config.api}/operations/changeQuantity`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async resendWebhook(operationId) {
        return axios({
            baseURL: `${config.api}/operations/resendWebhook/${operationId}`,
            method: "POST"
        }).then(res => res.data);
    }

    async list(subscriptionId) {
        return axios({
            baseURL: `${config.api}/operations/${subscriptionId}`,
            method: "GET",
        }).then(res => res.data);
    }
}