import React from 'react';
import ReactLoading from 'react-loading';

export default function (props) {
    return <div>
        {props.show ?
            props.children : <ReactLoading type="bubbles" color="#375a7f" />
        }
    </div>
}