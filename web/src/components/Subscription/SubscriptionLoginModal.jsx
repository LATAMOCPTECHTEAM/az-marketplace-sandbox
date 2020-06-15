import React, { Component } from 'react';
import PropTypes from "prop-types";
import Modal from "components/Modal";
import SubscriptionLogin from "components/Subscription/SubscriptionLogin";

export default class SubscriptionDelete extends Component {

    show = () => this.modal.show();

    render() {
        return (<Modal size="lg" title="Login (Configure Account)" ref={modal => this.modal = modal} hideDone={true}>
            <SubscriptionLogin id={this.props.id} />
        </Modal>)
    }
}

SubscriptionDelete.propTypes = {
    id: PropTypes.number
}