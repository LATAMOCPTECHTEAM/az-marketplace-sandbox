import React, { Component } from 'react';
import PropTypes from "prop-types";
import { toast } from 'react-toastify';
import { OperationService } from "services";
import { WithLoading, WithErrorHandler } from "hoc";
import messages from "resources/messages";

export default class OperationDelete extends Component {

    constructor(props) {
        super(props);
        this.operationService = new OperationService();
        this.state = {
            loading: false
        }
    }

    async submit() {
        this.setState({ loading: true });
        try {
            await this.operationService.delete(this.props.id);
            this.props.afterSubmit && this.props.afterSubmit();
            this.setState({ loading: false });
            toast.success(messages.DELETE_OPERATION_SUCCESS, { position: "bottom-left" });
        } catch (error) {
            console.error(error);
            this.setState({ error: error, loading: false });
            toast.error(messages.REQUEST_ERROR_CHECK_CONSOLE, { position: "bottom-left" });
        }
    }

    render() {
        return (<WithLoading show={!this.state.loading}>
            <WithErrorHandler error={this.state.error}>
                <div>Are you sure you want to delete the operation {this.props.id} ?</div>
            </WithErrorHandler>
        </WithLoading>)
    }
}

OperationDelete.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}