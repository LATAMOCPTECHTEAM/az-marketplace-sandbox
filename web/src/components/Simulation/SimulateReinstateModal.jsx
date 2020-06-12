import React, { Component } from 'react';
import Modal from "components/Modal";
import SimulateReinstate from "./SimulateReinstate";

export default class SimulateReinstateModal extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Simulate: Reinstate" size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulateReinstate ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>
        )
    }
}