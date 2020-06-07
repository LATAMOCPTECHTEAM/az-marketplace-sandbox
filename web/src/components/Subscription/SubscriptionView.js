import React, { Component } from 'react';
import SimulateChangePlanModal from "../../components/Simulation/SimulateChangePlanModal";
import { CodeBlock } from "../FormInputs";

import SubscriptionService from "../../services/SubscriptionService";
import OperationService from "../../services/OperationService";

import Button from "react-bootstrap/Button";
import OperationsGrid from '../Operations/OperationGrid';
import SubscriptionLoginModal from "./SubscriptionLoginModal";
import OperationDeleteModal from "../Operations/OperationDeleteModal";

export default class SubscriptionView extends Component {

    state = {
        subscription: {
            id: null
        }
    };

    async loadSubscription() {
        if (this.state.subscription.id !== this.props.id) {
            var subscriptionService = new SubscriptionService();
            let subscriptionState = await subscriptionService.get(this.props.id);
            this.setState({ subscription: subscriptionState });
        }
    }

    componentDidUpdate = () => this.loadSubscription();

    componentDidMount = () => this.loadSubscription();

    handleClickLogin = () => this.loginModal.show()

    handleClickChangePlan = () => this.simulateChangePlanModal.show()

    closeModalAfterSubmit = (modal) => modal.close() & this.subscriptionGrid.load();

    async clickResendWebhookHandler(operationId) {
        var operationService = new OperationService();
        await operationService.resendWebhook(operationId);
    }

    async clickDeleteOperation(operationId) {
        this.setState({ currentOperationId: operationId })
        this.operationDeleteModal.show();
    }

    render() {
        return (<div>
            <SimulateChangePlanModal id={this.props.id} ref={simulateChangePlanModal => this.simulateChangePlanModal = simulateChangePlanModal} afterSubmit={() => this.grid.reload() && this.props.afterAction ? this.props.afterAction() : null} />
            <SubscriptionLoginModal id={this.props.id} ref={loginModal => this.loginModal = loginModal} />
            <OperationDeleteModal id={this.state.currentOperationId} afterSubmit={() => this.grid.reload()} ref={operationDeleteModal => this.operationDeleteModal = operationDeleteModal} />

            <div className="card border-primary mb-3">
                <div className="card-header"><h4>Subscription: {this.state.subscription.name} ({this.state.subscription.id})</h4></div>
                <div className="card-body">
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={this.handleClickLogin.bind(this)} >Login (Configure Account)</Button>
                    </div>
                    <div className="row">
                        <div className="col col-xs-12 col-sm-12 col-md-6 col-lg-4">
                            <p>Status: {this.state.subscription.saasSubscriptionStatus}</p>
                        </div>
                        <div className="col col-xs-12 col-sm-12 col-md-6 col-lg-4">
                            <p>Plan: {this.state.subscription.planId}</p>
                        </div>
                        <div className="col col-xs-12 col-sm-12 col-md-6 col-lg-4">
                            <p>Quantity: {this.state.subscription.quantity ? this.state.subscription.quantity : "0"}</p>
                        </div>
                    </div>
                    <h5>Operations</h5>
                    <hr />
                    <OperationsGrid
                        ref={grid => this.grid = grid} id={this.state.subscription.id}
                        onClickResendWebhook={this.clickResendWebhookHandler.bind(this)}
                        onClickDeleteOperation={this.clickDeleteOperation.bind(this)}
                    />
                </div>
                <div className="card-footer text-muted">
                    <Button onClick={this.handleClickChangePlan.bind(this)}>Simulate Change Plan</Button>
                    <Button onClick={this.handleClickChangePlan.bind(this)}>Simulate Change Quantity</Button>
                    <Button onClick={this.handleClickChangePlan.bind(this)}>Simulate Suspend</Button>
                    <Button onClick={this.handleClickChangePlan.bind(this)}>Simulate Reinstate</Button>
                    <Button onClick={this.handleClickChangePlan.bind(this)}>Simulate Unsubscribe</Button>

                    <Button onClick={() => this.setState({ showPreview: !this.state.showPreview })} >Show Preview</Button>
                </div>
            </div>

            <div style={{ display: this.state.showPreview ? "block" : "none" }}>
                <br />
                The code below will be stored in the database, and will be the result of the list and get subscription calls.
                <br />
                <CodeBlock language="json" text={JSON.stringify(this.state.subscription, null, 4)} />
            </div>
        </div >)
    }
}