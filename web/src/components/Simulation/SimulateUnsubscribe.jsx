import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chance from 'chance';
import { toast } from 'react-toastify';
import { CodeBlock } from "components/FormInputs";
import { OperationService, SettingsService, SubscriptionService } from "services";
import { WithLoading, WithErrorHandler } from "hoc";
import messages from "resources/messages";

export default class SimulateUnsubscribe extends Component {

    constructor(props) {
        super(props);
        this.subscriptionService = new SubscriptionService();
        this.settingsService = new SettingsService();
        this.operationService = new OperationService();
        this.state = {
            loading: true,
            subscription: {},
            operation: {},
            operationResponse: {}
        }
    }

    async componentDidMount() {
        try {
            var settings = await this.settingsService.getSettings();
            var subscription = await this.subscriptionService.get(this.props.id);

            var chance = new Chance();
            var operation = {
                "id": chance.guid(),
                "activityId": chance.guid(),
                "subscriptionId": subscription.id,
                "offerId": subscription.offerId,
                "publisherId": subscription.publisherId,
                "planId": subscription.planId,
                "quantity": subscription.quantity,
                "action": "Unsubscribe",
                "timeStamp": new Date().toISOString(),
                "status": "Succeeded"
            };
            this.setState({ subscription: subscription, operation: operation, planOptions: settings.plans, loading: false });
        } catch (error) {
            this.setState({ error: error, loading: false });
            console.error(error);
        }
    }

    async submit() {
        this.setState({ loading: true });
        try {
            var result = await this.operationService.simulateUnsubscribe(this.state.operation)
            this.setState({ loading: false });
            if (result.warning) {
                toast.info(result.warning, { position: "bottom-left" });
            } else {
                toast.success(messages.SIMULATE_UNSUBSCRIBE_SUCCESS, { position: "bottom-left" });
            }
            this.props.afterSubmit && this.props.afterSubmit();
        } catch (error) {
            this.setState({ loading: false, error: error });
            toast.error(messages.REQUEST_ERROR_CHECK_CONSOLE, { position: "bottom-left" });
            console.error(error);
        }
    }

    render() {
        return (
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <div>
                        <p>Are you sure you want to change the subscription {this.props.id} ?</p>
                        <h5>Operation Action<hr /></h5>
                        <ol>
                            <li>
                                <p>The Sandbox will create a new operation record with the JSON below.</p>
                                <p>You can query it later using the <a href="/">Operations Get API.</a></p>
                            </li>
                            <li>
                                The Sandbox will call the webhook configured in <a href="/settings" target="_blank">Settings</a>, sending the JSON below.
                                <CodeBlock language="json" text={JSON.stringify(this.state.operation, null, 4)} />
                            </li>
                            <li>The Subscription Status will be set to Unsubscribed.</li>
                        </ol>
                        <br />
                        <h5>Expected Action<hr /></h5>
                        <p>
                            You should Unsubscribe the subscription on your SaaS App
                        </p>
                    </div>
                </WithErrorHandler>
            </WithLoading>)
    }
}

SimulateUnsubscribe.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}