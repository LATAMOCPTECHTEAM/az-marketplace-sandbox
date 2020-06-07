import React, { Component } from 'react';
import PropTypes from "prop-types";
import OperationDelete from "./OperationDelete";
import Modal from "../../components/Modal";

export default class OperationDeleteModal extends Component {
    static propTypes = {
        id: PropTypes.number,
        afterSubmit: PropTypes.func
    }

    show = () => this.modal.show();

    afterSubmitHandler() {
        this.modal.close();
        if (this.props.afterSubmit) {
            this.props.afterSubmit();
        }
    }

    render() {
        return (<Modal title="Delete Subscription" ref={modal => this.modal = modal} onDone={() => this.subscriptionDelete.submit()} >
            <OperationDelete id={this.props.id} ref={subscriptionDelete => this.subscriptionDelete = subscriptionDelete} afterSubmit={this.afterSubmitHandler.bind(this)} />
        </Modal>)
    }
}