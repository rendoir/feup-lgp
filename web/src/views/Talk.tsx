import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { MouseEvent } from "react";
import * as React from "react";
import Avatar from "../components/Avatar/Avatar";
import Chat from "../components/Chat/Chat";
import Icon from "../components/Icon/Icon";
import InfiniteScroll from "../components/InfiniteScroll/InfiniteScroll";
import Livestream from "../components/Livestream/Livestream";
import Post from "../components/Post/Post";
import InviteModal from "../components/PostModal/InviteModal";

import styles from "../components/Post/Post.module.css";
import "../styles/Talk.css";
import { getApiURL } from "../utils/apiURL";

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
  apiCheckUserCanJoinTalk,
  apiCheckUserTalkParticipation,
  apiUserJoinTalk,
  apiUserLeaveTalk
} from "../utils/apiTalk";
import AuthHelperMethods from "../utils/AuthHelperMethods";
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
  archived: boolean;
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
    type: "post" | "talk" | "conference";
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

class Talk extends React.Component<IProps, IState> {
  public static contextType = LanguageContext;

  public id: number;
  public userId: number;
  public tags: string[];
  private auth = new AuthHelperMethods();

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;
    this.userId = 1; // cookies.get("user_id"); - change when login fetches user id properly
    this.tags = [];
    this.state = {
      archived: false,
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

    this.handleHideTalk = this.handleHideTalk.bind(this);
    this.getHiddenInfo = this.getHiddenInfo.bind(this);
    this.handleJoinTalk = this.handleJoinTalk.bind(this);
    this.handleLeaveTalk = this.handleLeaveTalk.bind(this);
  }

  public componentDidMount() {
    this.apiGetTalk();
    this.getPossibleTags();
    this.apiGetUserCanJoin();
    this.apiGetUserParticipation();
  }

  public async handleJoinTalk() {
    if (this.state.waitingUserJoinLeave) {
      return;
    }

    this.setState({
      userParticipation: true,
      waitingUserJoinLeave: true
    });

    const joinSuccess = await apiUserJoinTalk(this.id);
    this.setState({
      userParticipation: joinSuccess,
      waitingUserJoinLeave: false
    });
  }

  public async handleLeaveTalk() {
    if (this.state.waitingUserJoinLeave) {
      return;
    }

    this.setState({
      userParticipation: false,
      waitingUserJoinLeave: true
    });

    const leaveSuccess = await apiUserLeaveTalk(this.id);
    this.setState({
      userParticipation: !leaveSuccess,
      waitingUserJoinLeave: false
    });
  }

  public apiGetTalk() {
    axiosInstance
      .get(`/talk/${this.id}`)
      .then(res => {
        const talk = res.data.talk;
        let datestart = talk.datestart.split("T");
        datestart = datestart[0] + " " + datestart[1];
        let dateend = talk.dateend.split("T");
        dateend = dateend[0] + " " + dateend[1];

        const postsComing = res.data;

        if (talk.privacy === "closed") {
          this.setState({
            isHidden: true
          });
        }

        this.setState({
          archived: talk.archived,
          date_end: dateend,
          date_start: datestart,
          description: talk.about,
          livestreamUrl: talk.livestream_url,
          owner_id: talk.user_id,
          owner_name: talk.first_name + talk.last_name,
          place: talk.local,
          posts: postsComing.posts,
          privacy: talk.privacy,
          title: talk.title
        });
      })
      .catch(() => console.log("Failed to get talk info"));
  }

  public handleHideTalk() {
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

    const postUrl = `/talk/${this.props.match.params.id}/change_privacy`;

    axiosInstance
      .post(postUrl, {
        id: this.props.match.params.id,
        privacy: privacyState
      })
      .then(res => {
        console.log("Talk hidden...");
      })
      .catch(() => console.log("Failed to update privacy"));
  }

  public apiSetArchived() {
    axiosInstance
      .post(`/talk/${this.id}/archive`)
      .then()
      .catch(() => console.log("Failed to archive talk"));

    this.setState({
      archived: true
    });
  }

  public apiSetUnarchived() {
    axiosInstance
      .delete(`/talk/${this.id}/archive`)
      .then()
      .catch(() => console.log("Failed to unarchive talk"));

    this.setState({
      archived: false
    });
  }

  public async apiGetUserCanJoin() {
    const canJoin: boolean = await apiCheckUserCanJoinTalk(this.id);
    this.setState({ userCanJoin: canJoin });
  }

  public async apiGetUserParticipation() {
    const participant: boolean = await apiCheckUserTalkParticipation(this.id);
    this.setState({ userParticipation: participant });
  }

  public render() {
    const isArchived = this.state.archived;
    if (this.state.isHidden && this.userId === this.state.owner_id) {
      return (
        <div id="Talk" className="my-5">
          <div className="container my-5">
            <h4>
              {dictionary.title[this.context]}: {this.state.title}
            </h4>
            <h5>{dictionary.closed_talk[this.context]}</h5>
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
        <div id="Talk" className="my-5">
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
              <button
                className="create"
                onClick={this.createConfPost}
                disabled={isArchived}
              >
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
              <InfiniteScroll requestUrl={`/talk/${this.id}`} />
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
          <b>{dictionary.closed_talk[this.context]}</b>
        </div>
      );
    }
  }

  public getDropdownButtons() {
    const hideBtnText = this.state.isHidden
      ? dictionary.reopen_talk[this.context]
      : dictionary.hide_talk[this.context];

    const reportButton = (
      <button
        key={0}
        className={`dropdown-item ${styles.report_content}`}
        type="button"
        data-toggle="modal"
        // data-target={`#report_post_modal_${this.props.id}`}
        // onClick={this.handleTalkReport}
        // disabled={this.state.userReport}
      >
        {dictionary.report_talk[this.context]}
      </button>
    );
    const deleteButton = (
      <button
        key={1}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        onClick={this.handleHideTalk}
        // data-target={`#delete_talk_modal${this.props.id}`}
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
        // data-target={`#archive_talk_modal${this.props.id}`}
      >
        {dictionary.archive_talk[this.context]}
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

      formData.append("text", request.about);
      formData.append("title", request.title);
      formData.append("visibility", request.privacy);
      formData.append("talk", this.id + "");

      axiosInstance
        .post("/post", formData, {
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

  private archiveTalk() {
    if (this.state.archived === false) {
      this.apiSetArchived();
    } else {
      this.apiSetUnarchived();
    }
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
    const isArchived = this.state.archived;
    const hideBtnText = this.state.isHidden
      ? dictionary.reopen_talk[this.context]
      : dictionary.hide_talk[this.context];
    const isArchivedBtn = this.state.archived
      ? dictionary.unarchive_talk[this.context]
      : dictionary.archive_talk[this.context];
    return (
      <div id="conf-admin-buttons" className="p-0 m-0">
        <h6>{dictionary.administrator[this.context]}</h6>
        <button
          disabled={isArchived}
          data-toggle="modal"
          data-target={`#invite_talk_modal_${this.id}`}
        >
          <i className="fas fa-envelope" />
          {dictionary.invite_users[this.context]}
        </button>
        {/* Invite Users */}
        <InviteModal talkId={this.id} />

        <button disabled={isArchived}>
          <i className="fas fa-puzzle-piece" />
          {dictionary.create_challenge_talk[this.context]}
        </button>
        <button
          type="button"
          onClick={() => {
            this.archiveTalk();
          }}
        >
          <i className="fas fa-archive" />
          {isArchivedBtn}
        </button>
        <button onClick={this.handleHideTalk} disabled={isArchived}>
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
      ? dictionary.leave_talk[this.context]
      : dictionary.join_talk[this.context];

    if (!this.state.userCanJoin) {
      buttonClass = "cannot_join";
      buttonText = dictionary.no_access_talk[this.context];
    }
    // TODO: METER EFEITOS AO CARREGAR
    return (
      <button
        className={`join_button ${buttonClass}`}
        onClick={
          this.state.userParticipation
            ? this.handleLeaveTalk
            : this.handleJoinTalk
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

export default Talk;
