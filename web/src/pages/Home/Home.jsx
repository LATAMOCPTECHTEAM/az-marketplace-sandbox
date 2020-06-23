import React from 'react';

function Home() {
    return (
        <div className="Home row">
            <div className="col col-xs-12 col-sm-12 col-md-6">
                <br />
                <p>
                    This project was made to enable developers creating/integrating Apps to the Azure Marketplace to be able to test the integrations locally.
                    In the common marketplace integration approach, is necessary to have an offer created in Partner Center and to deploy your solution to be public acessible.
                </p>

                <br />
                <p> This approach has the following problems:</p>

                <ul>
                    <li> Your deployment can break production</li>
                    <li>Some changes may need to re-submit to the Marketplace</li>
                    <li>Can’t debug locally</li>
                    <li>Two developers working in the same app, can break one another</li>
                    <li>Having to publish on each change is very slow</li>
                </ul>

                <br />
                <h5>Running the Sandbox locally, enable developers to fix all the problems above, helping the to integrate the solution faster and with more reliability.</h5>
                <br />
                <p>The sandbox enables users to simulate:</p>
                <ul>
                    <li>Creating a SaaS Subscription</li>
                    <li>Login Token Genereation (a.k.a. Configure Account button)</li>
                    <li>Changing SaaS Plan</li>
                    <li>Suspending a SaaS Plan</li>
                    <li>Reinstating a SaaS Plan</li>
                    <li>Unsubscribing to a SaaS Plan</li>
                    <li>Webhook integration</li>
                </ul>
            </div>
            <div className="col col-xs-12 col-sm-12 col-md-6">
                <h3> Table of Contents</h3>
                <ul>
                    <li><a href="https://github.com/psbds/az-marketplace-sandbox/wiki/Running-the-Sandbox" target="_blank" rel="noopener noreferrer">Running the Sandbox</a></li>
                    <li><a href="https://github.com/psbds/az-marketplace-sandbox/wiki/Configuring-the-Sandbox" target="_blank" rel="noopener noreferrer">Configuring the Sandbox</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Home;