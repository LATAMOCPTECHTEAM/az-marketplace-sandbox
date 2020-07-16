import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import SimulateModal from "components/Simulation/SimulateModal";
import SimulateUnsubscribe from 'components/Simulation/SimulateUnsubscribe';
import SimulateChangePlan from "components/Simulation/SimulateChangePlan";
import SimulateChangeQuantity from "components/Simulation/SimulateChangeQuantity";
import SimulateSuspend from "components/Simulation/SimulateSuspend";
import SimulateReinstate from "components/Simulation/SimulateReinstate";


export default class SubscriptionView extends Component {

    handleClickChangePlan = () => this.simulateChangePlanModal.show();

    handleClickChangeQuantity = () => this.simulateChangeQuantityModal.show();

    handleClickSuspend = () => this.simulateSuspendModal.show();

    handleClickReinstate = () => this.simulateReinstateModal.show();

    handleClickUnsubscribe = () => this.simulateUnsubscribeModal.show();

    render() {
        return (<React.Fragment>
            <SimulateModal title="Simulate: Change Plan" component={SimulateChangePlan} id={this.props.id} ref={simulateChangePlanModal => this.simulateChangePlanModal = simulateChangePlanModal} afterSubmit={() => this.props.afterAction ? this.props.afterAction() : null} />
            <SimulateModal title="Simulate: Change Quantity" component={SimulateChangeQuantity} id={this.props.id} ref={simulateChangeQuantityModal => this.simulateChangeQuantityModal = simulateChangeQuantityModal} afterSubmit={() => this.props.afterAction ? this.props.afterAction() : null} />
            <SimulateModal title="Simulate: Suspend" component={SimulateSuspend} id={this.props.id} ref={simulateSuspendModal => this.simulateSuspendModal = simulateSuspendModal} afterSubmit={() => this.props.afterAction ? this.props.afterAction() : null} />
            <SimulateModal title="Simulate: Reinstate" component={SimulateReinstate} id={this.props.id} ref={simulateReinstateModal => this.simulateReinstateModal = simulateReinstateModal} afterSubmit={() => this.props.afterAction ? this.props.afterAction() : null} />
            <SimulateModal title="Simulate: Unsubscribe" component={SimulateUnsubscribe} id={this.props.id} ref={simulateUnsubscribeModal => this.simulateUnsubscribeModal = simulateUnsubscribeModal} afterSubmit={() => this.props.afterAction ? this.props.afterAction() : null} />
            <div>
                <Button onClick={this.handleClickChangePlan.bind(this)}>Simulate Change Plan</Button>
                <Button onClick={this.handleClickChangeQuantity.bind(this)}>Simulate Change Quantity</Button>
                <Button onClick={this.handleClickSuspend.bind(this)}>Simulate Suspend</Button>
                <Button onClick={this.handleClickReinstate.bind(this)}>Simulate Reinstate</Button>
                <Button onClick={this.handleClickUnsubscribe.bind(this)}>Simulate Unsubscribe</Button>
            </div>
        </React.Fragment>)
    }
}

SubscriptionView.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}