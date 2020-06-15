import React from 'react';

function Title(props) {
    return (
        <h2 className="Title">
            {props.text}
            <hr />
        </h2>
    );
}

export default Title;
