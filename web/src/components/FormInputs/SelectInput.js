import React from 'react';
import Form from "react-bootstrap/Form";

function SelectInput(props) {
    return (
        <div>
            <div className="form-group row">
                <label htmlFor={props.name} className={props.displayCols + " col-form-label"}>{props.displayName}</label>
                <div className={props.inputCols + ""}>
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
                    </Form.Group>
                </div>
            </div>
        </div>
    );
}

export default SelectInput;
