const axios = require('axios');

export default class OperationService {

    async delete(operationId) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/operations/${operationId}`,
            method: "DELETE"
        }).then(res => res.data);
    }
    
    async simulateChangePlan(operation) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/operations/changePlan`,
            method: "POST",
            data: operation
        }).then(res => res.data);
    }

    async resendWebhook(operationId) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/operations/resendWebhook/${operationId}`,
            method: "POST"
        }).then(res => res.data);
    }

    async list(subscriptionId) {
        return axios({
            baseURL: `${process.env.REACT_APP_API_URL}/operations/${subscriptionId}`,
            method: "GET",
        }).then(res => res.data);
    }
}