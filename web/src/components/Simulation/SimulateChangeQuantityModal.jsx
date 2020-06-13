import React, { Component } from 'react';
import Modal from "../Modal";
import SimulateChangeQuantity from "./SimulateChangeQuantity"

export default class SimulateChangeQuantityModal extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Simulate: Change Quantity" size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulateChangeQuantity ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>
        )
    }
}