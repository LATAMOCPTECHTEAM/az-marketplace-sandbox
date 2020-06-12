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

    onRowClick(index, row, cell) {
        if (row && cell.idx !== 0) {
            this.setState({ showDetails: true, currentId: row.id });
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
                <div className="col col-xs-12" style={{ marginBottom: "10px" }}>
                    <Button onClick={this.handleClickCreateSubscription.bind(this)}>Create Subscription</Button>
                    <SubscriptionGrid ref={subscriptionGrid => this.subscriptionGrid = subscriptionGrid}
                        onClickEdit={(id) => this.handleClickActionBar(id, this.modalEdit)}
                        onClickDelete={(id) => this.handleClickActionBar(id, this.modalDelete)}
                        onRowClick={this.onRowClick.bind(this)} />
                </div>

                <SlidingPane
                    className="some-custom-class"
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