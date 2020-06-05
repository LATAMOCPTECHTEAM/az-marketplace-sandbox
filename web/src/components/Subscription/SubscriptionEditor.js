import React, { Component } from 'react';
import { TextInput, SelectInput, Checkbox, SelectMultiple, CodeBlock, DateInput } from "../FormInputs";
import moment from "moment";
import SimpleReactValidator from 'simple-react-validator';

import SettingService from "../../services/SettingsService";
import SubscriptionService from "../../services/SubscriptionService";
import Button from "react-bootstrap/Button";
var Chance = require('chance');

export default class SubscriptionCreate extends Component {


    state = {
        showPreview: false,
        termUnitOptions: ["P1M", "P1Y"],
        customerOperationsOptions: ["Read", "Update", "Delete"],
        saasSubscriptionStatusOptions: ["NotStarted", "PendingFulfillmentStart", "Subscribed", "Suspended", "Unsubscribed"],
        subscription: {
            id: new Chance().guid(),
            name: null,
            publisherId: null,
            offerId: null,
            planId: null,
            quantity: null,
            beneficiary: {
                emailId: new Chance().email({ domain: "sandbox.com" }),
                objectId: new Chance().guid(),
                tenantId: null
            },
            purchaser: {
                emailId: new Chance().email({ domain: "sandbox.com" }),
                objectId: new Chance().guid(),
                tenantId: null
            },
            term: {
                startDate: moment().toDate(),
                endDate: "2019-06-29",
                termUnit: "P1M"
            },
            allowedCustomerOperations: ["Read", "Update", "Delete"],
            sessionMode: "DryRun",
            isFreeTrial: false,
            isTest: true,
            sandboxType: "None",
            saasSubscriptionStatus: "PendingFulfillmentStart"
        }
    };

    componentWillMount() {
        this.validator = new SimpleReactValidator();
        var service = new SettingService();
        var subscriptionService = new SubscriptionService();
        let subscriptionState = { ...this.state.subscription };
        let editSubscriptionPromise = Promise.resolve();
        if (this.props.id)
            editSubscriptionPromise = subscriptionService.get(this.props.id)
                .then(subscription => {
                    subscriptionState = subscription;
                })
        editSubscriptionPromise
            .then(service.getSettings)
            .then(settings => {
                if (!this.props.id) {
                    subscriptionState.publisherId = settings.publisherId;
                    subscriptionState.offerId = settings.offerId;
                    subscriptionState.purchaser.tenantId = settings.purchaserTenantId;
                    subscriptionState.beneficiary.tenantId = settings.beneficiaryTenantId;
                }
                this.setState({ subscription: subscriptionState });
                this.setState({ planOptions: settings.plans });
            })
            .catch(error => {
                console.error(error);
            });

        this.inputStartDateChangeHandler(this.state.subscription.term.startDate);
    }

    async submit() {
        if (this.validator.allValid()) {
            var subscriptionService = new SubscriptionService();
            if (this.props.id) {
                await subscriptionService.update(this.state.subscription);
            } else {
                await subscriptionService.create(this.state.subscription);
            }

            this.done();
        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            // you can use the autoForceUpdate option to do this automatically`
            this.forceUpdate();
        }

    }

    done() {
        if (this.props.afterSubmitHandler) {
            this.props.afterSubmitHandler();
        }
    }

    inputChangeCustomerOperationsHandler(options) {
        let newState = { ...this.state.subscription };

        for (var i = 0, l = options.length; i < l; i++) {
            console.log(`Option ${options[i].value} - ${options[i].selected}`)
            if (options[i].selected) {
                var index = newState.allowedCustomerOperations.indexOf(options[i].value);
                if (index == -1)
                    newState.allowedCustomerOperations.push(options[i].value);
                else
                    newState.allowedCustomerOperations.splice(index, 1);
            }
        }


        this.setState({ subscription: newState });
    }

    inputStartDateChangeHandler(value) {
        let newState = { ...this.state.subscription };

        var date = moment(value);
        newState.term.startDate = date.format("YYYY-MM-DD");

        date.add(1, this.state.subscription.term.termUnit == "P1M" ? 'M' : 'Y');
        newState.term.endDate = date.format("YYYY-MM-DD");
        this.setState({ subscription: newState });
    }

    inputTermUnitChangeHandler(value) {
        let newState = { ...this.state.subscription };
        newState.term.termUnit = value;
        this.setState({ subscription: newState });
        this.inputStartDateChangeHandler(this.state.subscription.term.startDate);
    }

    inputChangeHandler(property, value, path) {
        let newState = { ...this.state.subscription };
        var parent = newState;
        if (path)
            path.forEach(p => parent = parent[p]);
        parent[property] = value;
        this.setState({ subscription: newState });
    }

    randomMessage = (forceShow) => this.props.id && !forceShow ? "" : <small>Genereted randomly.</small>;


    fetchMessage(forceShow) {
        return this.props.id && !forceShow ? "" : <small>Fetched from <a href="/settings" target="_blank">Settings</a></small>;
    }

    render() {
        let displayCols = "col col-xs-12 col-sm-12 col-md-4 col-lg-2";
        let inputCols = "col col-xs-12 col-sm-12 col-md-8 col-lg-10"
        return (<div>
            <h5>Plan Properties <hr /></h5>
            <div className="row">
                <div className="col col-xs-12 col-sm-12 col-md-4">
                    <TextInput displayCols={displayCols} inputCols={inputCols}
                        name="id" displayName="Id" placeholder="random guid"
                        value={this.state.subscription.id}
                        onChangeHandler={(event) => this.inputChangeHandler("id", event.target.value)}
                        validator={this.validator}
                        validatorOptions="required" >
                        {this.randomMessage()}
                    </TextInput>
                    <TextInput displayCols={displayCols} inputCols={inputCols}
                        name="name" displayName="Name" placeholder="Contoso Cloud Solution"
                        value={this.state.subscription.name}
                        onChangeHandler={(event) => this.inputChangeHandler("name", event.target.value)}
                        validator={this.validator}
                        validatorOptions="required" >
                    </TextInput>
                    <TextInput displayCols={displayCols} inputCols={inputCols}
                        name="publisherId" displayName="Publisher Id" placeholder="Publisher Id"
                        value={this.state.subscription.publisherId}
                        onChangeHandler={(event) => this.inputChangeHandler("publisherId", event.target.value)}>
                        {this.fetchMessage()}
                    </TextInput>
                    <TextInput displayCols={displayCols} inputCols={inputCols} name="offerId" displayName="Offer Id" placeholder="Offer Id" value={this.state.subscription.offerId} onChangeHandler={(event) => this.inputChangeHandler("offerId", event.target.value)}>
                        {this.fetchMessage()}
                    </TextInput>
                    <SelectInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="planId" displayName="Plan"
                        options={this.state.planOptions}
                        value={this.state.subscription.planId}
                        onChangeHandler={(event) => this.inputChangeHandler("planId", event.target.value)}>
                        {this.fetchMessage(true)}
                    </SelectInput>
                    <TextInput displayCols={displayCols} inputCols={inputCols} name="quantity" displayName="Quantity" placeholder="0" type="number"
                        value={this.state.subscription.quantity}
                        onChangeHandler={(event) => this.inputChangeHandler("quantity", parseInt(event.target.value))} />
                    <SelectInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="statusId" displayName="Status"
                        options={this.state.saasSubscriptionStatusOptions}
                        value={this.state.subscription.saasSubscriptionStatus}
                        onChangeHandler={(event) => this.inputChangeHandler("saasSubscriptionStatus", event.target.value)}>
                    </SelectInput>
                </div>

                <div className="col col-xs-12 col-sm-12 col-md-4">
                    <SelectInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="termUnit" displayName="Term Unit"
                        options={this.state.termUnitOptions}
                        value={this.state.subscription.term.termUnit}
                        onChangeHandler={(event) => this.inputTermUnitChangeHandler(event.target.value)}>
                    </SelectInput>
                    <DateInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="purchaser.term.startDate" displayName="Term Start Date"
                        value={moment(this.state.subscription.term.startDate).toDate()}
                        onChangeHandler={(date) => this.inputStartDateChangeHandler(date)}>
                    </DateInput>
                    <DateInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="purchaser.term.endDate" displayName="Term End Date"
                        value={moment(this.state.subscription.term.endDate).toDate()}>
                    </DateInput>
                    <SelectMultiple
                        displayCols={displayCols} inputCols={inputCols}
                        name="allowedCustomerOperations" displayName="Allowed CustomerOperations"
                        options={this.state.customerOperationsOptions}
                        value={this.state.subscription.allowedCustomerOperations}
                        onChangeHandler={(event) => this.inputChangeCustomerOperationsHandler(event.target.options)}>
                    </SelectMultiple>
                    <Checkbox
                        displayCols={displayCols} inputCols={inputCols}
                        name="isFreelTrial" displayName="Is Free Trial"
                        checked={this.state.subscription.isFreeTrial}
                        onChangeHandler={(event) => this.inputChangeHandler("isFreeTrial", event.target.checked)}>
                    </Checkbox>
                </div>
                <div className="col col-xs-12 col-sm-12 col-md-4">
                    <TextInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="beneficiary.emailId" displayName="Beneficiary Email Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                        value={this.state.subscription.beneficiary.emailId}
                        onChangeHandler={(event) => this.inputChangeHandler("emailId", event.target.value, ["beneficiary"])}>
                        {this.randomMessage()}
                    </TextInput>
                    <TextInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="beneficiary.objectId" displayName="Beneficiary Object Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                        value={this.state.subscription.beneficiary.objectId}
                        onChangeHandler={(event) => this.inputChangeHandler("objectId", event.target.value, ["beneficiary"])}>
                        {this.randomMessage()}
                    </TextInput>
                    <TextInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="beneficiary.tenantId" displayName="Beneficiary Tenant Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                        value={this.state.subscription.beneficiary.tenantId}
                        onChangeHandler={(event) => this.inputChangeHandler("tenantId", event.target.value, ["beneficiary"])}>
                        {this.fetchMessage()}
                    </TextInput>
                    <TextInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="purchaser.emailId" displayName="Purchaser Email Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                        value={this.state.subscription.purchaser.emailId}
                        onChangeHandler={(event) => this.inputChangeHandler("Purchaser", event.target.value, ["purchaser"])}>
                        {this.randomMessage()}
                    </TextInput>
                    <TextInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="purchaser.objectId" displayName="Beneficiary Object Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                        value={this.state.subscription.purchaser.objectId}
                        onChangeHandler={(event) => this.inputChangeHandler("objectId", event.target.value, ["purchaser"])}>
                        {this.randomMessage()}
                    </TextInput>
                    <TextInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="purchaser.tenantId" displayName="Purchaser Tenant Id" placeholder="ba0fa57a-cf48-4ce6-b580-6cffa4b0ea82"
                        value={this.state.subscription.purchaser.tenantId}
                        onChangeHandler={(event) => this.inputChangeHandler("tenantId", event.target.value, ["purchaser"])}>
                        {this.fetchMessage()}
                    </TextInput>
                </div>
            </div>
            <h5>Result <hr /></h5>
            <Button onClick={() => this.setState({ showPreview: !this.state.showPreview })} >Show Preview</Button>
            <div style={{ display: this.state.showPreview ? "block" : "none" }}>
                <br />
                The code below will be stored in the database, and will be the result of the list and get subscription calls.
                <br />
                <CodeBlock language="json" language="json" text={JSON.stringify(this.state.subscription, null, 4)} />
            </div>
        </div >)
    }
}