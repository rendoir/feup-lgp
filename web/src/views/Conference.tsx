import axios from "axios";
import * as React from "react";

import Chat from "../components/Chat/Chat";
import Post from "../components/Post/Post";
import Livestream from "../components/Livestream/Livestream";

import "../styles/Conference.css";

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
      <div id="Conference" className="my-5">
        <div className="conf_head w-100">
          <div className="live_wrap">
            <div className="live_container">
              <Livestream src="https://www.youtube.com/embed/DPfHHls50-w" />
            </div>
          </div>
          <div className="chat_wrap">
            <div className="chat_container">
              <Chat />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Conference;
