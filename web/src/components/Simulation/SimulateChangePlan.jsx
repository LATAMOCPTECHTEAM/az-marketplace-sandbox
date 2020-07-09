import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chance from 'chance';
import { toast } from 'react-toastify';
import { CodeBlock } from "components/FormInputs";
import { OperationService, SettingsService, SubscriptionService } from "services";
import { WithLoading, WithErrorHandler } from "hoc";
import PlanPicker from "components/Settings/PlanPicker";
import messages from "resources/messages";

export default class SimulateChangePlan extends Component {

    constructor() {
        super();
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
                "action": "ChangePlan",
                "timeStamp": new Date().toISOString(),
                "status": "InProgress"
            };
            this.setState({ subscription: subscription, operation: operation, loading: false });
            this.updateOperationResponse();
        } catch (error) {
            this.setState({ error: error, loading: false });
            console.error(error);
        }
    }

    updateOperationResponse() {
        var operationResponseState = { ...this.state.operationResponse };

        operationResponseState.planId = this.state.operation.planId;
        operationResponseState.quantity = this.state.operation.quantity;
        operationResponseState.status = "Success";

        this.setState({ operationResponse: operationResponseState });
    }

    async submit() {
        this.setState({ loading: true });
        try {
            var result = await this.operationService.simulateChangePlan(this.state.operation)
            this.setState({ loading: false });
            if (result.warning) {
                toast.info(result.warning, { position: "bottom-left" });
            } else {
                toast.success(messages.SIMULATE_CHANGE_QUANTITY_SUCCESS, { position: "bottom-left" });
            }
            this.props.afterSubmit && this.props.afterSubmit();
        } catch (error) {
            this.setState({ loading: false, error: error });
            toast.error(messages.REQUEST_ERROR_CHECK_CONSOLE, { position: "bottom-left" });
            console.error(error);
        }
    }

    inputChangeHandler(property, value, path) {
        let newState = { ...this.state.operation };
        var parent = newState;
        if (path)
            path.forEach(p => parent = parent[p]);
        parent[property] = value;
        this.setState({ operation: newState });
        this.updateOperationResponse();
    }

    render() {
        return (
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <div>
                        <p>Are you sure you want to change the subscription {this.props.id} ?</p>
                        <PlanPicker
                            planId={this.state.operation.planId}
                            planOptions={this.state.planOptions}
                            validator={this.validator}
                            validatorOptions="required"
                            onPlanChanged={(value) => this.inputChangeHandler("planId", value)}
                        />
                        <h5>Operation Action<hr /></h5>
                        <ol>
                            <li>
                                <p>The Sandbox will create a new operation record with the JSON below.</p>
                                <p>You can query it later using the <a href="/">Operations Get API.</a></p>
                            </li>
                            <li>The Sandbox will call the webhook configured in <a href="/settings" target="_blank">Settings</a>, sending the JSON below.</li>
                        </ol>
                        <CodeBlock language="json" text={JSON.stringify(this.state.operation, null, 4)} />
                        <br />
                        <h5>Expected Action<hr /></h5>
                        <p>After receiving the request on the webhook, you need to make the necessary changes on your SaaS solution and call the <a href="/">Operation Patch API</a> sending the new PlanId and Quantity. Like in the template below:</p>
                        <CodeBlock language="json" text={JSON.stringify(this.state.operationResponse, null, 4)} />
                        <p>
                            <small>* Status options are Sucess or Failure.</small>
                        </p>
                        <p>After calling the patch API:</p>
                        <ol>
                            <li> The status of the operation will be set to "Succeeded" or "Failure".</li>
                            <li> If Succeeded, the PlanId and QuantityId on the Subscription will be updated.</li>
                        </ol>
                    </div>
                </WithErrorHandler>
            </WithLoading>)
    }
}

SimulateChangePlan.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}