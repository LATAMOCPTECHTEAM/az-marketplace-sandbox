import React, { Component } from 'react';
import moment from "moment";
import SimpleReactValidator from 'simple-react-validator';
import Chance from 'chance';
import Button from "react-bootstrap/Button";
import { toast } from 'react-toastify';
import { TextInput, SelectInput, Checkbox, SelectMultiple, CodeBlock, DateInput } from "components/FormInputs";
import PlanPicker from "components/Settings/PlanPicker";
import { SettingsService, SubscriptionService } from "services";
import { WithLoading, WithErrorHandler } from "hoc";
import messages from "resources/messages";

export default class SubscriptionEditor extends Component {

    constructor(props) {
        super(props);
        this.settingsService = new SettingsService();
        this.subscriptionService = new SubscriptionService();
        this.validator = new SimpleReactValidator();

        this.state = {
            showPreview: false,
            planOptions: [],
            termUnitOptions: ["P1M", "P1Y"],
            customerOperationsOptions: ["Read", "Update", "Delete"],
            saasSubscriptionStatusOptions: ["PendingFulfillmentStart", "Subscribed", "Suspended", "Unsubscribed"],
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
    }


    async componentDidMount() {
        try {
            this.setState({ loading: true });
            let subscriptionState = { ...this.state.subscription };

            if (this.props.id) {
                subscriptionState = await this.subscriptionService.get(this.props.id)
            }

            let settings = await this.settingsService.getSettings();

            if (!this.props.id) {
                subscriptionState.publisherId = settings.publisherId;
                subscriptionState.offerId = settings.offerId;
                subscriptionState.purchaser.tenantId = settings.purchaserTenantId;
                subscriptionState.beneficiary.tenantId = settings.beneficiaryTenantId;
            }

            this.setState({ subscription: subscriptionState, planOptions: settings.plans.map(x => x.planId), loading: false });
            this.inputStartDateChangeHandler(this.state.subscription.term.startDate);
        } catch (error) {
            this.setState({ error: error, loading: false });
            console.error(error);
        }

    }

    async submit() {
        if (this.validator.allValid()) {
            this.setState({ loading: true });
            try {
                if (this.props.id) {
                    await this.subscriptionService.update(this.state.subscription);
                } else {
                    await this.subscriptionService.create(this.state.subscription);
                }
                this.props.afterSubmit && this.props.afterSubmit();
                this.setState({ loading: false });
                toast.success(messages.SUBSCRIPTION_SAVED_SUCCESS, { position: "bottom-left" });

            } catch (error) {
                console.error(error);
                this.setState({ loading: false });
                toast.error(messages.REQUEST_ERROR_CHECK_CONSOLE, { position: "bottom-left" });
            }
        } else {
            this.setState({ loading: false });
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    inputChangeCustomerOperationsHandler(options) {
        let newState = { ...this.state.subscription };

        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                var index = newState.allowedCustomerOperations.indexOf(options[i].value);
                if (index === -1)
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

        date.add(1, this.state.subscription.term.termUnit === "P1M" ? 'M' : 'Y');
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

    fetchMessage = (forceShow) => this.props.id && !forceShow ? "" : <small>Fetched from <a href="/settings" target="_blank">Settings</a></small>;

    render() {
        return (
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <div>
                        <h5>Plan Properties <hr /></h5>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-4">
                                <TextInput
                                    name="id" displayName="Id" placeholder="random guid"
                                    value={this.state.subscription.id}
                                    onChangeHandler={(event) => this.inputChangeHandler("id", event.target.value)}
                                    validator={this.validator} validatorOptions="required" >
                                    {this.randomMessage()}
                                </TextInput>
                                <TextInput
                                    name="name" displayName="Name" placeholder="Contoso Cloud Solution"
                                    value={this.state.subscription.name}
                                    onChangeHandler={(event) => this.inputChangeHandler("name", event.target.value)}
                                    validator={this.validator} validatorOptions="required" >
                                </TextInput>
                                <PlanPicker
                                    planId={this.state.subscription.planId}
                                    planOptions={this.state.planOptions}
                                    validator={this.validator}
                                    validatorOptions="required"
                                    onPlanChanged={(value) => this.inputChangeHandler("planId", value)} />
                                <TextInput name="quantity" displayName="Quantity" placeholder="0" type="number"
                                    value={this.state.subscription.quantity}
                                    onChangeHandler={(event) => this.inputChangeHandler("quantity", parseInt(event.target.value))} />
                                <SelectInput

                                    name="statusId" displayName="Status"
                                    options={this.state.saasSubscriptionStatusOptions}
                                    value={this.state.subscription.saasSubscriptionStatus}
                                    onChangeHandler={(event) => this.inputChangeHandler("saasSubscriptionStatus", event.target.value)}
                                    validator={this.validator} validatorOptions="required">
                                </SelectInput>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-4">
                                <TextInput
                                    name="publisherId" displayName="Publisher Id" placeholder="Publisher Id"
                                    value={this.state.subscription.publisherId}
                                    onChangeHandler={(event) => this.inputChangeHandler("publisherId", event.target.value)}
                                    validator={this.validator} validatorOptions="required">
                                    {this.fetchMessage()}
                                </TextInput>
                                <TextInput
                                    name="offerId" displayName="Offer Id" placeholder="Offer Id"
                                    value={this.state.subscription.offerId}
                                    onChangeHandler={(event) => this.inputChangeHandler("offerId", event.target.value)}
                                    validator={this.validator} validatorOptions="required">
                                    {this.fetchMessage()}
                                </TextInput>
                                <SelectInput

                                    name="termUnit" displayName="Term Unit"
                                    options={this.state.termUnitOptions}
                                    value={this.state.subscription.term.termUnit}
                                    onChangeHandler={(event) => this.inputTermUnitChangeHandler(event.target.value)}
                                    validator={this.validator} validatorOptions="required">
                                </SelectInput>
                                <DateInput

                                    name="purchaser.term.startDate" displayName="Term Start Date"
                                    value={moment(this.state.subscription.term.startDate).toDate()}
                                    onChangeHandler={(date) => this.inputStartDateChangeHandler(date)}
                                    validator={this.validator} validatorOptions="required">
                                </DateInput>
                                <DateInput

                                    name="purchaser.term.endDate" displayName="Term End Date"
                                    value={moment(this.state.subscription.term.endDate).toDate()}
                                    validator={this.validator} validatorOptions="required">
                                </DateInput>
                                <SelectMultiple

                                    name="allowedCustomerOperations" displayName="Allowed CustomerOperations"
                                    options={this.state.customerOperationsOptions}
                                    value={this.state.subscription.allowedCustomerOperations}
                                    onChangeHandler={(event) => this.inputChangeCustomerOperationsHandler(event.target.options)}
                                    validator={this.validator} validatorOptions="required">
                                </SelectMultiple>
                                <Checkbox

                                    name="isFreelTrial" displayName="Is Free Trial"
                                    checked={this.state.subscription.isFreeTrial}
                                    onChangeHandler={(event) => this.inputChangeHandler("isFreeTrial", event.target.checked)}>
                                </Checkbox>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-4">
                                <TextInput

                                    name="beneficiary.emailId" displayName="Beneficiary Email Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                                    value={this.state.subscription.beneficiary.emailId}
                                    onChangeHandler={(event) => this.inputChangeHandler("emailId", event.target.value, ["beneficiary"])}
                                    validator={this.validator} validatorOptions="required">
                                    {this.randomMessage()}
                                </TextInput>
                                <TextInput

                                    name="beneficiary.objectId" displayName="Beneficiary Object Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                                    value={this.state.subscription.beneficiary.objectId}
                                    onChangeHandler={(event) => this.inputChangeHandler("objectId", event.target.value, ["beneficiary"])}
                                    validator={this.validator} validatorOptions="required">
                                    {this.randomMessage()}
                                </TextInput>
                                <TextInput

                                    name="beneficiary.tenantId" displayName="Beneficiary Tenant Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                                    value={this.state.subscription.beneficiary.tenantId}
                                    onChangeHandler={(event) => this.inputChangeHandler("tenantId", event.target.value, ["beneficiary"])}
                                    validator={this.validator} validatorOptions="required">
                                    {this.fetchMessage()}
                                </TextInput>
                                <TextInput

                                    name="purchaser.emailId" displayName="Purchaser Email Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                                    value={this.state.subscription.purchaser.emailId}
                                    onChangeHandler={(event) => this.inputChangeHandler("emailId", event.target.value, ["purchaser"])}
                                    validator={this.validator} validatorOptions="required">
                                    {this.randomMessage()}
                                </TextInput>
                                <TextInput

                                    name="purchaser.objectId" displayName="Beneficiary Object Id" placeholder="1f0384a5-c17d-403e-8c7a-a8ad9999ab43"
                                    value={this.state.subscription.purchaser.objectId}
                                    onChangeHandler={(event) => this.inputChangeHandler("objectId", event.target.value, ["purchaser"])}
                                    validator={this.validator} validatorOptions="required">
                                    {this.randomMessage()}
                                </TextInput>
                                <TextInput

                                    name="purchaser.tenantId" displayName="Purchaser Tenant Id" placeholder="ba0fa57a-cf48-4ce6-b580-6cffa4b0ea82"
                                    value={this.state.subscription.purchaser.tenantId}
                                    onChangeHandler={(event) => this.inputChangeHandler("tenantId", event.target.value, ["purchaser"])}
                                    validator={this.validator} validatorOptions="required">
                                    {this.fetchMessage()}
                                </TextInput>
                            </div>
                        </div>
                        <Button type="button" text="Submit" onClick={() => this.submit()}>Submit</Button>
                        <Button onClick={() => this.setState({ showPreview: !this.state.showPreview })} >Show Preview</Button>
                        <div style={{ display: this.state.showPreview ? "block" : "none" }}>
                            <br />
                            The code below will be stored in the database, and will be the result of the list and get subscription calls.
                            <br />
                            <CodeBlock language="json" text={JSON.stringify(this.state.subscription, null, 4)} />
                        </div>
                    </div >
                </WithErrorHandler>
            </WithLoading>)
    }
}