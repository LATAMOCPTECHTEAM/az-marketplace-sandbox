import React from 'react';

function Title(props) {
    return (
        <h2 className="Title">
            {props.text}
            <hr style= {{ "backgroundColor": "gray"}} />
        </h2>
    );
}

export default Title;
