import axios from "helpers/axios";

export default class OperationService {

    async delete(operationId) {
        return axios({
            url: `/operations/${operationId}`,
            method: "DELETE"
        }).then(res => res.data);
    }

    async simulateSuspend(operation) {
        return axios({
            url: `/operations/suspend`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async simulateReinstate(operation) {
        return axios({
            url: `/operations/reinstate`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async simulateUnsubscribe(operation) {
        return axios({
            url: `/operations/unsubscribe`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }


    async simulateChangePlan(operation) {
        return axios({
            url: `/operations/changePlan`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async simulateChangeQuantity(operation) {
        return axios({
            url: `/operations/changeQuantity`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async resendWebhook(operationId) {
        return axios({
            url: `/operations/resendWebhook/${operationId}`,
            method: "POST"
        }).then(res => res.data);
    }

    async list(subscriptionId) {
        return axios({
            url: `/operations/${subscriptionId}`,
            method: "GET",
        }).then(res => res.data);
    }
}