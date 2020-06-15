import React, { Component } from 'react';
import PropTypes from "prop-types";
import Modal from "components/Modal";
import SimulateChangePlan from "components/Simulation/SimulateChangePlan"

export default class SimulateChangePlanModal extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Simulate: Change Plan" size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulateChangePlan ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>)
    }
}

SimulateChangePlanModal.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}