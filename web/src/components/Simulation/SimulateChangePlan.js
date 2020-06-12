import React, { Component } from 'react';
import { SelectInput, CodeBlock } from "../FormInputs";
import SubscriptionService from "../../services/SubscriptionService";
import SettingsService from "../../services/SettingsService";
import OperationService from "../../services/OperationService";

var Chance = require('chance');

export default class SimulateChangePlan extends Component {

    state = {
        subscription: {},
        operation: {},
        operationResponse: {}
    }

    async componentDidMount() {
        var subscriptionService = new SubscriptionService();
        var settingsService = new SettingsService();

        var settings = await settingsService.getSettings();
        this.setState({ planOptions: settings.plans });

        var subscription = await subscriptionService.get(this.props.id)
        this.setState({ subscription: subscription })

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
        this.setState({ operation: operation });

        this.updateOperationResponse();
    }

    updateOperationResponse() {
        var operationResponseState = { ...this.state.operationResponse };

        operationResponseState.planId = this.state.operation.planId;
        operationResponseState.quantity = this.state.operation.quantity;
        operationResponseState.status = "Success";

        this.setState({ operationResponse: operationResponseState });
    }

    async submit() {
        var operationService = new OperationService();
        await operationService.simulateChangePlan(this.state.operation)
        this.done();
    }

    done() {
        if (this.props.afterSubmit) {
            this.props.afterSubmit();
        }
    }

    fetchMessage = (forceShow) => this.props.id && !forceShow ? "" : <small>Fetched from <a href="/settings" target="_blank">Settings</a></small>

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
        let displayCols = "col col-xs-12 col-sm-12 col-md-4 col-lg-2";
        let inputCols = "col col-xs-12 col-sm-12 col-md-8 col-lg-10"

        return (<div>
            <p>Are you sure you want to change the subscription {this.props.id} ?</p>
            <SelectInput
                displayCols={displayCols} inputCols={inputCols}
                name="planId" displayName="Plan"
                options={this.state.planOptions}
                value={this.state.operation.planId}
                onChangeHandler={(event) => this.inputChangeHandler("planId", event.target.value)}>
                {this.fetchMessage(true)}
            </SelectInput>

            <h5>Operation Action<hr /></h5>

            <ol>
                <li>
                    <p>The Sandbox will create a new operation record with the JSON below.</p>
                    <p>You can query it later using the <a href="/">Operations Get API.</a></p>
                </li>
                <li>The Sandbox will call the webhook configured in <a href="/settings" target="_blank">Settings</a>, sending the JSON below.</li>
            </ol>
            <p>
                <CodeBlock language="json" text={JSON.stringify(this.state.operation, null, 4)} />
            </p>
            <br />
            <h5>Expected Action<hr /></h5>
            <p>
                After receiving the request on the webhook, you need to make the necessary changes on your SaaS solution and call the <a href="/">Operation Patch API</a> sending the new PlanId and Quantity.
                Like in the template below:
            </p>
            <p>
                <CodeBlock language="json" text={JSON.stringify(this.state.operationResponse, null, 4)} />

                <small>* Status options are Sucess or Failure.</small>
            </p>
            <p>
                After calling the patch API:
            </p>
            <ol>
                <li> The status of the operation will be set to "Succeeded" or "Failure".</li>
                <li> If Succeeded, the PlanId and QuantityId on the Subscription will be updated.</li>
            </ol>
        </div >)
    }
}