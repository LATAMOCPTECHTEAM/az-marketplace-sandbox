import React, { useState, Component } from 'react';
import SubscriptionGrid from "../../components/Subscription/SubscriptionGrid";
import SubscriptionService from "../../services/SubscriptionService";
import Modal from "../../components/Modal";
import Button from "react-bootstrap/Button";
import SubscriptionEditor from "../../components/Subscription/SubscriptionEditor";

export default class Subscriptions extends Component {

    state = {
        editId: null,
        showCreateSubscription: false,
        subscriptions: []
    }

    handleClickCreateSubscription() {
        this.modalCreate.show();
    }

    handleClickEditSubscription(id) {
        this.state.editId = id;
        this.setState(this.state);
        this.modalEdit.show();
    }

    afterSubmitCreate() {
        this.modalCreate.close();
        this.subscriptionGrid.loadGrid();
    }

    afterSubmitEdit() {
        this.modalEdit.close();
        this.subscriptionGrid.loadGrid();
    }


    render() {
        return (<div>
            <Modal title="Create Subscription" size="xl" ref={modalCreate => this.modalCreate = modalCreate} doneHandler={() => this.subscriptionCreate.submit()} >
                <SubscriptionEditor ref={subscriptionCreate => this.subscriptionCreate = subscriptionCreate} afterSubmitHandler={() => this.afterSubmitCreate()} />
            </Modal>
            <Modal title="Edit Subscription" size="xl" ref={modalEdit => this.modalEdit = modalEdit} doneHandler={() => this.subscriptionEdit.submit()} >
                <SubscriptionEditor id={this.state.editId} ref={subscriptionEdit => this.subscriptionEdit = subscriptionEdit} afterSubmitHandler={() => this.afterSubmitEdit()} />
            </Modal>
            <Button onClick={this.handleClickCreateSubscription.bind(this)}>Create Subscription</Button>
            <SubscriptionGrid ref={subscriptionGrid => this.subscriptionGrid = subscriptionGrid} onClickEdit={this.handleClickEditSubscription.bind(this)} />
        </div>)
    }
}