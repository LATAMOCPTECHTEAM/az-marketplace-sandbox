import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function DateInput(props) {
    return (
        <div>
            <div className="form-group row">
                <label htmlFor={props.name} className={props.displayCols + " col-form-label"}>{props.displayName}</label>
                <div className={props.inputCols + ""}>
                    <div>
                        <DatePicker
                            selected={props.value}
                            onChange={props.onChangeHandler}
                        />
                    </div>
                    {props.children}
                    {props.validator ? props.validator.message(props.displayName, props.value, props.validatorOptions, { className: "validator-error" }) : ""}
                </div>
            </div>
        </div>
    );
}

export default DateInput;
