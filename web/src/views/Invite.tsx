import axios from 'axios';
import * as React from 'react';
import '../styles/Invite.css';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

interface IState {
  email: string;
  error: boolean;
  sent: boolean;
}

class Invite extends React.Component<{}, IState> {
  public static contextType = LanguageContext;
  constructor(props) {
    super(props);
    this.state = {
      email: ' ',
      error: false,
      sent: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public apiSendMail(webmail) {
    let inviteUrl = `${location.protocol}//${location.hostname}`;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      inviteUrl += `:${process.env.REACT_APP_API_PORT}/invite`;
    } else {
      inviteUrl += '/api/invite';
    }
    axiosInstance
      .post(inviteUrl, { email: webmail })
      .catch(() => console.log('Failed to send mail'));
    if (this.state.error) {
      this.setState({ email: '' });
      this.setState({ sent: false });
    } else {
      this.setState({ email: '' });
      this.setState({ sent: true });
    }
  }

  public handleChange(event) {
    if (!/.+@.+\.[A-Za-z]+$/.test(this.state.email)) {
      this.setState({ email: event.target.value, error: true, sent: false });
    } else {
      this.setState({ email: event.target.value, error: false });
    }
  }

  public handleSubmit(event) {
    event.preventDefault();
  }

  public render() {
    return (
      <div className="col-lg-6 col-centered">
        <label>
          {dictionary.send_email[this.context]}
          <input
            type={'email'}
            value={this.state.email}
            onChange={this.handleChange}
          />
          {this.state.error ? (
            <small className={'text-danger'}>
              {this.state.error}
              {dictionary.invite_email_error[this.context]}
            </small>
          ) : null}
          {this.state.sent ? (
            <small className={'sucesso'}>
              {this.state.sent}
              {dictionary.invite_sucess[this.context]}
            </small>
          ) : null}
        </label>
        <button
          className="btn btn-primary"
          onClick={() => this.apiSendMail(this.state.email)}
        >
          {dictionary.invite[this.context]}
        </button>
      </div>
    );
  }
}

export default withAuth(Invite);
