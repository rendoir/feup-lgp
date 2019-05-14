import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import AuthHelperMethods from "../../utils/AuthHelperMethods";
import { dictionary, LanguageContext } from "../../utils/language";

type State = {
  email: string;
  password: string;
};

class LoginForm extends React.Component<RouteComponentProps, State> {
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
      <form className="mt-3" onSubmit={this.handleAuthentication}>
        <div className="form-group">
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
        <div className="mt-3 text-center">
          <button type="submit" className="btn btn-primary">
            {dictionary.login[this.context]}
          </button>
        </div>
      </form>
    );
  }

  private handleAuthentication(e: any) {
    e.preventDefault();
    console.log(this.state);
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

export default withRouter(LoginForm);
