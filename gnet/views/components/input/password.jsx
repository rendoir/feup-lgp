const React = require('react');

class PasswordInput extends React.Component {
    render() {
        return (
            <div className={"form-group col-sm-4"}>
                <label>{this.props.label || "Password"}</label>
                <input type={"password"} id={"passwordInput"} className={"form-control"}
                       aria-describedby={"passwordHelp"} required={this.props.required}
                       pattern={"(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$"} min={"8"}/>
                <small className={"text-muted"}>Must contain at least one number and one uppercase and lowercase letter,
                    and at least 8 or more characters.
                </small>
                {this.props.children}
            </div>
        );
    }
}

module.exports = PasswordInput;