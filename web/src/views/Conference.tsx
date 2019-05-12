import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { MouseEvent } from "react";
import * as React from "react";
import Avatar from "../components/Avatar/Avatar";
import Chat from "../components/Chat/Chat";
import Icon from "../components/Icon/Icon";
import Livestream from "../components/Livestream/Livestream";
import Post from "../components/Post/Post";
import InviteModal from "../components/PostModal/InviteModal";

import styles from "../components/Post/Post.module.css";
import "../styles/Conference.css";

import {
  faGlobeAfrica,
  faLock,
  faQuestion,
  faUserFriends,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import CreateNewModal from "../components/CreateNewModal/CreateNewModal";
import { Request, Step } from "../components/CreateNewModal/types";

// - Import utils
import {
  apiCheckUserCanJoinConference,
  apiCheckUserConferenceParticipation,
  apiUserJoinConference,
  apiUserLeaveConference
} from "../utils/apiConference";
import axiosInstance from "../utils/axiosInstance";
import { dictionary, LanguageContext } from "../utils/language";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

interface IState {
  hasChat: boolean;
  step: Step;
  hasLiveStream: boolean;
  livestreamUrl: string;
  posts: any[];
  title: string;
  description: string;
  place: string;
  date_start: string;
  date_end: string;
  userCanJoin: boolean;
  userParticipation: boolean;
  waitingUserJoinLeave: boolean;
  isHidden: boolean;
  owner_id: number;
  owner_name: string;
  privacy: string;
  postModalOpen: boolean;
  request: {
    type: "post" | "conference";
    title: string;
    about: string;
    avatar?: File;
    privacy: string;
    files: {
      docs: File[];
      videos: File[];
      images: File[];
    };
    tags: string[];
    dateStart: string;
    dateEnd: string;
    local: string;
    livestream: string;
    switcher: string;
  };
}

class Conference extends React.Component<IProps, IState> {
  public static contextType = LanguageContext;

  public id: number;
  public userId: number;
  public tags: string[];

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;
    this.userId = 1; // cookies.get("user_id"); - change when login fetches user id properly
    this.tags = [];
    this.state = {
      date_end: "",
      date_start: "",
      description: "",
      hasChat: true,
      hasLiveStream: true,
      isHidden: false,
      livestreamUrl: "https://www.youtube.com/embed/UVxU2HzPGug",
      owner_id: 1,
      owner_name: "",
      place: "",
      postModalOpen: false,
      // posts: []
      posts: [],
      privacy: "",
      request: {
        about: "",
        avatar: undefined,
        dateEnd: "",
        dateStart: "",
        files: {
          docs: [],
          images: [],
          videos: []
        },
        livestream: "",
        local: "",
        privacy: "public",
        switcher: "false",
        tags: [],
        title: "",
        type: "post"
      },
      step: "type",
      title: "",
      userCanJoin: false,
      userParticipation: false,
      waitingUserJoinLeave: false
    };

    this.handleHideConference = this.handleHideConference.bind(this);
    this.getHiddenInfo = this.getHiddenInfo.bind(this);
    this.handleJoinConference = this.handleJoinConference.bind(this);
    this.handleLeaveConference = this.handleLeaveConference.bind(this);
  }

  public componentDidMount() {
    this.apiGetConference();
    this.getPossibleTags();
    this.apiGetUserCanJoin();
    this.apiGetUserParticipation();
  }

  public async handleJoinConference() {
    if (this.state.waitingUserJoinLeave) {
      return;
    }

    this.setState({
      userParticipation: true,
      waitingUserJoinLeave: true
    });

    const joinSuccess = await apiUserJoinConference(this.id);
    this.setState({
      userParticipation: joinSuccess,
      waitingUserJoinLeave: false
    });
  }

  public async handleLeaveConference() {
    if (this.state.waitingUserJoinLeave) {
      return;
    }

    this.setState({
      userParticipation: false,
      waitingUserJoinLeave: true
    });

    const leaveSuccess = await apiUserLeaveConference(this.id);
    this.setState({
      userParticipation: !leaveSuccess,
      waitingUserJoinLeave: false
    });
  }

  public apiGetConference() {
    axiosInstance
      .get(`/conference/${this.id}`)
      .then(res => {
        const conference = res.data.conference;
        let datestart = conference.datestart.split("T");
        datestart = datestart[0] + " " + datestart[1];
        let dateend = conference.dateend.split("T");
        dateend = dateend[0] + " " + dateend[1];

        const postsComing = res.data;

        postsComing.posts.map(
          (post: any, idx: any) => (
            (post.comments = postsComing.comments[idx]),
            (post.tags = postsComing.tags[idx]),
            (post.files = postsComing.files[idx])
          )
        );

        if (conference.privacy === "closed") {
          this.setState({
            isHidden: true
          });
        }

        this.setState({
          date_end: dateend,
          date_start: datestart,
          description: conference.about,
          livestreamUrl: conference.livestream_url,
          owner_id: conference.user_id,
          owner_name: conference.first_name + conference.last_name,
          place: conference.local,
          posts: postsComing.posts,
          privacy: conference.local,
          title: conference.title
        });
      })
      .catch(() => console.log("Failed to get conference info"));
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

    const postUrl = `/conference/${this.props.match.params.id}/change_privacy`;

    axiosInstance
      .post(postUrl, {
        id: this.props.match.params.id,
        privacy: privacyState
      })
      .then(res => {
        console.log("Conference hidden...");
      })
      .catch(() => console.log("Failed to update privacy"));
  }

  public async apiGetUserCanJoin() {
    const canJoin: boolean = await apiCheckUserCanJoinConference(this.id);
    this.setState({ userCanJoin: canJoin });
  }

  public async apiGetUserParticipation() {
    const participant: boolean = await apiCheckUserConferenceParticipation(
      this.id
    );
    this.setState({ userParticipation: participant });
  }

  public render() {
    if (this.state.isHidden && this.userId === this.state.owner_id) {
      return (
        <div id="Conference" className="my-5">
          <div className="container my-5">
            <h4>
              {dictionary.title[this.context]}: {this.state.title}
            </h4>
            <h5>{dictionary.closed_conference[this.context]}</h5>
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
          {this.state.hasLiveStream &&
            this.state.userParticipation &&
            this.state.userCanJoin &&
            this.renderStream()}
          <div className="container my-5">
            <div className="conf_side">
              <div className="p-3">{this.getDetails()}</div>
              <div className="p-3">{this.getAdminButtons()}</div>
            </div>
            <div className="conf_posts">
              {this.getJoinButton()}
              <button className="create" onClick={this.createConfPost}>
                {dictionary.create_post[this.context]}
              </button>
              {this.state.postModalOpen ? (
                <CreateNewModal
                  pending={false}
                  onSubmit={this.handleSubmit}
                  onStepChange={step => this.setState({ step })}
                  maxGroupSize={5}
                  request={this.state.request}
                  onRequestChange={request => this.setState({ request })}
                  onClose={this.resetState}
                  autoFocus={false}
                  step={"postConf"}
                  tags={this.tags}
                />
              ) : null}
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
          <b>{dictionary.closed_conference[this.context]}</b>
        </div>
      );
    }
  }

  public getDropdownButtons() {
    const hideBtnText = this.state.isHidden
      ? dictionary.reopen_conference[this.context]
      : dictionary.hide_conference[this.context];

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
        {dictionary.report_conference[this.context]}
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
        {dictionary.archive_conference[this.context]}
      </button>
    );
    const dropdownButtons = [reportButton, deleteButton, archiveButton];
    return dropdownButtons;
  }

  private createConfPost = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ postModalOpen: true });
  };

  private handleSubmit = (request: Request) => {
    if (request.type === "post") {
      const formData = new FormData();
      request.files.images.forEach((file, idx) =>
        formData.append("images[" + idx + "]", file)
      );
      request.files.videos.forEach((file, idx) =>
        formData.append("videos[" + idx + "]", file)
      );
      request.files.docs.forEach((file, idx) =>
        formData.append("docs[" + idx + "]", file)
      );
      request.tags.forEach((tag, i) => formData.append("tags[" + i + "]", tag));

      formData.append("author", "1");
      formData.append("text", request.about);
      formData.append("title", request.title);
      formData.append("visibility", request.privacy);
      formData.append("conference", this.id + "");

      axiosInstance
        .post("/post/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log("Post created - reloading page...");
          window.location.reload();
          this.resetState();
        })
        .catch(() => console.log("Failed to create post"));
    }
  };

  private getPossibleTags = (): void => {
    axiosInstance
      .get("/tags")
      .then(res => {
        res.data.forEach(tag => {
          this.tags.push(tag.name);
        });
      })
      .catch(() => console.log("Failed to get tags"));
  };

  private resetState = () => {
    this.setState({
      postModalOpen: false,
      request: {
        about: "",
        avatar: undefined,
        dateEnd: "",
        dateStart: "",
        files: {
          docs: [],
          images: [],
          videos: []
        },
        livestream: "",
        local: "",
        privacy: "public",
        shortname: "",
        switcher: "false",
        tags: [],
        title: "",
        type: "post"
      },
      step: "type"
    });
  };
  private renderStream() {
    return (
      <div className="conf_head w-100">
        <div className="live_wrap">
          <div className="live_container">
            <Livestream src={this.state.livestreamUrl} />
          </div>
        </div>
        <div className="chat_wrap">
          <div className="chat_container">
            <Chat />
          </div>
        </div>
      </div>
    );
  }

  private getPosts() {
    if (!this.state.userParticipation || !this.state.userCanJoin) {
      return;
    }

    const postsDiv: any[] = [];

    for (const post of this.state.posts) {
      postsDiv.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          user_id={post.user_id}
          comments={post.comments || []}
          tags={post.tags}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
          files={post.files}
        />
      );
    }

    return postsDiv;
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
      ? dictionary.reopen_conference[this.context]
      : dictionary.hide_conference[this.context];

    return (
      <div id="conf-admin-buttons" className="p-0 m-0">
        <h6>{dictionary.administrator[this.context]}</h6>
        <button
          data-toggle="modal"
          data-target={`#invite_conference_modal_${this.id}`}
        >
          <i className="fas fa-envelope" />
          {dictionary.invite_users[this.context]}
        </button>
        {/* Invite Users */}
        <InviteModal conferenceId={this.id} />

        <button>
          <i className="fas fa-video" />
          {dictionary.start_livestream_conference[this.context]}
        </button>
        <button>
          <i className="fas fa-puzzle-piece" />
          {dictionary.create_challenge_conference[this.context]}
        </button>
        <button>
          <i className="fas fa-archive" />
          {dictionary.archive_conference[this.context]}
        </button>
        <button onClick={this.handleHideConference}>
          <i className="fas fa-trash" />
          {hideBtnText}
        </button>
        {this.getHiddenInfo()}
      </div>
    );
  }

  private getJoinButton() {
    let buttonClass = this.state.userParticipation ? "leave" : "join";
    let buttonText = this.state.userParticipation
      ? dictionary.leave_conference[this.context]
      : dictionary.join_conference[this.context];

    if (!this.state.userCanJoin) {
      buttonClass = "cannot_join";
      buttonText = dictionary.no_access_conference[this.context];
    }
    // TODO: METER EFEITOS AO CARREGAR
    return (
      <button
        className={`join_button ${buttonClass}`}
        onClick={
          this.state.userParticipation
            ? this.handleLeaveConference
            : this.handleJoinConference
        }
        disabled={!this.state.userCanJoin}
      >
        {buttonText}
      </button>
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
