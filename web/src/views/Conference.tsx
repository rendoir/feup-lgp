import axios from "axios";
import * as React from "react";

import Chat from "../components/Chat/Chat";
import Livestream from "../components/Livestream/Livestream";
import Post from "../components/Post/Post";

import Avatar from "../components/Avatar/Avatar";
import Icon from "../components/Icon/Icon";
import styles from "../components/Post/Post.module.css";
import "../styles/Conference.css";

import {
  faGlobeAfrica,
  faLock,
  faQuestion,
  faUserFriends,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";

interface IProps {
  match: {
    params: {
      id: number;
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
  owner_id: number;
  owner_name: string;
  privacy: string;
}

class Conference extends React.Component<IProps, IState> {
  public id: number;
  public userId: number;

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;
    this.userId = 1; // cookies.get("user_id"); - change when login fetches user id properly

    this.state = {
      date_end: "",
      date_start: "",
      description: "",
      hasChat: true,
      hasLiveStream: true,
      isHidden: false,
      owner_id: 1,
      owner_name: "",
      place: "",
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
      privacy: "",
      title: ""
    };

    this.handleHideConference = this.handleHideConference.bind(this);
    this.getHiddenInfo = this.getHiddenInfo.bind(this);
  }

  public componentDidMount() {
    this.apiGetConference();
  }

  public apiGetConference() {
    let conferenceURL = `${location.protocol}//${location.hostname}`;
    conferenceURL +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    conferenceURL += `/conference/${this.id}`;
    axios
      .get(conferenceURL, {})
      .then(res => {
        console.log(res);
        const conference = res.data.conference;
        let datestart = conference.datestart.split("T");
        datestart = datestart[0] + " " + datestart[1];
        let dateend = conference.dateend.split("T");
        dateend = dateend[0] + " " + dateend[1];

        if (conference.privacy === "closed") {
          this.setState({
            isHidden: true
          });
        }
        this.setState({
          date_end: dateend,
          date_start: datestart,
          description: conference.about,
          owner_id: conference.user_id,
          owner_name: conference.first_name + conference.last_name,
          place: conference.local,
          privacy: conference.local,
          title: conference.title
        });
      })
      .catch(() => console.log("Failed to get conference"));
  }

  public handleHideConference() {
    let privacyState = "closed";

    if (this.state.isHidden) {
      privacyState = "public";
      this.setState({
        isHidden: false
      });
    } else {
      privacyState = "closed";
      this.setState({
        isHidden: true
      });
    }

    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += `/conference/${this.props.match.params.id}/change_privacy`;

    axios
      .post(postUrl, {
        id: this.props.match.params.id,
        privacy: privacyState
      })
      .then(res => {
        console.log("Conference hidden...");
      })
      .catch(() => console.log("Failed to update privacy"));
  }

  public render() {
    if (this.state.isHidden && !(this.userId === this.state.owner_id)) {
      return (
        <div id="Conference" className="my-5">
          <div className="container my-5">
            <h4>Title: {this.state.title}</h4>
            <h5>This conference has been closed!</h5>
          </div>

          <div className="container my-5">
            <div className="conf_side">
              <div className="p-3">{this.getDetails()}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="Conference" className="my-5">
          <div className="container my-5">
            <h4>{this.state.title}</h4>
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
        // data-target={`#report_post_modal_${this.props.id}`}
        // onClick={this.handleConferenceReport}
        // disabled={this.state.userReport}
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
        // data-target={`#delete_conference_modal${this.props.id}`}
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
        // data-target={`#archive_conference_modal${this.props.id}`}
      >
        Archive Conference
      </button>
    );
    const dropdownButtons = [reportButton, deleteButton, archiveButton];
    return dropdownButtons;
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
        <Avatar
          title={this.state.owner_name}
          placeholder="empty"
          size={30}
          image="https://picsum.photos/200/200?image=52"
        />
        <a className={styles.post_author} href={"/user/" + this.state.owner_id}>
          {" "}
          {this.state.owner_name}
        </a>
        <Icon icon={this.getVisibilityIcon(this.state.privacy)} size="lg" />
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

  private getAdminButtons() {
    const hideBtnText = this.state.isHidden
      ? "Reopen Conference"
      : "Hide Conference";

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
        <button onClick={this.handleHideConference}>
          <i className="fas fa-trash" />
          {hideBtnText}
        </button>
        {this.getHiddenInfo()}
      </div>
    );
  }

  private getVisibilityIcon(v: string): IconDefinition {
    switch (v) {
      case "public":
        return faGlobeAfrica;
      case "followers":
        return faUserFriends;
      case "private":
        return faLock;
      default:
        return faQuestion;
    }
  }
}

export default Conference;
