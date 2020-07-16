import React, { Component } from 'react';
import PropTypes from "prop-types";
import Modal from "components/Modal";
import OperationDelete from "components/Operations/OperationDelete";

export default class OperationDeleteModal extends Component {
    
    show = () => this.modal.show();

    afterSubmitHandler() {
        this.modal.close();
        this.props.afterSubmit && this.props.afterSubmit();
    }

    render() {
        return (<Modal title="Delete Operation" ref={modal => this.modal = modal} onDone={() => this.subscriptionDelete.submit()}>
            <OperationDelete id={this.props.id} ref={subscriptionDelete => this.subscriptionDelete = subscriptionDelete} afterSubmit={this.afterSubmitHandler.bind(this)} />
        </Modal>)
    }
}

OperationDeleteModal.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}