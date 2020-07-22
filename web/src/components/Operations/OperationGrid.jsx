import React, { Component } from 'react';
import { Filters } from "react-data-grid-addons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import OperationsService from "services/OperationService";
import DataGrid from "components/DataGrid";

const { AutoCompleteFilter } = Filters;

export default class OperationsGrid extends Component {

    constructor(props) {
        super(props || {});
        this.columns = [
            { key: "id", name: "Id", filterable: true },
            { key: "action", name: "Action", filterable: true, filterRenderer: AutoCompleteFilter },
            { key: "status", name: "Status", filterable: true, filterRenderer: AutoCompleteFilter },
            { key: "planId", name: "Plan Id", filterable: true, filterRenderer: AutoCompleteFilter },
            { key: "btnWebhook", name: "", width: 170 },
            { key: "btnDelete", name: "", width: 140 }
        ];
    }

    state = {
        id: null,
        operations: []
    };

    async reload() {
        this.setState({ id: this.props.id });
        try {
            let service = new OperationsService();
            let operations = await service.list(this.props.id);
            this.setState({ operations: operations });
        } catch (error) {
            console.error(error);
        }
    }

    async load() {
        if (this.state.id !== this.props.id) {
            this.reload();
        }
    }

    componentDidUpdate = () => this.load();

    componentDidMount = () => this.load();

    getCellActions(column, row) {
        var _self = this;
        var btnWebhook = [{
            icon: <div style={{ width: "160px", textAlign: "center" }}>
                <button className="btn btn-primary btn-sm" style={{ width: "100%", marginTop: "5px", marginRight: "10px" }}>
                    <span>Resend Webhook{" "}</span>
                    <FontAwesomeIcon icon={faCogs} />
                </button>
            </div>,
            callback: () => {
                _self.props.onClickResendWebhook(row.id);
            }
        }]

        const cellActions = {
            btnWebhook: btnWebhook,
            btnDelete: [{
                icon: <div style={{ width: "130px", textAlign: "center" }}>
                    <button className="btn btn-primary btn-sm" style={{ width: "100%", marginTop: "5px", marginRight: "10px" }}>
                        <span>Delete{" "}</span>
                        <FontAwesomeIcon icon={faCogs} />
                    </button>
                </div>,
                callback: () => {
                    _self.props.onClickDeleteOperation(row.id);
                }
            }]
        };
        return cellActions[column.key];
    }

    render() {
        return (<div>
            <DataGrid
                columns={this.columns}
                data={this.state.operations}
                getCellActions={this.getCellActions.bind(this)}
                onRowClick={this.props.onRowClick}
            />
        </div>)
    }

}