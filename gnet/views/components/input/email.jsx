const React = require('react');

class EmailInput extends React.Component {
    render() {
        return (
            <div className={"form-group col-sm-4"}>
                <label>{this.props.label || "Email address"}</label>
                <input type={"email"} className={"form-control"} aria-describedby={"emailHelp"}
                       placeholder={"name@example.com"} required={this.props.required}
                       pattern={"^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"}/>
                {this.props.children}
            </div>
        );
    }
}

module.exports = EmailInput;