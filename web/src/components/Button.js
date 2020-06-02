import React from 'react';

function Button(props) {
    return (
        <button type="submit" className="btn btn-primary" value={props.value}>{props.text}</button>
    );
}

export default Button;
