import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chance from 'chance';
import { TextInput, CodeBlock } from "components/FormInputs";
import SubscriptionService from "services/SubscriptionService";
import OperationService from "services/OperationService";
import WithLoading from "hoc/WithLoading";
import WithErrorHandler from "hoc/WithErrorHandler";
import ToastStatus from "helpers/ToastStatus";

export default class SimulateChangeQuantity extends Component {

    constructor(props) {
        super(props);
        this.subscriptionService = new SubscriptionService();
        this.operationService = new OperationService();
    }

    state = {
        loading: true,
        subscription: {},
        operation: {},
        operationResponse: {}
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
                "action": "ChangeQuantity",
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

    submit() {
        this.setState({ loading: true });
        ToastStatus(async () => {
            await this.operationService.simulateChangePlan(this.state.operation)
            this.props.afterSubmit && this.props.afterSubmit();
            this.setState({ loading: false });
        }, "Request sent sucessfully", "Error Submitting Data. Check the console for more logs.")
            .catch(error => {
                this.setState({ loading: false });
                console.error(error);
            });
    }

    inputChangeHandler(quantity) {
        let newState = { ...this.state.operation };
        newState.quantity = quantity;
        this.setState({ operation: newState });
        this.updateOperationResponse();
    }

    render() {
        let displayCols = "col-xs-12 col-sm-12 col-md-4 col-lg-2";
        let inputCols = "col-xs-12 col-sm-12 col-md-8 col-lg-10"

        return (
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <div>
                        <p>Are you sure you want to change the subscription {this.props.id} ?</p>
                        <TextInput displayCols={displayCols} inputCols={inputCols} name="quantity" displayName="Quantity" placeholder="0" type="number"
                            value={this.state.subscription.quantity}
                            onChangeHandler={(event) => this.inputChangeHandler(event.target.value)} />
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

SimulateChangeQuantity.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}