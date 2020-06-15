import React, { Component } from 'react';
import PropTypes from "prop-types";
import Modal from "components/Modal";
import SimulateUnsubscribe from 'components/Simulation/SimulateUnsubscribe';

export default class SimulateUnsubscribeModal extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Simulate: Unsubscribe" size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulateUnsubscribe ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>)
    }
}

SimulateUnsubscribeModal.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}