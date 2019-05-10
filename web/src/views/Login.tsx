import axios from "axios";
import * as React from "react";
import Cookies from "universal-cookie";
import { getApiURL } from "../utils/apiURL";

const cookies = new Cookies();

type Props = {};

type State = {
  email: string;
  password: string;
};

class Login extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.handleAuthentication = this.handleAuthentication.bind(this);
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
              id="inputEmail"
              placeholder="E-mail"
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

  private handleAuthentication(e: any) {
    e.preventDefault();

    const userId = 20; // Fetch from API when login is implemented by using 'cookies.get("user_id")'
    console.log("User id: ", cookies.get("user_id"));
  }
}

export default Login;
