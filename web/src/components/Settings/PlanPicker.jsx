import React, { Component } from 'react';
import PropTypes from "prop-types";
import { SelectInput } from "components/FormInputs";

import SettingService from "services/SettingsService";

import WithLoading from "hoc/WithLoading";
import WithErrorHandler from "hoc/WithErrorHandler";

export default class PlanPicker extends Component {

    constructor(props) {
        super(props);
        this.settingsService = new SettingService();
    }

    state = {
        planOptions: []
    };

    componentDidMount() {
        if (this.props.planOptions) {
            this.setState({ planOptions: this.props.planOptions });
        } else {
            this.setState({ loading: true });
            this.settingsService.getSettings()
                .then(settings => {
                    this.setState({ planOptions: settings.plans.map(x => x.planId), loading: false });
                })
                .catch(error => {
                    this.setState({ error: error, loading: false });
                    console.error(error);
                });
        }
    }

    planChangedHandler = (value) => this.props.onPlanChanged && this.props.onPlanChanged(value);

    fetchMessage = (forceShow) => this.props.id && !forceShow ? "" : <small>Fetched from <a href="/settings" target="_blank">Settings</a></small>;


    render() {
        let displayCols = "col-xs-12 col-sm-12 col-md-4 col-lg-3";
        let inputCols = "col-xs-12 col-sm-12 col-md-8 col-lg-9"
        return (
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <SelectInput
                        displayCols={displayCols} inputCols={inputCols}
                        name="planId" displayName="Plan"
                        options={this.state.planOptions}
                        value={this.props.planId}
                        onChangeHandler={(event) => this.planChangedHandler(event.target.value)}
                        validator={this.props.validator} validatorOptions={this.props.validatorOptions}>
                        {this.fetchMessage(true)}
                    </SelectInput>
                </WithErrorHandler>
            </WithLoading>)
    }
}

PlanPicker.propTypes = {
    planId: PropTypes.string,
    planOptions: PropTypes.array,
    validator: PropTypes.object,
    validatorOptions: PropTypes.object,
    onPlanChanged: PropTypes.func
}