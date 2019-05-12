import * as React from "react";
import { RouteComponentProps } from "react-router";
import AuthHelperMethods from "../utils/AuthHelperMethods";
import { dictionary, LanguageContext } from "../utils/language";
import withoutAuth from "../utils/withoutAuth";

type State = {
  email: string;
  password: string;
};

class Login extends React.Component<RouteComponentProps, State> {
  public static contextType = LanguageContext;
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
          <h3 className="text-center">{dictionary.login[this.context]}</h3>
          <div className="form-group mt-3">
            <input
              type="email"
              className="form-control col"
              id="inputEmail"
              name="email"
              onChange={this.handleInputChange}
              placeholder={dictionary.email[this.context]}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="password"
              className="form-control col"
              id="inputPassword"
              name="password"
              onChange={this.handleInputChange}
              placeholder={dictionary.password[this.context]}
            />
          </div>
          <div className="mt-5 text-center">
            <button type="submit" className="btn btn-primary">
              {dictionary.login[this.context]}
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
        this.props.history.push("/");
      })
      .catch(err => {
        console.error(err);
      });
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

export default withoutAuth(Login);
