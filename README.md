# Azure Marketplace Sandbox

### *This project is still under construction*

This project was made to enable developers creating/integrating Apps to the Azure Marketplace to be able to test the integrations locally. In the common marketplace integration approach, is necessary to have an offer created in Partner Center and to deploy your solution to be public acessible.

This approach has the following problems:

* Your deployment can break production
* Some changes may need to re-submit to the Marketplace
* Can’t debug locally
* Two developers working in the same app, can break one another
* Having to publish on each change is very slow


Running the Sandbox locally, enable developers to fix all the problems above, helping the to integrate the solution faster and with more reliability.


The sandbox enables users to simulate:
- Creating a SaaS Subscription
- Login Token Genereation (a.k.a. Configure Account button)
- Changing SaaS Plan
- Suspending a SaaS Plan
- Reinstating a SaaS Plan
- Unsubscribing to a SaaS Plan
- Webhook integration
  
The sanbdox provides a user interface to the simulation above and also mimics the SaaS Fullfilment APIs described [here](https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2) (To look at the APIs acess the /swagger path after running the sandbox).

## User Guide

### [Running the Sandbox](../../wiki/Running-the-Sandbox)
### [Configuring the Sandbox](../../wiki/Configuring-the-Sandbox)
### [Creating a SaaS Subscription](../../wiki/Creating-the-SaaS-Subscription)
### [Login Token Generation (Configure Account)](#)
### [Simulating Change Plan](#)
### [Simulating Change Quantity](#)
### [Simulating Suspend](#)
### [Simulating Reinstate](#)
### [Simulating Unsubscribe](#)
