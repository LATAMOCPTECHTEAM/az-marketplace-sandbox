import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from "react-data-grid-addons";

const selectors = Data.Selectors;

export default class OperationsGrid extends Component {

    constructor(props) {
        super(props || {});
        this.state = {};
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

    getValidFilterValues = (rows, columnId) => rows.map(r => r[columnId]).filter((item, i, a) => i === a.indexOf(item));

    getRows = (rows, filters) => selectors.getRows({ rows, filters });

    render() {
        let _self = this;
        const filteredRows = this.getRows(this.props.data, this.state);
        return (<div>
            <ReactDataGrid
                columns={this.props.columns}
                rowGetter={i => filteredRows[i]}
                rowsCount={filteredRows.length}
                minHeight={500}
                toolbar={<Toolbar enableFilter={true} />}
                onRowsSelected
                onAddFilter={filter => _self.setState(_self.handleFilterChange(filter))}
                onClearFilters={() => _self.setState({})}
                getValidFilterValues={columnKey => _self.getValidFilterValues(this.props.data, columnKey)}
                getCellActions={this.props.getCellActions}
                onRowClick={this.props.onRowClick}
            />
        </div>)
    }
}