import React, { Component } from "react";
import AuthHelperMethods from "./AuthHelperMethods";

/* A higher order component is frequently written as a function that returns a class. */
export default function withAuth(AuthComponent, adminOnly = false) {
  const Auth = new AuthHelperMethods();

  return class AuthWrapped extends Component {
    state = {
      user: null,
      loaded: false
    };

    /* In the componentDidMount, we would want to do a couple of important tasks in order to verify the current users authentication status
    prior to granting them entrance into the app. */
    componentDidMount() {
      if (!Auth.loggedIn()) {
        this.props.history.replace("/login");
      } else {
        /* Try to get confirmation message from the Auth helper. */
        try {
          const user = Auth.getUserPayload();
          console.log("confirmation is:", user);
          this.setState({
            user,
            loaded: true
          });
        } catch (err) {
          /* Oh snap! Looks like there's an error so we'll print it out and log the user out for security reasons. */
          console.log(err);
          Auth.logout();
          this.props.history.replace("/login");
        }
      }
    }

    render() {
      if (this.state.loaded && this.state.user && this._hasPermissions()) {
        return (
          /* component that is currently being wrapped (App.js) */
          <AuthComponent {...this.props} confirm={this.state.confirm} />
        );
      }
      return null;
    }

    _hasPermissions() {
      return !adminOnly || this.state.user.permission === "admin";
    }
  };
}
