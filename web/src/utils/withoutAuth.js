import React, { Component } from "react";
import AuthHelperMethods from "./AuthHelperMethods";

export default function withAuth(AuthComponent) {
  const auth = new AuthHelperMethods();

  return class VisitorAuthWrapped extends Component {
    state = {
      loaded: false
    };

    componentDidMount() {
      if (auth.loggedIn()) {
        this.props.history.replace("/");
      } else {
        this.setState({
          loaded: true
        });
      }
    }

    render() {
      if (this.state.loaded) {
        return <AuthComponent {...this.props} />;
      }
      return null;
    }
  };
}
