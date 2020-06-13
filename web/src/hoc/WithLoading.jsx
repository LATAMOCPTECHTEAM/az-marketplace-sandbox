import React from 'react';
import ReactLoading from 'react-loading';
import "./WithLoading.css";

function WithLoading(props) {
    console.log("Loading")
    return (<React.Fragment>
        {props.show ?
            props.children :
            <div className="loading-container" >
                <ReactLoading type="bubbles" color="#375a7f" />
            </div>
        }
    </React.Fragment>)
}

export default React.memo(WithLoading);