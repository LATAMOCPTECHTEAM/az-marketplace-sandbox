import React from 'react';

function WithErrorHandler(props) {
    return (
        <React.Fragment>
            {props.error ? <div className="jumbotron">
                <p><strong>Error: </strong>{props.error.message}</p>
                <p><strong>StackTrace: </strong> </p>
                <code style={{ width: "100%", minHeight: "200px", "white-space": "pre-line" }}>
                    {props.error.stack}
                </code>
            </div> : props.children}
        </React.Fragment>
    );
}

export default React.memo(WithErrorHandler);