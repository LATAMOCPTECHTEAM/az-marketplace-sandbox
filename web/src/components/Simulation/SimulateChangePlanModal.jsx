import React, { Component } from 'react';
import Modal from "../Modal";
import SimulateChangePlan from "./SimulateChangePlan"

export default class SimulateChangePlanModal extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Simulate: Change Plan" size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulateChangePlan ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>
        )
    }
}