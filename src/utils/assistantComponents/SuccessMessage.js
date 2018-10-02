import React from 'react';

const SuccessMessage = (props) => (
    <div className="message text-white bg-success text-center card">
        <div className="card-body card-block">
            {props.text}
        </div>
    </div>
);

export default SuccessMessage;