import * as React from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class Login extends React.Component {
  constructor(props: any) {
    super(props);

    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  public handleAuthentication(e: any) {
    e.preventDefault();
    console.log("AUTENTICATIOOON");
    const userId = 1; // Fetch from API when login is implemented
    cookies.set("user_id", userId, { path: "/" });
    console.log("User id: ", cookies.get("user_id"));
  }

  public render() {
    return (
      <div
        className="row mt-5 d-flex justify-content-center"
        id="register-landing"
      >
        <form onSubmit={this.handleAuthentication}>
          <h3 className="text-center">Login</h3>
          <div className="form-group mt-3">
            <input
              type="email"
              className="form-control col"
              id="inputUsername"
              placeholder="Username"
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="password"
              className="form-control col"
              id="inputPassword"
              placeholder="Password"
            />
          </div>
          <div className="mt-5 text-center">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
