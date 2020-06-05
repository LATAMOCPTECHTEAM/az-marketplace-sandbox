import React, { Component } from 'react';
import SubscriptionService from "../../services/SubscriptionService";

export default class SubscriptionDelete extends Component {

    async submit() {
        var subscriptionService = new SubscriptionService();
        await subscriptionService.delete(this.props.id);
        this.done();
    }

    done() {
        if (this.props.afterSubmitHandler) {
            this.props.afterSubmitHandler();
        }
    }

    render() {
        return (<div>
            Are you sure you want to delete the subscription {this.props.id} ?
        </div >)
    }
}