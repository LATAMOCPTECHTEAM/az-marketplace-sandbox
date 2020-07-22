import axios from "axios";
import config from "config";
import messages from "resources/messages";

const instance = axios.create({
    baseURL: config.api,
    timeout: 30000,
    headers: { 'X-Custom-Header': 'foobar' }
});

instance.interceptors.response.use((response) => response, function (error) {
    if (error.message === "Network Error") {
        return Promise.reject(new Error(messages.NETWORK_ERROR));
    } else if (error.response && error.response.data && error.response.data.message) {
        return Promise.reject(new Error(error.response.data.message));
    } else {
        return Promise.reject(error);
    }
});
export default instance;