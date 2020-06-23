import React from 'react';

export default function TextInput(props) {
    return (
        <div>
            <div className="form-group row">
                <label htmlFor={props.name} className={props.displayCols + " col-form-label"}>{props.displayName}</label>
                <div className={props.inputCols}>
                    <input className="form-control-plaintext" id={props.name} placeholder={props.placeholder} type={props.type || "text"} style={{ "borderBottomColor": "darkgray" }} value={props.value} onChange={props.onChangeHandler} onKeyPress={props.onKeyPressHandler} />
                    {props.children}
                    {props.validator ? props.validator.message(props.displayName, props.value, props.validatorOptions, { className: "validator-error" }) : ""}
                </div>
            </div>
        </div>
    );
}