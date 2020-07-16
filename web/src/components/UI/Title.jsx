import React from 'react';

export default function Title(props) {
    return (
        <h2 className="Title">
            {props.text}
            <hr />
        </h2>
    );
}