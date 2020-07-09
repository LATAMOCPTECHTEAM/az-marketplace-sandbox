import React, { Component } from 'react';
import PropTypes from "prop-types";
import { toast } from 'react-toastify';
import { SubscriptionService } from "services";
import { WithLoading, WithErrorHandler } from "hoc";
import messages from "resources/messages";

export default class SubscriptionDelete extends Component {

    constructor(props) {
        super(props);
        this.subscriptionService = new SubscriptionService();
        this.state = {
            loading: false
        };
    }

    async submit() {
        try {
            this.setState({ loading: true });
            await this.subscriptionService.delete(this.props.id);
            this.props.afterSubmit && this.props.afterSubmit();
            this.setState({ loading: false });
            toast.success(messages.DELETE_SUBSCRIPTION_SUCCESS, { position: "bottom-left" });

        } catch (error) {
            console.error(error);
            toast.error(messages.REQUEST_ERROR_CHECK_CONSOLE, { position: "bottom-left" });
            this.setState({ error: error, loading: false });
        };
    }

    render() {
        return (
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <div>Are you sure you want to delete the subscription {this.props.id} ?</div>
                </WithErrorHandler>
            </WithLoading>)
    }
}

SubscriptionDelete.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}