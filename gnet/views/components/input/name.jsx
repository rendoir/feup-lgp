const React = require('react');

class NameInput extends React.Component {
    render() {
        return (
            <div className={"form-group col-sm-4"}>
                <label>{this.props.label || "Full Name"}</label>
                <input type={"text"} className={"form-control"} aria-describedby={"nameHelp"} placeholder={"John Doe"}
                       required={this.props.required}
                       pattern={"^[a-zA-Z ]+$"}/>
                {this.props.children}
            </div>
        );
    }
}

module.exports = NameInput;