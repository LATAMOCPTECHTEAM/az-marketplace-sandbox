import React from 'react';
import Form from "react-bootstrap/Form";

export default function SelectInput(props) {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="control-label">{props.displayName}</label>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control as="select" onChange={props.onChangeHandler} value={props.value} style={{ "borderBottomColor": "darkgray" }} >
                    <option selected value="">Choose...</option>
                    {props.options ?
                        props.options.map(option => {
                            return <option>{option}</option>
                        })
                        : ""}
                </Form.Control>
                {props.children}
                {props.validator ? props.validator.message(props.displayName, props.value, props.validatorOptions, { className: "validator-error" }) : ""}
            </Form.Group>
        </div>
    );
}