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
  posts: any[];
  title: string;
  description: string;
  place: string;
  date_start: string;
  date_end: string;
  isHidden: boolean;
};

class Conference extends React.Component<Props, State> {
  public id: number;

  constructor(props: Props) {
    super(props);
    this.id = this.props.match.params.id;

    this.state = {
      hasChat: true,
      hasLiveStream: true,
      isHidden: false,
      title: "Conference title",
      description:
        "Nam ut metus sed purus aliquet porttitor sit amet nec metus. Fusce porta neque pellentesque mollis porttitor. Mauris eget leo metus. Etiam venenatis condimentum efficitur. Etiam libero lorem, ornare ac leo nec, accumsan eleifend arcu. Donec at lectus quam. Vivamus ornare ipsum ut dolor faucibus sollicitudin faucibus sit amet orci. In sit amet venenatis eros. Integer vestibulum rhoncus vehicula. Ut venenatis dignissim tellus vel facilisis.",
      //posts: []
      posts: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          content: "This is the post content",
          likes: 0,
          title: "My title",
          date_created: "2019-12-03",
          visibility: "public",
          comments: [],
          likers: [],
          tags: [],
          files: []
        },
        {
          id: 2,
          first_name: "John",
          last_name: "Doe",
          content: "This is the post content",
          likes: 0,
          title: "My title",
          date_created: "2019-12-03",
          visibility: "public",
          comments: [],
          likers: [],
          tags: [],
          files: []
        }
      ],
      place: "Porto",
      date_start: "14:30 20/03/2019",
      date_end: "16:30 20/03/2019"
    };

    this.handleHideConference = this.handleHideConference.bind(this);
  }

  public componentDidMount() {
    //TODO
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

  public handleHideConference() {
    if (this.state.isHidden) {
      this.setState({
        isHidden: false
      });
    } else {
      this.setState({
        isHidden: true
      });
    }
  }

  public render() {
    if (this.state.isHidden) {
      // && not owner
      return (
        <div id="hiddenConference" className="my-5">
          <a>The owner has closed this conference.</a>
        </div>
      );
    } else {
      return (
        <div id="Conference" className="my-5">
          <div className="container my-5">
            <h4>
              {this.state.title}
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
            </h4>
            <p>{this.state.description}</p>
          </div>

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

          <div className="container my-5">
            <div className="conf_details p-3">{this.getDetails()}</div>
            <div className="conf_posts">{this.getPosts()}</div>
          </div>
        </div>
      );
    }
  }

  private getPosts() {
    return this.state.posts.map(post => (
      <Post
        key={post.id}
        id={post.id}
        author={post.first_name + " " + post.last_name}
        text={post.content}
        likes={post.likes}
        title={post.title}
        date={post.date_created.replace(/T.*/gi, "")}
        visibility={post.visibility}
        comments={post.comments}
        likers={post.likers}
        tags={post.tags}
        files={post.files}
        user_id={1}
      />
    ));
  }

  private getDetails() {
    return (
      <ul className="p-0 m-0">
        <li>
          <i className="fas fa-map-marker-alt" /> {this.state.place}
        </li>
        <li>
          <i className="fas fa-hourglass-start" /> {this.state.date_start}
        </li>
        <li>
          <i className="fas fa-hourglass-end" /> {this.state.date_end}
        </li>
      </ul>
    );
  }

  public getDropdownButtons() {
    const hideBtnText = this.state.isHidden
      ? "Reopen Conference"
      : "Hide Conference";

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
        onClick={this.handleHideConference}
        //data-target={`#delete_conference_modal${this.props.id}`}
      >
        {hideBtnText}
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
