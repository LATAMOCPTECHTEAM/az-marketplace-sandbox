import React from 'react';
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import SettingService from "../../services/settingsService";

class Settings extends React.Component {

    state = {
        landingPageUrl: "",
        webhookUrl: ""
    }

    async componentWillMount() {
        try {
            var service = new SettingService();
            this.state = await service.getSettings();
            this.setState(this.state);
        } catch (error) {
            console.error(error);
            debugger;
        }
    }

    componentWillUnmount() {

    }

    inputChangeHandler(property, event) {
        this.state[property] = event.target.value;
        this.setState(this.state);
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            var service = new SettingService();
            await service.postSettings(this.state);

        } catch (error) {
            console.error(error);
            debugger;
        }

    }


    render() {
        return (<div className="Settings">
            <form onSubmit={this.handleSubmit.bind(this)}>
                <TextInput name="LandingPageUrl" displayName="Landing Page Url" placeholder="https://mywebsite.com" value={this.state.landingPageUrl} onChangeHandler={(event) => this.inputChangeHandler("landingPageUrl", event)} />
                <TextInput name="WebhookUrl"  displayName="Webhook Url"  placeholder="https://mywebsite.com/webhook" value={this.state.webhookUrl} onChangeHandler={(event) => this.inputChangeHandler("webhookUrl", event)} />
                <Button text="Submit" />
            </form>
        </div>)
    }
}

export default Settings;