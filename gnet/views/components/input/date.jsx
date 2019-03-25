const React = require('react');

class DateInput extends React.Component {
    render() {
        return (
            <div className={"form-group col-sm-4"}>
                <label>{this.props.label || "Date"}</label>
                <input type={"date"} className={"form-control"} aria-describedby={"dateHelp"}
                       value={new Date().getDate()} required={this.props.required}/>
                {this.props.children}
            </div>
        );
    }
}

module.exports = DateInput;