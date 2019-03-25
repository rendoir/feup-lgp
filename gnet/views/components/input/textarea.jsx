const React = require('react');

class TextareaInput extends React.Component {
    render() {
        return (
            <div className={"form-group col-sm-4"}>
                <label>{this.props.label || "Text Area"}</label>
                <textarea className={"form-control"} placeholder={this.props.placeholder || "Some text"}
                          required={this.props.required} minLength={this.props.minlength}
                          maxLength={this.props.maxlength}
                          rows={this.props.rows || 4} cols={this.props.cols || 80}/>
                {this.props.children}
            </div>
        );
    }
}

module.exports = TextareaInput;