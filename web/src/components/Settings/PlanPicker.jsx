import React, { Component } from 'react';
import PropTypes from "prop-types";
import { SelectInput } from "components/FormInputs";

import { SettingsService } from "services";

import { WithLoading, WithErrorHandler } from "hoc";

export default class PlanPicker extends Component {

    constructor(props) {
        super(props);
        this.settingsService = new SettingsService();
        this.state = {
            planOptions: []
        };
    }

    async componentDidMount() {
        if (this.props.planOptions) {
            this.setState({ planOptions: this.props.planOptions });
        } else {
            this.setState({ loading: true });
            try {
                let settings = this.settingsService.getSettings()
                this.setState({ planOptions: settings.plans.map(x => x.planId), loading: false });
            } catch (error) {
                console.error(error);
                this.setState({ error: error, loading: false });
            }
        }
    }

    planChangedHandler = (value) => this.props.onPlanChanged && this.props.onPlanChanged(value);

    fetchMessage = (forceShow) => this.props.id && !forceShow ? "" : <small>Fetched from <a href="/settings" target="_blank">Settings</a></small>;

    render() {
        return (<WithLoading show={!this.state.loading}>
            <WithErrorHandler error={this.state.error}>
                <SelectInput
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