import React from 'react';
import ToastStatus from "../../helpers/ToastStatus";
import { TextInput, Button } from "../../components/FormInputs";
import SettingService from "../../services/SettingsService";
import SettingsPlans from "./SettingsPlans";
import Loading from "../../components/Loading";

class Settings extends React.Component {

    state = {
        loading: true,
        settings: {
            landingPageUrl: "",
            webhookUrl: "",
            publisherId: "",
            offerId: "",
            beneficiaryTenantId: "",
            purchaserTenantId: "",
            plans: []
        }
    }

    async componentDidMount() {
        await ToastStatus(async () => {
            var service = new SettingService();
            var settings = await service.getSettings();
            this.setState({ settings: settings });
            this.setState({ loading: false });
        }, null, "Error Retrieving Data");
    }

    inputChangeHandler(property, event) {
        var settings = { ...this.state.settings };
        settings[property] = event.target.value;
        this.setState({ settings: settings });
    }

    async handleSubmit(e) {
        e.preventDefault();
        await ToastStatus(async () => {
            var service = new SettingService();
            await service.postSettings(this.state.settings);
        }, "Information Saved succesfully.", "Error Saving Data");
    }

    onPlanChangeHandler(plans) {
        var settings = { ...this.state.settings };
        settings.plans = plans;
        this.setState({ settings });
    }

    render() {
        let displayCols = "col col-xs-12 col-sm-12 col-md-4 col-lg-1";
        let inputCols = "col col-xs-12 col-sm-12 col-md-8 col-lg-5"
        return (<div className="Settings">
            <Loading type="bubbles" color="gray" show={!this.state.loading}>
                <div class="col col-xs-12">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <TextInput displayCols={displayCols} inputCols={inputCols} name="landingPageUrl" displayName="Landing Page Url" placeholder="https://mywebsite.com" value={this.state.settings.landingPageUrl} onChangeHandler={(event) => this.inputChangeHandler("landingPageUrl", event)} />
                        <TextInput displayCols={displayCols} inputCols={inputCols} name="webhookUrl" displayName="Webhook Url" placeholder="https://mywebsite.com/webhook" value={this.state.settings.webhookUrl} onChangeHandler={(event) => this.inputChangeHandler("webhookUrl", event)} />
                        <TextInput displayCols={displayCols} inputCols={inputCols} name="publisherId" displayName="Publisher Id" placeholder="contosto_id" value={this.state.settings.publisherId} onChangeHandler={(event) => this.inputChangeHandler("publisherId", event)} />
                        <TextInput displayCols={displayCols} inputCols={inputCols} name="offerId" displayName="Offer Id" placeholder="offer_id" value={this.state.settings.offerId} onChangeHandler={(event) => this.inputChangeHandler("offerId", event)} />
                        <TextInput displayCols={displayCols} inputCols={inputCols} name="beneficiaryTenantId" displayName="Beneficiary Tenant Id" value={this.state.settings.beneficiaryTenantId} onChangeHandler={(event) => this.inputChangeHandler("beneficiaryTenantId", event)} />
                        <TextInput displayCols={displayCols} inputCols={inputCols} name="purchaserTenantId" displayName="Purchase Tenant Id" value={this.state.settings.purchaserTenantId} onChangeHandler={(event) => this.inputChangeHandler("purchaserTenantId", event)} />
                        <hr />
                        <SettingsPlans plans={this.state.settings.plans} onPlanChange={this.onPlanChangeHandler.bind(this)} />
                        <Button text="Submit" />
                    </form>
                </div>
            </Loading>
        </div >)
    }
}

export default Settings;