import React, { Component } from 'react';
import Button from "react-bootstrap/Button";

import { WithLoading, WithErrorHandler } from "hoc";

import { CodeBlock } from "components/FormInputs";

import SubscriptionLoginModal from "components/Subscription/SubscriptionLoginModal";

import OperationsGrid from 'components/Operations/OperationGrid';
import OperationDeleteModal from "components/Operations/OperationDeleteModal";

import { SubscriptionService, OperationService } from "services";

import SubscriptionViewSimulateButtons from "components/Subscription/SubscriptionViewSimulateButtons";

export default class SubscriptionView extends Component {

    constructor(props) {
        super(props);
        this.operationService = new OperationService();
        this.subscriptionService = new SubscriptionService();
        this.state = {
            subscriptionId: null,
            subscription: {
                id: null
            }
        };
    }

    async loadSubscription() {
        if ((this.state.subscriptionId !== this.props.id) && this.props.id) {
            this.setState({ subscriptionId: this.props.id, loading: true });
            try {
                let subscriptionState = await this.subscriptionService.get(this.props.id);
                this.setState({ subscription: subscriptionState, loading: false });
            } catch (error) {
                console.error(error);
                this.setState({ error: error, loading: false });
            }
        }
    }

    componentDidUpdate = () => this.loadSubscription();

    componentDidMount = () => this.loadSubscription();

    handleClickLogin = () => this.loginModal.show();

    async clickResendWebhookHandler(operationId) {
        this.setState({ loading: true });
        try {
            await this.operationService.resendWebhook(operationId);
            this.setState({ loading: false });
        } catch (error) {
            console.error(error);
            this.setState({ loading: false });
        }
    }

    async clickDeleteOperation(operationId) {
        this.setState({ currentOperationId: operationId })
        this.operationDeleteModal.show();
    }

    async afterAction() {
        this.grid.reload();
    }

    render() {
        return (<div>
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <div>
                        <SubscriptionLoginModal id={this.props.id} ref={loginModal => this.loginModal = loginModal} />
                        <OperationDeleteModal id={this.state.currentOperationId} afterSubmit={() => this.grid.reload()} ref={operationDeleteModal => this.operationDeleteModal = operationDeleteModal} />

                        <div>
                            <h4>Subscription: {this.state.subscription.name} ({this.state.subscription.id})</h4>
                            <div style={{ textAlign: "right" }}>
                                <Button onClick={this.handleClickLogin.bind(this)} >Login (Configure Account)</Button>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                                    <h5>Status</h5>
                                    {this.state.subscription.saasSubscriptionStatus}
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                                    <h5>Plan</h5>
                                    {this.state.subscription.planId}
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                                    <h5>Quantity</h5>
                                    {this.state.subscription.quantity ? this.state.subscription.quantity : ""}
                                </div>
                            </div>
                            <h5><hr /></h5>

                            <h5>Operations</h5>
                            <OperationsGrid
                                ref={grid => this.grid = grid} id={this.state.subscription.id}
                                onClickResendWebhook={this.clickResendWebhookHandler.bind(this)}
                                onClickDeleteOperation={this.clickDeleteOperation.bind(this)} />

                            <div style={{ marginTop: "10px" }}>
                                <SubscriptionViewSimulateButtons id={this.state.subscription.id} afterAction={() => this.afterAction()} />
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <Button onClick={() => this.setState({ showPreview: !this.state.showPreview })} >Show Preview</Button>
                            </div>
                        </div>

                        <div style={{ display: this.state.showPreview ? "block" : "none" }}>
                            <br />
                            The code below will be stored in the database, and will be the result of the list and get subscription calls.
                            <br />
                            {this.state.subscriptionId ? <CodeBlock language="json" text={JSON.stringify(this.state.subscription, null, 4)} /> : ""}
                        </div>
                    </div>
                </WithErrorHandler>
            </WithLoading>
        </div >)
    }
}