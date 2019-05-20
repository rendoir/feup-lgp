import axios from 'axios';
import * as React from 'react';
import '../styles/Invite.css';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

interface IState {
  email: string;
}

class Invite extends React.Component<{}, IState> {
  public static contextType = LanguageContext;
  public webmail = 'joaorreis@gmail.com';
  constructor(props) {
    super(props);
    this.state = {
      email: ' '
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
    this.setState({ email: '' });
  }

  public handleChange(event) {
    this.setState({ email: event.target.value });
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
            type="invite"
            value={this.state.email}
            onChange={this.handleChange}
          />
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
