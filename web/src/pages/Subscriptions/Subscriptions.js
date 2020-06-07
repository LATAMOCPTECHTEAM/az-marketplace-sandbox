import React, { useState, Component } from 'react';
import SubscriptionGrid from "../../components/Subscription/SubscriptionGrid";
import Modal from "../../components/Modal";
import Button from "react-bootstrap/Button";
import SubscriptionEditor from "../../components/Subscription/SubscriptionEditor";
import SubscriptionDelete from "../../components/Subscription/SubscriptionDelete";
import SubscriptionView from "../../components/Subscription/SubscriptionView";

export default class Subscriptions extends Component {

    state = {
        editId: null,
        deleteId: null,
        loginId: null,
        showCreateSubscription: false,
        subscriptions: []
    }

    handleClickCreateSubscription() {
        this.modalCreate.show();
    }

    handleClickActionBar(id, modal) {
        this.setState({ currentId: id });
        modal.show();
    }

    closeModalAfterSubmit(modal) {
        modal.close();
        this.subscriptionGrid.loadGrid();
    }

    onRowClick(index, row) {
        if (row) {
            this.setState({ currentId: row.id });
        }
    }

    render() {
        return (<div>
            <Modal title="Create Subscription" size="xl" ref={modalCreate => this.modalCreate = modalCreate} onDone={() => this.subscriptionCreate.submit()} >
                <SubscriptionEditor ref={subscriptionCreate => this.subscriptionCreate = subscriptionCreate} afterSubmitHandler={() => this.closeModalAfterSubmit(this.modalCreate)} />
            </Modal>
            <Modal title="Edit Subscription" size="xl" ref={modalEdit => this.modalEdit = modalEdit} doneHandler={() => this.subscriptionEdit.submit()} >
                <SubscriptionEditor id={this.state.currentId} ref={subscriptionEdit => this.subscriptionEdit = subscriptionEdit} afterSubmitHandler={() => this.closeModalAfterSubmit(this.modalEdit)} />
            </Modal>
            <Modal title="Delete Subscription" ref={modalDelete => this.modalDelete = modalDelete} doneHandler={() => this.subscriptionDelete.submit()} >
                <SubscriptionDelete id={this.state.currentId} ref={subscriptionDelete => this.subscriptionDelete = subscriptionDelete} afterSubmitHandler={() => this.closeModalAfterSubmit(this.modalDelete)} />
            </Modal>
            <div className="row">
                <div className="col col-xs-12 col-sm-12 col-md-12 col-lg-6" style={{ marginBottom: "10px" }}>
                    <Button onClick={this.handleClickCreateSubscription.bind(this)}>Create Subscription</Button>
                    <SubscriptionGrid ref={subscriptionGrid => this.subscriptionGrid = subscriptionGrid}
                        onClickEdit={(id) => this.handleClickActionBar(id, this.modalEdit)}
                        onClickDelete={(id) => this.handleClickActionBar(id, this.modalDelete)}
                        onRowClick={this.onRowClick.bind(this)} />
                </div>

                <div className="col col-xs-12 col-sm-12 col-md-12 col-lg-6">
                    {this.state.currentId ?
                        <SubscriptionView ref={subscriptionView => this.subscriptionView = subscriptionView} id={this.state.currentId} afterAction={() => this.subscriptionGrid.loadGrid()} />
                        : "Select a Subscription to see the details"}
                </div>
            </div>

        </div>)
    }
}