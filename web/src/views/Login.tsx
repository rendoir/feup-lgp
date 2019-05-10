import * as React from "react";
import Cookies from "universal-cookie";
import { dictionary, LanguageContext } from "../utils/language";

const cookies = new Cookies();

class Login extends React.Component {
  static contextType = LanguageContext;

  constructor(props: any) {
    super(props);

    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  public handleAuthentication(e: any) {
    e.preventDefault();
    console.log("AUTENTICATIOOON");
    const userId = 20; // Fetch from API when login is implemented by using 'cookies.get("user_id")'
    console.log("User id: ", cookies.get("user_id"));
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
              id="inputUsername"
              placeholder={dictionary.username[this.context]}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="password"
              className="form-control col"
              id="inputPassword"
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
}

export default Login;
