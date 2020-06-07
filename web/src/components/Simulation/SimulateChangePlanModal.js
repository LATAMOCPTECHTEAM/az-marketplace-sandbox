import React, { Component } from 'react';
import Modal from "../../components/Modal";
import SimulateChangePlan from "../../components/Simulation/SimulateChangePlan";

export default class SubscriptionDelete extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        if (this.props.afterSubmit)
            this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Simulate: Change Plan" size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulateChangePlan ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>
        )
    }
}