import React from 'react';
import Form from "react-bootstrap/Form";

function SelectMultiple(props) {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="control-label">{props.displayName}</label>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control as="select" multiple onChange={props.onChangeHandler} value={props.value} style={{ "borderBottomColor": "darkgray" }} >
                    {props.options ?
                        props.options.map(option => {
                            return <option>{option}</option>
                        })
                        : ""}
                </Form.Control>
                {props.children}
            </Form.Group>
        </div>
    );
}

export default SelectMultiple;
