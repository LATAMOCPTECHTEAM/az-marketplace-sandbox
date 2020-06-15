import React, { Component } from 'react';
import SlidingPane from "react-sliding-pane";
import Button from "react-bootstrap/Button";
import SubscriptionGrid from "components/Subscription/SubscriptionGrid";
import SubscriptionEditor from "components/Subscription/SubscriptionEditor";
import SubscriptionDeleteModal from "components/Subscription/SubscriptionDeleteModal";
import SubscriptionView from "components/Subscription/SubscriptionView";

export default class Subscriptions extends Component {

    state = {
        showCreatePane: false,
        showEditPane: false,
        showDetailsPane: false,
        subscriptions: []
    }

    handleClickCreateSubscription() {
        this.setState({ showCreatePane: true });
    }

    handleClickEditSubscription(id) {
        this.setState({ showEditPane: true, currentId: id });
    }

    handleClickDeleteSubscription(id) {
        this.subscriptionDeleteModal.show();
        this.setState({ currentId: id });
    }

    reloadGrid() {
        this.subscriptionGrid.loadGrid();
    }

    onRowClick(index, row, cell) {
        if (row && cell.idx !== 0) {
            this.setState({ showDetails: true, currentId: row.id });
        }
    }

    render() {
        return (<div>
            <SlidingPane
                title="Create Subscription"
                isOpen={this.state.showCreatePane}
                onRequestClose={() => {
                    this.setState({ showCreatePane: false });
                }}>
                <SubscriptionEditor afterSubmit={() => this.setState({ showCreatePane: false }) | this.reloadGrid()} />
            </SlidingPane>

            <SlidingPane
                title="Edit Subscription"
                isOpen={this.state.showEditPane}
                onRequestClose={() => {
                    this.setState({ showEditPane: false });
                }}>
                <SubscriptionEditor id={this.state.currentId} afterSubmit={() => this.setState({ showEditPane: false }) | this.reloadGrid()} />
            </SlidingPane>

            <SubscriptionDeleteModal id={this.state.currentId} ref={subscriptionDeleteModal => this.subscriptionDeleteModal = subscriptionDeleteModal} afterSubmit={() => this.reloadGrid()} />

            <div className="row">
                <div className="col col-xs-12" style={{ marginBottom: "10px" }}>
                    <Button onClick={this.handleClickCreateSubscription.bind(this)}>Create Subscription</Button>
                    <SubscriptionGrid ref={subscriptionGrid => this.subscriptionGrid = subscriptionGrid}
                        onClickEdit={(id) => this.handleClickEditSubscription(id)}
                        onClickDelete={(id) => this.handleClickDeleteSubscription(id)}
                        onRowClick={this.onRowClick.bind(this)} />
                </div>

                <SlidingPane
                    isOpen={this.state.showDetails}
                    title="Subscription Details"
                    onRequestClose={() => {
                        this.setState({ showDetails: false });
                    }}>
                    <SubscriptionView ref={subscriptionView => this.subscriptionView = subscriptionView} id={this.state.currentId} afterAction={() => this.subscriptionGrid.loadGrid()} />
                </SlidingPane>
            </div>

        </div>)
    }
}