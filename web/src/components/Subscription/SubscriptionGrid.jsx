import React, { Component } from 'react';
import { Filters } from "react-data-grid-addons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import PropTypes from "prop-types";
import { SubscriptionService } from "services";
import DataGrid from "components/DataGrid";

const { AutoCompleteFilter } = Filters;

export default class SubscriptionGrid extends Component {

    constructor(props) {
        super(props || {});
        this.subscriptionService = new SubscriptionService();
        this.columns = [
            { key: "actions", name: "Actions", filterable: false, width: 130 },
            { key: "id", name: "Id", filterable: true },
            { key: "name", name: "Name", filterable: true, filterRenderer: AutoCompleteFilter },
            { key: "planId", name: "PlanId", filterable: true, filterRenderer: AutoCompleteFilter },
            { key: "saasSubscriptionStatus", name: "Status", filterable: true }
        ];
        this.state = {
            subscriptions: []
        };
    }

    async componentDidMount() {
        await this.loadGrid();
    }

    async loadGrid() {
        try {
            let subscriptions = await this.subscriptionService.list();
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

SubscriptionGrid.propTypes = {
    onRowClick: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickDelete: PropTypes.func
}