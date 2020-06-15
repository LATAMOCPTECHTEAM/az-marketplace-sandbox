import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import "./Modal.css";
import PropTypes from "prop-types";

export default class ModalComponent extends Component {

    state = {
        show: false
    }

    show() {
        this.setState({ show: true })
    }

    close() {
        this.props.onClose && this.props.onClose();
        this.setState({ show: false })
    }

    doneHandler() {
        this.props.onDone && this.props.onDone();
    };

    render() {
        return (
            <Modal backdrop="static" size={this.props.size} show={this.state.show} onHide={this.close.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.close.bind(this)}>Close</Button>
                    {
                        this.props.hideDone ? "" :
                            <Button variant="primary" onClick={this.doneHandler.bind(this)}>
                                {this.props.submitText || "Done"}
                            </Button>
                    }
                </Modal.Footer>
            </Modal>

        );
    }
}

ModalComponent.propTypes = {
    id: PropTypes.number,
    size: PropTypes.string,
    submitText: PropTypes.string,
    hideDone: PropTypes.bool,
    onDone: PropTypes.func,
    onClose: PropTypes.func,
}