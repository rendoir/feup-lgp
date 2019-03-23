var React = require('react');

class DefaultError extends React.Component {
  render() {
    return (
        <div>
          <h3>Error {this.props.status}</h3>
          <h6>{this.props.message}</h6>
        </div>
    );
  }
}

module.exports = DefaultError;