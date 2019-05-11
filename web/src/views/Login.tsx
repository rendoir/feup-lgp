import * as React from "react";
import { RouteComponentProps } from "react-router";
import Cookies from "universal-cookie";
import AuthHelperMethods from "../utils/AuthHelperMethods";

const cookies = new Cookies();

type State = {
  email: string;
  password: string;
};

class Login extends React.Component<RouteComponentProps, State> {
  private auth = new AuthHelperMethods();

  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
              name="email"
              onChange={this.handleInputChange}
              placeholder="E-mail"
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="password"
              className="form-control col"
              id="inputPassword"
              name="password"
              onChange={this.handleInputChange}
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
    this.auth
      .login(this.state.email, this.state.password)
      .then(res => {
        console.log(res);
        this.props.history.push("/");
      })
      .catch(err => {
        console.error(err);
      });
    // const userId = 20; // Fetch from API when login is implemented by using 'cookies.get("user_id")'
    // console.log("User id: ", cookies.get("user_id"));
  }

  private handleInputChange(event: any) {
    const field = event.target.name;
    const value = !event.target.value.replace(/\s/g, "").length
      ? ""
      : event.target.value; // Ignore input only containing white spaces

    const partialState: any = {};
    partialState[field] = value;
    this.setState(partialState);
  }
}

export default Login;
