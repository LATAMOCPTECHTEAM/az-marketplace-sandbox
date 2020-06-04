import React, { useState, Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import SubscriptionService from "../../services/SubscriptionService";

const { AutoCompleteFilter } = Filters;
const selectors = Data.Selectors;
class SubscriptionGrid extends Component {

    constructor(props) {
        super(props || {});
        this.columns = [
            { key: "actions", name: "Actions", filterable: false, width: 130 },
            { key: "id", name: "Id", filterable: true },
            { key: "name", name: "Name", filterable: true, filterRenderer: AutoCompleteFilter },
            { key: "planId", name: "PlanId", filterable: true, filterRenderer: AutoCompleteFilter }
        ];
    }

    state = {
        subscriptions: []
    };

    async componentWillMount() {
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



    handleFilterChange = filter => filters => {
        const newFilters = { ...filters };
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        return newFilters;
    };

    getValidFilterValues(rows, columnId) {
        return rows.map(r => r[columnId]).filter((item, i, a) => i === a.indexOf(item));
    }

    getRows(rows, filters) {
        return selectors.getRows({ rows, filters });
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
                            text: "View",
                            callback: () => {
                                alert("Option 1 clicked");
                            }
                        },
                        {
                            text: "Edit",
                            callback: (args) => {
                                _self.props.onClickEdit(row.id);
                            }
                        },
                        {
                            text: "Simulate: Change Plan",
                            callback: () => {
                                alert("Option 1 clicked");
                            }
                        },
                        {
                            text: "Simulate: Suspend",
                            callback: () => {
                                alert("Option 2 clicked");
                            }
                        },
                        {
                            text: "Simulate: Unsubscribe",
                            callback: () => {
                                alert("Option 2 clicked");
                            }
                        },
                        {
                            text: "Simulate: Reinstate",
                            callback: () => {
                                alert("Option 2 clicked");
                            }
                        }

                    ]
                }
            ]
        };
        return cellActions[column.key];
    }


    render() {
        let _self = this;
        const filteredRows = this.getRows(_self.state.subscriptions, this.state);
        return (<div>
            <ReactDataGrid
                columns={_self.columns}
                rowGetter={i => filteredRows[i]}
                rowsCount={filteredRows.length}
                minHeight={500}
                toolbar={<Toolbar enableFilter={true} />}
                onAddFilter={filter => _self.setState(_self.handleFilterChange(filter))}
                onClearFilters={() => _self.setState({})}
                getValidFilterValues={columnKey => _self.getValidFilterValues(_self.state.subscriptions, columnKey)}
                getCellActions={_self.getCellActions.bind(this)}

            />
        </div>)
    }
}

export default SubscriptionGrid;