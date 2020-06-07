import React, { Component } from 'react';
import Modal from "../Modal";
import SubscriptionLogin from "../Subscription/SubscriptionLogin";

export default class SubscriptionDelete extends Component {

    show = () => this.modal.show();

    render() {
        return (<Modal size="lg" title="Login (Configure Account)" ref={modal => this.modal = modal} hideDone={true}>
            <SubscriptionLogin ref={form => this.form = form} id={this.props.id} />
        </Modal>
        )
    }
}