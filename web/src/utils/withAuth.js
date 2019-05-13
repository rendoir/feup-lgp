import React, { Component } from "react";
import AuthHelperMethods from "./AuthHelperMethods";

/* A higher order component is frequently written as a function that returns a class. */
export default function withAuth(AuthComponent, adminOnly = false) {
  const auth = new AuthHelperMethods();

  return class AuthWrapped extends Component {
    state = {
      user: null,
      loaded: false
    };

    /* In the componentDidMount, we would want to do a couple of important tasks in order to verify the current users authentication status
    prior to granting them entrance into the app. */
    componentDidMount() {
      if (!auth.loggedIn()) {
        this.props.history.replace("/landing");
      } else {
        /* Try to get confirmation message from the Auth helper. */
        try {
          const user = auth.getUserPayload();
          if (!this._hasPermissions(user)) {
            this.props.history.replace("/");
          }
          this.setState({
            user,
            loaded: true
          });
        } catch (err) {
          /* Oh snap! Looks like there's an error so we'll print it out and log the user out for security reasons. */
          console.log(err);
          auth.logout();
          this.props.history.replace("/landing");
        }
      }
    }

    render() {
      if (this.state.loaded && this.state.user) {
        return (
          /* component that is currently being wrapped (App.js) */
          <AuthComponent {...this.props} user={this.state.user} />
        );
      }
      return null;
    }

    _hasPermissions(user) {
      return !adminOnly || user.permission === "admin";
    }
  };
}
