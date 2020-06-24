import React from 'react';

export default function TextInput(props) {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="control-label">{props.displayName}</label>
            <input className="form-control" id={props.name} placeholder={props.placeholder} type={props.type || "text"} style={{ "borderBottomColor": "darkgray", width: "100%" }} value={props.value} onChange={props.onChangeHandler} onKeyPress={props.onKeyPressHandler} />
            {props.children}
            {props.validator ? props.validator.message(props.displayName, props.value, props.validatorOptions, { className: "validator-error" }) : ""}
        </div>
    );
}