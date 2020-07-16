import React, { Component } from 'react';
import { CodeBlock } from "components/FormInputs";
import { SettingsService, SubscriptionService } from "services";
import { WithLoading, WithErrorHandler } from "hoc";

export default class SubscriptionLogin extends Component {

    constructor(props) {
        super(props);
        this.settingsService = new SettingsService();
        this.subscriptionService = new SubscriptionService();
        this.state = {
            loading: true,
            landingPageUrl: null,
            resolveResponse: null
        }
    }

    async componentDidMount() {
        try {
            var settings = await this.settingsService.getSettings();
            var subscription = await this.subscriptionService.get(this.props.id);

            var resolveResponse = {
                "id": subscription.id,
                "subscriptionName": subscription.name,
                "offerId": subscription.offerId,
                "planId": subscription.planId,
                "quantity": subscription.offerId.quantity
            }

            this.setState({ landingPageUrl: settings.landingPageUrl, resolveResponse: resolveResponse, loading: false })
        } catch (error) {
            this.setState({ error: error, loading: false });
            console.error(error);
        }
    }

    render() {
        return (
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <div>
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
                    </div>
                </WithErrorHandler>
            </WithLoading>)
    }
}