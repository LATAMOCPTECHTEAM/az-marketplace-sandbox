import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import ToastStatus from "helpers/ToastStatus";

import WithLoading from "hoc/WithLoading";
import WithErrorHandler from "hoc/WithErrorHandler";

import { CodeBlock } from "components/FormInputs";

import SimulateChangePlanModal from "components/Simulation/SimulateChangePlanModal";
import SimulateChangeQuantityModal from "components/Simulation/SimulateChangeQuantityModal";
import SimulateSuspendModal from "components/Simulation/SimulateSuspendModal";
import SimulateUnsubscribeModal from "components/Simulation/SimulateUnsubscribeModal";
import SimulateReinstateModal from "components/Simulation/SimulateReinstateModal";
import SubscriptionLoginModal from "components/Subscription/SubscriptionLoginModal";

import OperationsGrid from 'components/Operations/OperationGrid';
import OperationDeleteModal from "components/Operations/OperationDeleteModal";

import SubscriptionService from "services/SubscriptionService";
import OperationService from "services/OperationService";


export default class SubscriptionView extends Component {

    state = {
        subscriptionId: null,
        subscription: {
            id: null
        }
    };

    async loadSubscription() {
        if ((this.state.subscriptionId !== this.props.id) && this.props.id) {
            this.setState({ subscriptionId: this.props.id, loading: true });
            ToastStatus(async () => {
                var subscriptionService = new SubscriptionService();
                let subscriptionState = await subscriptionService.get(this.props.id);
                this.setState({ subscription: subscriptionState, loading: false });
            }, null, "Error Retrieving Data")
                .catch(error => {
                    this.setState({ error: error, loading: false });
                    console.error(error);
                })
        }
    }

    componentDidUpdate = () => this.loadSubscription();

    componentDidMount = () => this.loadSubscription();

    handleClickLogin = () => this.loginModal.show();

    handleClickChangePlan = () => this.simulateChangePlanModal.show();

    handleClickChangeQuantity = () => this.simulateChangeQuantityModal.show();

    handleClickSuspend = () => this.simulateSuspendModal.show();

    handleClickReinstate = () => this.simulateReinstateModal.show();

    handleClickUnsubscribe = () => this.simulateUnsubscribeModal.show();

    closeModalAfterSubmit = (modal) => modal.close() & this.subscriptionGrid.load();

    async clickResendWebhookHandler(operationId) {
        this.setState({ loading: true });
        ToastStatus(async () => {
            var operationService = new OperationService();
            await operationService.resendWebhook(operationId);
            this.setState({ loading: false });
        }, "Request sent sucessfully", "Error Retrieving Data")
            .catch(error => {
                this.setState({ loading: false });
                console.error(error);
            });

    }

    async clickDeleteOperation(operationId) {
        this.setState({ currentOperationId: operationId })
        this.operationDeleteModal.show();
    }

    render() {
        return (<div>
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <div>
                        <SimulateChangePlanModal id={this.props.id} ref={simulateChangePlanModal => this.simulateChangePlanModal = simulateChangePlanModal} afterSubmit={() => this.grid.reload() && this.props.afterAction ? this.props.afterAction() : null} />
                        <SimulateChangeQuantityModal id={this.props.id} ref={simulateChangeQuantityModal => this.simulateChangeQuantityModal = simulateChangeQuantityModal} afterSubmit={() => this.grid.reload() && this.props.afterAction ? this.props.afterAction() : null} />
                        <SimulateSuspendModal id={this.props.id} ref={simulateSuspendModal => this.simulateSuspendModal = simulateSuspendModal} afterSubmit={() => this.grid.reload() && this.props.afterAction ? this.props.afterAction() : null} />
                        <SimulateReinstateModal id={this.props.id} ref={simulateReinstateModal => this.simulateReinstateModal = simulateReinstateModal} afterSubmit={() => this.grid.reload() && this.props.afterAction ? this.props.afterAction() : null} />
                        <SimulateUnsubscribeModal id={this.props.id} ref={simulateUnsubscribeModal => this.simulateUnsubscribeModal = simulateUnsubscribeModal} afterSubmit={() => this.grid.reload() && this.props.afterAction ? this.props.afterAction() : null} />
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
                                <Button onClick={this.handleClickChangePlan.bind(this)}>Simulate Change Plan</Button>
                                <Button onClick={this.handleClickChangeQuantity.bind(this)}>Simulate Change Quantity</Button>
                                <Button onClick={this.handleClickSuspend.bind(this)}>Simulate Suspend</Button>
                                <Button onClick={this.handleClickReinstate.bind(this)}>Simulate Reinstate</Button>
                                <Button onClick={this.handleClickUnsubscribe.bind(this)}>Simulate Unsubscribe</Button>
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