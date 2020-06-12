import React, {  Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
require("./Modal.css")
class ModalComponent extends Component {

    state = {
        show: false
    }
    componentDidMount() {

    }

    show() {
        this.setState({ show: true })
    }

    close() {
        if (this.props.closeHandler)
            this.props.closeHandler();
        this.setState({ show: false })
    }

    handleDone() {
        if (this.props.doneHandler) {
            this.props.doneHandler()
        }
        if (this.props.onDone) {
            this.props.onDone()
        }
    };

    render() {
        return (

            <Modal backdrop="static" size={this.props.size} show={this.props.open || this.state.show} onHide={this.close.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.close.bind(this)}>Close</Button>
                    {
                        this.props.hideDone ? "" :
                            <Button variant="primary" onClick={this.handleDone.bind(this)}>
                                {this.props.submitText || "Done"}
                            </Button>
                    }
                </Modal.Footer>
            </Modal>

        );
    }
}

export default ModalComponent;
