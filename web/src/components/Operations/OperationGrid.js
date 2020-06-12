import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import OperationsService from "../../services/OperationService";

const { AutoCompleteFilter } = Filters;
const selectors = Data.Selectors;

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
            btnWebhook: (row.status === "InProgress" || row.status === "NotStarted") ? btnWebhook : null,
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
        let _self = this;
        const filteredRows = this.getRows(_self.state.operations, this.state.filters);
        return (<div>
            <ReactDataGrid
                columns={_self.columns}
                rowGetter={i => filteredRows[i]}
                rowsCount={filteredRows.length}
                minHeight={500}
                toolbar={<Toolbar enableFilter={true} />}
                onRowsSelected
                onAddFilter={filter => _self.setState(_self.handleFilterChange(filter))}
                onClearFilters={() => _self.setState({})}
                getValidFilterValues={columnKey => _self.getValidFilterValues(_self.state.operations, columnKey)}
                getCellActions={_self.getCellActions.bind(this)}
                onRowClick={_self.props.onRowClick}

            />
        </div>)
    }
}