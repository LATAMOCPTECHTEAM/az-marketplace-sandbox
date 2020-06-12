import React from 'react';
import ReactLoading from 'react-loading';
import "./WithLoading.css";

export default function WithLoading(props) {
    return (<React.Fragment>
        {props.show ?
            props.children :
            <div class="loading-container" >
                <ReactLoading type="bubbles" color="#375a7f" />
            </div>
        }
    </React.Fragment>)
}