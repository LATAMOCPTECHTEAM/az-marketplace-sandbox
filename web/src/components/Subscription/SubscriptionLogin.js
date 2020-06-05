import React, { Component } from 'react';
import SettingsService from "../../services/SettingsService";

export default class SubscriptionLogin extends Component {

    state = {
        landingPageUrl: null
    }

    async componentWillMount() {
        var settingsService = new SettingsService();
        var settings = await settingsService.getSettings();

        this.setState({ landingPageUrl: settings.landingPageUrl })
    }

    render() {
        return (<div>
            {this.state.landingPageUrl ? <span>Login <a href={this.state.landingPageUrl + "?token=" + this.props.id} target="_blank">here</a></span> : ""}
        </div >)
    }
}