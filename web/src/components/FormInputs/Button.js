import React from 'react';

function Button(props) {
    return (
        <button type={props.type || "submit"} className="btn btn-primary" value={props.value} onClick={props.onClick}>{props.text}</button>
    );
}

export default Button;
