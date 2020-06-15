import React, { Component } from 'react';
import PropTypes from "prop-types";
import Modal from "components/Modal";
import SimulateChangeQuantity from "components/Simulation/SimulateChangeQuantity"

export default class SimulateChangeQuantityModal extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Simulate: Change Quantity" size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulateChangeQuantity ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>)
    }
}

SimulateChangeQuantityModal.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}