import React, { Component } from 'react';
import PropTypes from "prop-types";
import SubscriptionService from "services/SubscriptionService";
import WithLoading from "hoc/WithLoading";
import WithErrorHandler from "hoc/WithErrorHandler";
import ToastStatus from "helpers/ToastStatus";

export default class SubscriptionDelete extends Component {

    constructor(props) {
        super(props);
        this.subscriptionService = new SubscriptionService();
    }

    state = {
        loading: false
    }

    async submit() {
        this.setState({ loading: true });
        ToastStatus(async () => {
            await this.subscriptionService.delete(this.props.id);
            this.props.afterSubmit && this.props.afterSubmit();
            this.setState({ loading: false });
        }, "Request sent sucessfully", "Error Submitting Data. Check the console for more logs.")
            .catch(error => {
                this.setState({ error: error, loading: false });
                console.error(error);
            });
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