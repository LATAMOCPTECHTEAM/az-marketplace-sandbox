import React, { Component } from 'react';
import SlidingPane from "react-sliding-pane";
import Button from "react-bootstrap/Button";
import SubscriptionGrid from "components/Subscription/SubscriptionGrid";
import Modal from "components/Modal";
import SubscriptionEditor from "components/Subscription/SubscriptionEditor";
import SubscriptionDelete from "components/Subscription/SubscriptionDelete";
import SubscriptionView from "components/Subscription/SubscriptionView";

export default class Subscriptions extends Component {

    state = {
        editId: null,
        deleteId: null,
        loginId: null,
        showCreateSubscription: false,
        subscriptions: []
    }

    handleClickCreateSubscription() {
        this.setState({ showCreatePane: true });
    }

    handleClickEditSubscription(id) {
        this.setState({ showEditPane: true, currentId: id });
    }

    handleClickActionBar(id, modal) {
        this.setState({ currentId: id });
        modal.show();
    }

    closeModalAfterSubmit(modal) {
        modal.close();
        this.subscriptionGrid.loadGrid();
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

            <Modal title="Delete Subscription" ref={modalDelete => this.modalDelete = modalDelete} doneHandler={() => this.subscriptionDelete.submit()} >
                <SubscriptionDelete id={this.state.currentId} ref={subscriptionDelete => this.subscriptionDelete = subscriptionDelete} afterSubmitHandler={() => this.closeModalAfterSubmit(this.modalDelete)} />
            </Modal>
            <div className="row">
                <div className="col col-xs-12" style={{ marginBottom: "10px" }}>
                    <Button onClick={this.handleClickCreateSubscription.bind(this)}>Create Subscription</Button>
                    <SubscriptionGrid ref={subscriptionGrid => this.subscriptionGrid = subscriptionGrid}
                        onClickEdit={(id) => this.handleClickEditSubscription(id)}
                        onClickDelete={(id) => this.handleClickActionBar(id, this.modalDelete)}
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