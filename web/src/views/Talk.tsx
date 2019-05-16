import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { MouseEvent } from "react";
import * as React from "react";
import Modal from "react-bootstrap/Modal";
import { Avatar, Button, Icon, InputNext } from "../components";

import Chat from "../components/Chat/Chat";
import InfiniteScroll from "../components/InfiniteScroll/InfiniteScroll";
import Livestream from "../components/Livestream/Livestream";
import InviteModal from "../components/PostModal/InviteModal";

import styles from "../components/Post/Post.module.css";
import "../styles/Talk.css";

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
import axiosInstance from "../utils/axiosInstance";
import { dictionary, LanguageContext } from "../utils/language";
import withAuth from "../utils/withAuth";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
  user: any;
}

interface IState {
  editFormOpen: boolean;
  editFields: {
    title: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    place: string;
  };
  archived: boolean;
  step: Step;
  hasLiveStream: boolean;
  livestreamUrl: string;
  posts: any[];
  title: string;
  description: string;
  place: string;
  dateStart: string;
  dateEnd: string;
  userCanJoin: boolean;
  userParticipation: boolean;
  waitingUserJoinLeave: boolean;
  isHidden: boolean;
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
  public ownerId: number | undefined;
  public ownerName: string | undefined;
  public tags: string[];

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;
    this.tags = [];
    this.state = {
      archived: false,
      dateEnd: "",
      dateStart: "",
      description: "",
      editFields: {
        dateEnd: "",
        dateStart: "",
        description: "",
        place: "",
        title: ""
      },
      editFormOpen: false,
      hasLiveStream: true,
      isHidden: false,
      livestreamUrl: "https://www.youtube.com/embed/UVxU2HzPGug",
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
        const postsComing = res.data;

        if (talk.privacy === "closed") {
          this.setState({
            isHidden: true
          });
        }

        this.ownerId = talk.user_id;
        this.ownerName = `${talk.first_name} ${talk.last_name}`;

        this.setState({
          archived: talk.archived,
          dateEnd: talk.dateend,
          dateStart: talk.datestart,
          description: talk.about,
          editFields: {
            dateEnd: talk.dateend,
            dateStart: talk.datestart,
            description: talk.about,
            place: talk.local,
            title: talk.title
          },
          livestreamUrl: talk.livestream_url,
          place: talk.local,
          posts: postsComing.posts,
          privacy: talk.privacy,
          title: talk.title
        });

        console.log(this.state.editFields);
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
      .then(() => {
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
    if (this.state.isHidden && this.props.user.id === this.ownerId) {
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
              <div className="p-3">{this.getAdminButtons()}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="Talk" className="my-5">
          <div className="container my-5">
            {this.ownerId === this.props.user.id ? (
              <div className={"float-right"}>{this.editForm()}</div>
            ) : null}
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
              {this.ownerId === this.props.user.id ? (
                <div className="p-3">{this.getAdminButtons()}</div>
              ) : null}
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
    return [reportButton, deleteButton, archiveButton];
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
        .then(() => {
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
    if (!this.state.archived) {
      this.apiSetArchived();
    } else {
      this.apiSetUnarchived();
    }
  }

  private getDetails() {
    const dateOptions = {
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric"
    };
    const dateStart = new Date(this.state.dateStart).toLocaleDateString(
      dictionary.date_format[this.context],
      dateOptions
    );
    const dateEnd = new Date(this.state.dateEnd).toLocaleDateString(
      dictionary.date_format[this.context],
      dateOptions
    );

    return (
      <ul className="p-0 m-0">
        <Avatar
          title={this.ownerName}
          placeholder="empty"
          size={30}
          image="https://picsum.photos/200/200?image=52"
        />
        <a className={styles.post_author} href={"/user/" + this.ownerId}>
          {" "}
          {this.ownerName}
        </a>
        <Icon icon={this.getVisibilityIcon(this.state.privacy)} size="lg" />
        <li>
          <i className="fas fa-map-marker-alt" /> {this.state.place}
        </li>
        <li>
          <i className="fas fa-hourglass-start" /> {dateStart}
        </li>
        <li>
          <i className="fas fa-hourglass-end" /> {dateEnd}
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

  private editForm = () => {
    const handleHide = () =>
      this.setState({
        editFields: {
          dateEnd: this.state.dateEnd,
          dateStart: this.state.dateStart,
          description: this.state.description,
          place: this.state.place,
          title: this.state.title
        },
        editFormOpen: false
      });
    const handleShow = event => {
      event.preventDefault();
      this.setState({ editFormOpen: true });
    };
    const handleChange = (name, value) =>
      this.setState({
        editFields: {
          ...this.state.editFields,
          [name]: value
        }
      });

    return (
      <>
        <a href={"#"} onClick={handleShow}>
          <Icon icon={faEdit} size={"2x"} />
        </a>

        <Modal show={this.state.editFormOpen} onHide={handleHide}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{dictionary.edit_talk[this.context]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={"title"}
              value={this.state.editFields.title}
              label={dictionary.title[this.context]}
            />
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={"description"}
              value={this.state.editFields.description}
              label={dictionary.description[this.context]}
              type={"textarea"}
              rows={5}
              maxLength={3000}
            />
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={"place"}
              value={this.state.editFields.place}
              label={dictionary.talk_local[this.context]}
            />
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={"dateStart"}
              value={this.state.editFields.dateStart}
              label={dictionary.date_start[this.context]}
              type={"datetime-local"}
            />
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={"dateEnd"}
              value={this.state.editFields.dateEnd}
              label={dictionary.date_end[this.context]}
              type={"datetime-local"}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleEditSubmission} theme={"success"}>
              Save
            </Button>
            <Button onClick={handleHide} theme={"danger"}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleEditSubmission = () => {
    const editFields = this.state.editFields;
    axiosInstance
      .put(`/talk/${this.id}`, {
        about: editFields.description,
        dateEnd: editFields.dateEnd,
        dateStart: editFields.dateStart,
        local: editFields.place,
        title: editFields.title
      })
      .then(() => {
        this.setState({
          ...editFields,
          editFormOpen: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default withAuth(Talk);
