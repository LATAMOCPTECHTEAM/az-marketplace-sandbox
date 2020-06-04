import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInput from "../../components/FormInputs/TextInput";
import Button from "../../components/FormInputs/Button";
import SettingService from "../../services/SettingsService";
import Table from "react-bootstrap/Table";

class Settings extends React.Component {

    state = {
        planInput: "",
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

    async componentWillMount() {
        try {
            var service = new SettingService();
            this.state.settings = await service.getSettings();
            this.setState(this.state);
        } catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount() {

    }

    inputChangeHandler(property, event) {
        this.state.settings[property] = event.target.value;
        this.setState(this.state);
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            var service = new SettingService();
            await service.postSettings(this.state.settings);
            toast.success("Information Saved succesfully.", { position: "bottom-left" });

        } catch (error) {
            console.error(error);
            toast.error("Error Saving Data. Check the console for more details.", { position: "bottom-left" })
        }

    }

    planInputKeyPressHandler(event) {
        if (event.key === 'Enter') {
            this.state.settings.plans = this.state.settings.plans || [];
            this.state.settings.plans.push(this.state.planInput);
            this.state.planInput = "";
            this.setState(this.state);
            event.preventDefault();
        }
    }

    planInputChangeHandler(event) {
        this.state.planInput = event.target.value;
        this.setState(this.state);
    }

    planGridRemoveHandler(plan) {
        this.state.settings.plans = this.state.settings.plans.filter(x => x != plan);
        this.setState(this.state);
    }

    render() {
        let displayCols = "col col-xs-12 col-sm-12 col-md-4 col-lg-1";
        let inputCols = "col col-xs-12 col-sm-12 col-md-8 col-lg-5"
        return (<div className="Settings">
            <div class="col col-xs-12">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <TextInput displayCols={displayCols} inputCols={inputCols} name="landingPageUrl" displayName="Landing Page Url" placeholder="https://mywebsite.com" value={this.state.settings.landingPageUrl} onChangeHandler={(event) => this.inputChangeHandler("landingPageUrl", event)} />
                    <TextInput displayCols={displayCols} inputCols={inputCols} name="webhookUrl" displayName="Webhook Url" placeholder="https://mywebsite.com/webhook" value={this.state.settings.webhookUrl} onChangeHandler={(event) => this.inputChangeHandler("webhookUrl", event)} />
                    <TextInput displayCols={displayCols} inputCols={inputCols} name="publisherId" displayName="Publisher Id" placeholder="contosto_id" value={this.state.settings.publisherId} onChangeHandler={(event) => this.inputChangeHandler("publisherId", event)} />
                    <TextInput displayCols={displayCols} inputCols={inputCols} name="offerId" displayName="Offer Id" placeholder="offer_id" value={this.state.settings.offerId} onChangeHandler={(event) => this.inputChangeHandler("offerId", event)} />
                    <TextInput displayCols={displayCols} inputCols={inputCols} name="beneficiaryTenantId" displayName="Beneficiary Tenant Id" value={this.state.settings.beneficiaryTenantId} onChangeHandler={(event) => this.inputChangeHandler("beneficiaryTenantId", event)} />
                    <TextInput displayCols={displayCols} inputCols={inputCols} name="purchaserTenantId" displayName="Purchase Tenant Id" value={this.state.settings.purchaserTenantId} onChangeHandler={(event) => this.inputChangeHandler("purchaserTenantId", event)} />

                    <div>
                        <hr />
                        <TextInput displayCols={displayCols} inputCols="col col-xs-12 col-sm-12 col-md-4 col-lg-1"
                            name="purchaserTenantId" displayName="Add PlanId"
                            value={this.state.planInput}
                            onChangeHandler={(event) => this.planInputChangeHandler(event)}
                            onKeyPressHandler={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    this.planInputKeyPressHandler(event);
                                }
                            }} />
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-2">
                                <Table striped bordered hover>
                                    <tbody>
                                        {this.state.settings.plans ?
                                            this.state.settings.plans.map(plan => {
                                                return <tr><td>{plan}</td><td style={{ "width": "80px" }}><Button text="Remove" type="button" onClick={(event) => { this.planGridRemoveHandler(plan) }} /></td></tr>
                                            })
                                            : ""}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <Button text="Submit" />
                </form>
            </div>
        </div >)
    }
}

export default Settings;