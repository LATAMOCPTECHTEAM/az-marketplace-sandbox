import React from 'react';

function Error(props) {
    return (
        <div>
            <strong>Error: </strong>{props.error.message}
            <br/>
            <code>
                {props.error.stack}
            </code>
        </div>
    );
}

export default Error;
