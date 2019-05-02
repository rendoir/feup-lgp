import axios from "axios";
import * as React from "react";

import Chat from "../components/Chat/Chat";
import Post from "../components/Post/Post";
import Livestream from "../components/Livestream/Livestream";

import "../styles/Conference.css";
import styles from "../components/Post/Post.module.css";

interface Props {
  match: {
    params: {
      id: number;
    };
  };
}

type State = {
  hasChat: boolean;
  hasLiveStream: boolean;
};

class Conference extends React.Component<Props, State> {
  public id: number;

  constructor(props: Props) {
    super(props);
    this.id = this.props.match.params.id;

    this.state = {
      hasChat: true,
      hasLiveStream: true
    };
  }

  public componentDidMount() {
    //this.apiGetConference();
  }

  public apiGetConference() {
    let conferenceURL = `${location.protocol}//${location.hostname}`;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      conferenceURL += `:${process.env.REACT_APP_API_PORT}/conference/`;
    } else {
      conferenceURL += "/api/conference/";
    }
    conferenceURL += this.id;

    axios
      .get(conferenceURL, {})
      .then(res => {})
      .catch(() => console.log("Failed to get conference"));
  }

  public render() {
    return (
      <div id="Conference" className="container my-5">
        <a>Hello Conference {this.id}</a>
        <div className={`${styles.post_options} btn-group`}>
          <button
            className="w-100 h-100 ml-2"
            role="button"
            data-toggle="dropdown"
          >
            <i className="fas fa-ellipsis-v" />
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            {this.getDropdownButtons()}
          </div>
        </div>
        <div className="conf_head">
          <div className="live_container">
            <Livestream src="https://www.youtube.com/embed/DPfHHls50-w" />
          </div>
          <div className="chat_container">
            <Chat />
          </div>
        </div>
      </div>
    );
  }

  private getDropdownButtons() {
    const reportButton = (
      <button
        key={0}
        className={`dropdown-item ${styles.report_content}`}
        type="button"
        data-toggle="modal"
        //data-target={`#report_post_modal_${this.props.id}`}
        //onClick={this.handleConferenceReport}
        //disabled={this.state.userReport}
      >
        Report conference
      </button>
    );
    const deleteButton = (
      <button
        key={1}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        //data-target={`#delete_conference_modal${this.props.id}`}
      >
        Delete Conference
      </button>
    );
    const archiveButton = (
      <button
        key={2}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        //data-target={`#archive_conference_modal${this.props.id}`}
      >
        Delete Conference
      </button>
    );
    const dropdownButtons = [reportButton, deleteButton, archiveButton];
    return dropdownButtons;
  }
}

export default Conference;
