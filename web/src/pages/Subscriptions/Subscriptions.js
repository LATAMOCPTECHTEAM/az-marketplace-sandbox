import React, { useState, Component } from 'react';
import SubscriptionGrid from "../../components/Subscription/SubscriptionGrid";
import Modal from "../../components/Modal";
import Button from "react-bootstrap/Button";
import SubscriptionEditor from "../../components/Subscription/SubscriptionEditor";
import SubscriptionDelete from "../../components/Subscription/SubscriptionDelete";
import SubscriptionLogin from "../../components/Subscription/SubscriptionLogin";

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

    handleClickEditSubscription(id) {
        this.state.editId = id;
        this.setState(this.state);
        this.modalEdit.show();
    }

    handleClickDeleteSubscription(id) {
        this.state.deleteId = id;
        this.setState(this.state);
        this.modalDelete.show();
    }

    handleClickLoginSubscription(id) {
        this.state.loginId = id;
        this.setState(this.state);
        this.modalLogin.show();
    }

    afterSubmitCreate() {
        this.modalCreate.close();
        this.subscriptionGrid.loadGrid();
    }

    afterSubmitEdit() {
        this.modalEdit.close();
        this.subscriptionGrid.loadGrid();
    }

    afterSubmitDelete() {
        this.modalDelete.close();
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
            <Modal title="Delete Subscription" ref={modalDelete => this.modalDelete = modalDelete} doneHandler={() => this.subscriptionDelete.submit()} >
                <SubscriptionDelete id={this.state.deleteId} ref={subscriptionDelete => this.subscriptionDelete = subscriptionDelete} afterSubmitHandler={() => this.afterSubmitDelete()} />
            </Modal>
            <Modal title="Login (Configure Account)" ref={modalLogin => this.modalLogin = modalLogin} hideDone={true} >
                <SubscriptionLogin id={this.state.loginId} />
            </Modal>
            <Button onClick={this.handleClickCreateSubscription.bind(this)}>Create Subscription</Button>
            <SubscriptionGrid ref={subscriptionGrid => this.subscriptionGrid = subscriptionGrid}
                onClickEdit={this.handleClickEditSubscription.bind(this)}
                onClickDelete={this.handleClickDeleteSubscription.bind(this)}
                onClickLogin={this.handleClickLoginSubscription.bind(this)} />
        </div>)
    }
}