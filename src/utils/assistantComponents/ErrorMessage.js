import React from 'react';

const ErrorMessage = (props) => (
    <div className="message text-white bg-danger text-center card">
        <div className="card-body card-block">
            {props.text}
        </div>
    </div>
);
export default ErrorMessage;