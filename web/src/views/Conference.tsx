import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { MouseEvent } from "react";
import * as React from "react";

import Avatar from "../components/Avatar/Avatar";
import ChallengeCarousel from "../components/ChallengeCarousel/ChallengeCarousel";
import Chat from "../components/Chat/Chat";
import Icon from "../components/Icon/Icon";
import Livestream from "../components/Livestream/Livestream";
import Post from "../components/Post/Post";
import InviteModal from "../components/PostModal/InviteModal";

import styles from "../components/Post/Post.module.css";
import "../styles/Conference.css";
import { getApiURL } from "../utils/apiURL";

import {
  faGlobeAfrica,
  faLock,
  faQuestion,
  faUserFriends,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import CreateNewModal from "../components/CreateNewModal/CreateNewModal";
import CreateNewModalChallenge from "../components/CreateNewModalChallenges/CreateNewModalChallenge";

import { Request, Step } from "../components/CreateNewModal/types";
import {
  RequestChallenge,
  StepChallenge
} from "../components/CreateNewModalChallenges/types";

// - Import utils
import {
  apiCheckUserCanJoinConference,
  apiCheckUserConferenceParticipation,
  apiUserJoinConference,
  apiUserLeaveConference
} from "../utils/apiConference";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

interface IState {
  clickedChallenge: number | undefined;
  hasChat: boolean;
  step: Step;
  stepChallenge: StepChallenge;
  hasLiveStream: boolean;
  livestreamUrl: string;
  posts: any[];
  challenges: any[];
  title: string;
  description: string;
  place: string;
  date_start: string;
  date_end: string;
  userCanJoin: boolean;
  userParticipation: boolean;
  waitingUserJoinLeave: boolean;
  isHidden: boolean;
  isChallengeModalOpen: boolean;
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
  requestChallenge: {
    type: "post" | "options" | "question" | "comment";
    title: string;
    about: string;
    dateStart: string;
    dateEnd: string;
    post: string;
    question: string;
    correctAnswer: string;
    options: string[];
    prize: string;
    prizePoints: string;
  };
}

class Conference extends React.Component<IProps, IState> {
  public id: number;
  public userId: number;
  public tags: string[];

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;
    this.userId = 1; // cookies.get("user_id"); - change when login fetches user id properly
    this.tags = [];
    this.state = {
      challenges: [],
      clickedChallenge: undefined,
      date_end: "",
      date_start: "",
      description: "",
      hasChat: true,
      hasLiveStream: true,
      isChallengeModalOpen: false,
      isHidden: false,
      livestreamUrl: "https://www.youtube.com/embed/UVxU2HzPGug",
      owner_id: 1,
      owner_name: "",
      place: "",
      postModalOpen: false,
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
      requestChallenge: {
        about: "",
        correctAnswer: "",
        dateEnd: "",
        dateStart: "",
        options: [],
        post: "",
        prize: "",
        prizePoints: "",
        question: "",
        title: "",
        type: "question"
      },
      step: "type",
      stepChallenge: "type",
      title: "",
      userCanJoin: false,
      userParticipation: false,
      waitingUserJoinLeave: false
    };

    this.handleHideConference = this.handleHideConference.bind(this);
    this.getHiddenInfo = this.getHiddenInfo.bind(this);
    this.handleChallengeClick = this.handleChallengeClick.bind(this);
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
    const conferenceURL = getApiURL(`/conference/${this.id}`);
    axios
      .get(conferenceURL, {})
      .then(res => {
        const conference = res.data.conference;
        let datestart = conference.datestart.split("T");
        datestart = datestart[0] + " " + datestart[1];
        let dateend = conference.dateend.split("T");
        dateend = dateend[0] + " " + dateend[1];

        const challengesConf = res.data.challenges;

        const postsComing = res.data;

        postsComing.posts.map(
          (post: any, idx: any) => (
            (post.comments = postsComing.comments[idx]),
            (post.likers = postsComing.likers[idx]),
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
          challenges: challengesConf,
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
          {this.state.hasLiveStream &&
            this.state.userParticipation &&
            this.state.userCanJoin &&
            this.renderStream()}
          <div className="container my-5">
            <div className="conf_side">
              <div className="p-3">{this.getDetails()}</div>
              <div className="p-3">{this.getAdminButtons()}</div>
              <div className="p-3">{this.getChallenges()}</div>
            </div>
            <div className="conf_posts">
              {this.getJoinButton()}
              <button className="create" onClick={this.createConfPost}>
                Create Post
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

  private createConfPost = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ postModalOpen: true });
  };

  private handleSubmit = (request: Request) => {
    let url = `${location.protocol}//${location.hostname}`;
    url +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";

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

      url += "/post/create";
      axios
        .post(url, formData, {
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

  private handleSubmitChallenge = (request: RequestChallenge) => {
    let url = `${location.protocol}//${location.hostname}`;
    url +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";

    const formData = new FormData();

    formData.append("type", request.type);
    formData.append("title", request.title);
    formData.append("text", request.about);
    formData.append("dateEnd", request.dateEnd);
    formData.append("dateStart", request.dateStart);
    formData.append("prize", request.prize);
    formData.append("prizePoints", request.prizePoints);

    formData.append("question", request.question);

    let correctAns = "";

    if (request.type === "options") {
      correctAns = request.options[Number(request.correctAnswer)];
    } else {
      correctAns = request.correctAnswer;
    }

    formData.append("correctAnswer", correctAns);

    request.options.forEach((opt, i) =>
      formData.append("options[" + i + "]", opt)
    );

    formData.append("post", request.post);
    formData.append("conf_id", String(this.id));

    url += `/conference/${this.id}/challenge/create`;
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        console.log("Challenge created - reloading page...");
        window.location.reload();
        this.resetState();
      })
      .catch(() => console.log("Failed to create post"));
  };

  private getPossibleTags = (): void => {
    let url = `${location.protocol}//${location.hostname}`;
    url +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    url += `/tags`;

    axios
      .get(url)
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

  private resetStateChallenge = () => {
    this.setState({
      isChallengeModalOpen: false,
      requestChallenge: {
        about: "",
        correctAnswer: "",
        dateEnd: "",
        dateStart: "",
        options: [],
        post: "",
        prize: "",
        prizePoints: "",
        question: "",
        title: "",
        type: "question"
      },
      stepChallenge: "type"
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
          likes={post.likes}
          likers={post.likers}
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
      ? "Reopen Conference"
      : "Hide Conference";

    return (
      <div id="conf-admin-buttons" className="p-0 m-0">
        <h6>Administrator</h6>
        <button
          data-toggle="modal"
          data-target={`#invite_conference_modal_${this.id}`}
        >
          <i className="fas fa-envelope" />
          Invite users
        </button>
        {/* Invite Users */}
        <InviteModal conferenceId={this.id} />
        <button>
          <i className="fas fa-video" />
          Start livestream
        </button>
        <button type="button" onClick={this.handleCreateChallenge}>
          <i className="fas fa-puzzle-piece" />
          Create challenge
        </button>
        {/* Challenge Create Modal */}
        {this.state.isChallengeModalOpen ? (
          <CreateNewModalChallenge
            pending={false}
            onSubmit={this.handleSubmitChallenge}
            onStepChange={step => this.setState({ stepChallenge: step })}
            maxGroupSize={10}
            request={this.state.requestChallenge}
            onRequestChange={request =>
              this.setState({ requestChallenge: request })
            }
            onClose={this.resetStateChallenge}
            autoFocus={false}
            step={this.state.stepChallenge}
            posts={this.state.posts}
          />
        ) : null}
        <button>
          <i className="fas fa-pen" />
          Edit conference
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

  private handleCreateChallenge = (event: MouseEvent): void => {
    event.preventDefault();
    this.setState({ isChallengeModalOpen: true });
  };

  private getJoinButton() {
    let buttonClass = this.state.userParticipation ? "leave" : "join";
    let buttonText = this.state.userParticipation
      ? "Leave conference"
      : "Join conference";

    if (!this.state.userCanJoin) {
      buttonClass = "cannot_join";
      buttonText = "You don't have permission to access this conference";
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

  private handleChallengeClick(challenge: number | undefined) {
    if (challenge) {
      document.body.style.overflow = "hidden";
      this.setState({
        clickedChallenge: challenge
      } as IState);
    }
  }

  private getChallenges() {
    console.log(this.state.challenges);
    return (
      <div className="p-0 m-0">
        <h6>
          Challenges <i className="fas fa-puzzle-piece" />
        </h6>
        <ChallengeCarousel
          key={"challenges_" + this.id}
          id={this.id}
          challenges={this.state.challenges}
          parent={this}
          handleChallengeClick={this.handleChallengeClick}
        />
      </div>
    );
  }
}

export default Conference;
