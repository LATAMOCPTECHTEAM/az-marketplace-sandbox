import React from 'react';
import Form from "react-bootstrap/Form";

function CheckBox(props) {
    return (
        <div>
            <div className="form-group row">
                <label htmlFor={props.name} className={props.displayCols + " col-form-label"}></label>
                <div className={props.inputCols + ""}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label={props.displayName} checked={props.checked}  onChange={props.onChangeHandler}/>
                        </Form.Group>
                        {props.children}
                    </Form.Group>
                </div>
            </div>
        </div>
    );
}

export default CheckBox;
