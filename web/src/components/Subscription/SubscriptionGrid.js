import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import SubscriptionService from "../../services/SubscriptionService";
import DataGrid from "components/DataGrid";

const { AutoCompleteFilter } = Filters;

class SubscriptionGrid extends Component {

    constructor(props) {
        super(props || {});
        this.columns = [
            { key: "actions", name: "Actions", filterable: false, width: 130 },
            { key: "id", name: "Id", filterable: true },
            { key: "name", name: "Name", filterable: true, filterRenderer: AutoCompleteFilter },
            { key: "planId", name: "PlanId", filterable: true, filterRenderer: AutoCompleteFilter },
            { key: "saasSubscriptionStatus", name: "Status", filterable: true }

        ];
    }

    state = {
        subscriptions: []
    };

    async componentDidMount() {
        await this.loadGrid();
    }

    async loadGrid() {
        try {
            let service = new SubscriptionService();
            let subscriptions = await service.list();
            this.setState({ subscriptions: subscriptions });
        } catch (error) {
            console.error(error);
        }
    }

    getCellActions(column, row) {
        var _self = this;
        const cellActions = {
            actions: [
                {
                    icon: <div style={{
                        width: "130px",
                        textAlign: "center"
                    }}>
                        <button className="btn btn-primary btn-sm" style={{ width: "100%", marginTop: "5px", marginRight: "10px" }}>
                            <span>Action{" "}</span>
                            <FontAwesomeIcon icon={faCogs} />
                        </button>
                    </div>,
                    actions: [

                        {
                            text: "Edit",
                            callback: (args) => {
                                _self.props.onClickEdit(row.id);
                            }
                        },
                        {
                            text: "Delete",
                            callback: () => {
                                _self.props.onClickDelete(row.id);
                            }
                        }
                    ]
                }
            ]
        };
        return cellActions[column.key];
    }

    render() {
        return (<div>
             <DataGrid
                columns={this.columns}
                data={this.state.subscriptions}
                getCellActions={this.getCellActions.bind(this)}
                onRowClick={this.props.onRowClick}
            />
        </div>)
    }
}

export default SubscriptionGrid;