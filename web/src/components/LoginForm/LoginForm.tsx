import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import AuthHelperMethods from '../../utils/AuthHelperMethods';
import { dictionary, LanguageContext } from '../../utils/language';

import styles from './LoginForm.module.scss';

type State = {
  email: string;
  password: string;
  wrongCredentials: boolean;
};

class LoginForm extends React.Component<RouteComponentProps, State> {
  public static contextType = LanguageContext;
  private auth = new AuthHelperMethods();

  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      password: '',
      wrongCredentials: false
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
          <p
            id={styles.wrongLogin}
            className={(this.state.wrongCredentials ? '' : 'd-none') + ' pt-1'}
          >
            {dictionary.wrong_credentials[this.context]}
          </p>
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

    this.auth
      .login(this.state.email, this.state.password)
      .then(res => {
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({ wrongCredentials: true });
        console.error(err);
      });
  }

  private handleInputChange(event: any) {
    const field = event.target.name;
    const value = !event.target.value.replace(/\s/g, '').length
      ? ''
      : event.target.value; // Ignore input only containing white spaces

    const partialState: any = {};
    partialState[field] = value;
    this.setState(partialState);
  }
}

export default withRouter(LoginForm);
