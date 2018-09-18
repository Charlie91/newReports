import React from 'react';

class CheckButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_checked: false
        };
    }

    render() {
        return (
            <div className="checkButton" onClick={() => {
                this.setState(prevState => ({
                    is_checked: !prevState.is_checked
                }));
                this.props.onPress();
            }} >
                <div style={{background: (this.state.is_checked ? this.props.color : '#ffffff')}}
                     className={'checkbox' + (this.state.is_checked ? ' checked' : '')}></div>
                <div className="text">{this.props.title}</div>
                { this.props.tooltip_on ? (<div className="question_icon">
                        ?
                        <div className="tip">
                            {this.props.tooptip_text}
                        </div>
                    </div>) : ''
                }
            </div>
        );
    }
}

export default CheckButton;
