import React, { Component } from 'react';
import PropTypes from "prop-types";
import Modal from "components/Modal";

export default class SimulateModal extends Component {

    show = () => this.modal.show();

    afterSubmit() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        var SimulationComponent = this.props.component;
        return (<Modal title={this.props.title} size="lg" ref={modal => this.modal = modal} onDone={() => this.form.submit()} >
            <SimulationComponent ref={form => this.form = form} id={this.props.id} afterSubmit={this.afterSubmit.bind(this)} />
        </Modal>)
    }
}

SimulateModal.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    component: PropTypes.object,
    afterSubmit: PropTypes.func
}