import React from 'react';

function TextInput(props) {
    return (
        <div className="form-group row">
            <label htmlFor={props.name} className="col-xs-12 col-sm-4 col-md-2 col-lg-1 col-form-label">{props.displayName}</label>
            <div className="col-xs-12 col-sm-7 col-md-6 col-lg-4">
                <input type="text" className="form-control-plaintext" id={props.name} placeholder={props.placeholder} style={{"borderBottomColor": "darkgray"}} value={props.value} onChange={props.onChangeHandler} />
            </div>
        </div>
    );
}

export default TextInput;
