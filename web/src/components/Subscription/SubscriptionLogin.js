import React, { Component } from 'react';
import { CodeBlock } from "../FormInputs";
import SettingsService from "../../services/SettingsService";
import SubscriptionService from "../../services/SubscriptionService";

export default class SubscriptionLogin extends Component {

    state = {
        landingPageUrl: null,
        resolveResponse: null
    }

    async componentDidMount() {
        var settingsService = new SettingsService();
        var settings = await settingsService.getSettings();
        var subscriptionService = new SubscriptionService();
        var subscription = await subscriptionService.get(this.props.id);

        var resolveResponse = {
            "id": subscription.id,
            "subscriptionName": subscription.name,
            "offerId": subscription.offerId,
            "planId": subscription.planId,
            "quantity": subscription.offerId.quantity
        }

        this.setState({ landingPageUrl: settings.landingPageUrl })
        this.setState({ resolveResponse: resolveResponse })

    }

    render() {
        return (<div>
            {this.state.landingPageUrl ?
                <div>
                    <p>Yon can redirect to your application clicking <a href={this.state.landingPageUrl + "?token=" + this.props.id} target="_blank" rel="noopener noreferrer">here</a></p>

                    <br />
                    <h5>Expected Action<hr /></h5>

                    <p>You are expected to call the <a href="/">Resolve API</a> to decode the token and receive the following result:</p>

                    <CodeBlock language="json" text={JSON.stringify(this.state.resolveResponse, null, 4)} />

                    <p>After setting up everything on your SaaS application, you should call the <a href="/">Activate API</a> to start billing.</p>

                    <p>By Calling the Activate API the subscription status will be set to Subscribed.</p>
                    <p>* The Activate API should be only be called for Subscriptions in <code>PendingFulfillmentStart</code> state</p>

                </div> : ""}
        </div >)
    }
}