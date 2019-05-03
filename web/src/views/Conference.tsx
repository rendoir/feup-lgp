import axios from "axios";
import * as React from "react";

import Chat from "../components/Chat/Chat";
import Livestream from "../components/Livestream/Livestream";
import Post from "../components/Post/Post";

import "../styles/Conference.css";
import styles from "../components/Post/Post.module.css";

interface IProps {
  match: {
    params: {
      id: number;
      user_id: 1;
      visibility: string;
    };
  };
}

interface IState {
  hasChat: boolean;
  hasLiveStream: boolean;
  posts: any[];
  title: string;
  description: string;
  place: string;
  date_start: string;
  date_end: string;
  isHidden: boolean;
}

class Conference extends React.Component<IProps, IState> {
  public id: number;
  public userId: number;

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;
    this.userId = 1; // cookies.get("user_id"); - change when login fetches user id properly

    this.state = {
      date_end: "16:30 20/03/2019",
      date_start: "14:30 20/03/2019",
      description:
        "Nam ut metus sed purus aliquet porttitor sit amet nec metus. Fusce porta neque pellentesque mollis porttitor. Mauris eget leo metus. Etiam venenatis condimentum efficitur. Etiam libero lorem, ornare ac leo nec, accumsan eleifend arcu. Donec at lectus quam. Vivamus ornare ipsum ut dolor faucibus sollicitudin faucibus sit amet orci. In sit amet venenatis eros. Integer vestibulum rhoncus vehicula. Ut venenatis dignissim tellus vel facilisis.",
      hasChat: true,
      hasLiveStream: true,
      isHidden: false,
      place: "Porto",
      // posts: []
      posts: [
        {
          comments: [],
          content: "This is the post content",
          date_created: "2019-12-03",
          files: [],
          first_name: "John",
          id: 1,
          last_name: "Doe",
          likers: [],
          likes: 0,
          tags: [],
          title: "My title",
          user_id: 1,
          visibility: "public"
        },
        {
          comments: [],
          content: "This is the post content",
          date_created: "2019-12-03",
          files: [],
          first_name: "John",
          id: 2,
          last_name: "Doe",
          likers: [],
          likes: 0,
          tags: [],
          title: "My title",
          user_id: 2,
          visibility: "public"
        }
      ],
      title: "Conference title"
    };

    this.handleHideConference = this.handleHideConference.bind(this);
    this.getHiddenInfo = this.getHiddenInfo.bind(this);
  }

  public componentDidMount() {
    // TODO
    // this.apiGetConference();
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
      .then(res => console.log(res))
      .catch(() => console.log("Failed to get conference"));
  }

  public handleHideConference() {
    /*let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
        !process.env.NODE_ENV || process.env.NODE_ENV === "development"
            ? `:${process.env.REACT_APP_API_PORT}`
            : "/api";
    postUrl += `/conference/${this.props.match.params.id}/change_privacy`;

    axios
      .post(postUrl, {
        id: this.props.match.params.id, // When loggin, this is the user logged in
        visibility: 'closed'
      })
      .then(res => {
        console.log("Conference hidden...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
    */
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
    if (
      this.state.isHidden &&
      !(this.userId == this.props.match.params.user_id)
    ) {
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
                {this.getHiddenInfo()}
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
            <div className="conf_side">
              <div className="p-3">{this.getDetails()}</div>
              <div className="p-3">{this.getAdminButtons()}</div>
            </div>
            <div className="conf_posts">
              <button className="join">Join conference</button>
              {this.getPosts()}
            </div>
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
        user_id={post.user_id}
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

  public getHiddenInfo() {
    if (this.state.isHidden) {
      return (
        <div id="hidden_info">
          <b>The conference was closed to all users!</b>
        </div>
      );
    }
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

  private getAdminButtons() {
    return (
      <div className="p-0 m-0">
        <h6>Administrator</h6>
        <button>
          <i className="fas fa-envelope" />
          Invite user
        </button>
        <button>
          <i className="fas fa-video" />
          Start livestream
        </button>
        <button>
          <i className="fas fa-puzzle-piece" />
          Create challenge
        </button>
        <button>
          <i className="fas fa-archive" />
          Archive conference
        </button>
        <button>
          <i className="fas fa-trash" />
          Delete conference
        </button>
      </div>
    );
  }
}

export default Conference;
