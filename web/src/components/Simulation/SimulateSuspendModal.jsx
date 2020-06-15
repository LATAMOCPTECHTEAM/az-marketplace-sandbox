import React, { Component } from 'react';
import PropTypes from "prop-types";
import Modal from "components/Modal";
import SimulateSuspend from "components/Simulation/SimulateSuspend";

export default class SimulateSuspendModal extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Simulate: Suspend" size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulateSuspend ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>)
    }
}

SimulateSuspendModal.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}