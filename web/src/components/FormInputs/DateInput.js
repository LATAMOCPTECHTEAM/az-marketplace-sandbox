import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./DateInput.css";
function DateInput(props) {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="control-label">{props.displayName}</label>
            <div className="form-control">
                <DatePicker
                    selected={props.value}
                    onChange={props.onChangeHandler}
                />
            </div>
            {props.children}
            {props.validator ? props.validator.message(props.displayName, props.value, props.validatorOptions, { className: "validator-error" }) : ""}
        </div>
    );
}

export default DateInput;
