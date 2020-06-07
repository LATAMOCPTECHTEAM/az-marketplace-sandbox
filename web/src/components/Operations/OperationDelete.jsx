import React, { Component } from 'react';
import PropTypes from "prop-types";
import OperationService from "../../services/OperationService";

export default class OperationDelete extends Component {
    static propTypes = {
        id: PropTypes.number,
        afterSubmit: PropTypes.func
    }

    async submit() {
        var operationService = new OperationService();
        await operationService.delete(this.props.id);
        this.done();
    }

    done() {
        if (this.props.afterSubmit) {
            this.props.afterSubmit();
        }
    }

    render() {
        return (<div>
            Are you sure you want to delete the operation {this.props.id} ?
        </div >)
    }
}