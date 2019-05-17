import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { number } from "prop-types";
import * as React from "react";
import { MouseEvent } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../components/Button/Button";

import CreateNewModal from "../components/CreateNewModal/CreateNewModal";
import { Request, Step } from "../components/CreateNewModal/types";
import Icon from "../components/Icon/Icon";
// - Import utils
import TalkCard from "../components/TalkCard/TalkCard";
import "../styles/Conference.css";
import axiosInstance from "../utils/axiosInstance";
import { dictionary, LanguageContext } from "../utils/language";
import withAuth from "../utils/withAuth";

type Props = {
  user: any;
  match: {
    params: {
      id: number;
    };
  };
};

interface IState {
  step: Step;
  talks: any[];
  title: string;
  description: string;
  place: string;
  dateStart: string;
  dateEnd: string;
  isHidden: boolean;
  privacy: string;
  postModalOpen: boolean;
  request: {
    type: "post" | "talk" | "conference";
    title: string;
    about: string;
    avatar?: File;
    privacy: string;
    tags: string[];
    files: {
      docs: File[];
      videos: File[];
      images: File[];
    };
    dateStart: string;
    dateEnd: string;
    livestream: string;
    local: string;
    switcher: string;
  };
  editFormOpen: boolean;
  editFields: {
    title: string;
    description: string;
    place: string;
    dateStart: string;
    dateEnd: string;
  };
}

class Conference extends React.Component<Props, IState> {
  public static contextType = LanguageContext;

  private id: number;
  private ownerId: number | undefined;
  private ownerName: string | undefined;
  private readonly conferenceDateOptions: object;
  private readonly talkDateOptions: object;

  constructor(props: Props) {
    super(props);

    this.conferenceDateOptions = {
      day: "2-digit",
      hour: "numeric",
      minutes: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric"
    };
    this.talkDateOptions = {
      day: "2-digit",
      month: "long",
      weekday: "long",
      year: "numeric"
    };

    this.id = this.props.match.params.id;

    this.state = {
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
      isHidden: false,
      place: "",
      postModalOpen: false,
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
        type: "talk"
      },
      step: "type",
      talks: [],
      title: ""
    };
  }

  public componentWillMount() {
    this.getConference();
  }

  public getConference() {
    axiosInstance
      .get(`/conference/${this.id}`)
      .then(res => {
        const conference = res.data.conference;
        const dateStart = new Date(conference.datestart).toLocaleDateString(
          dictionary.date_format[this.context],
          this.conferenceDateOptions
        );
        const dateEnd = new Date(conference.dateend).toLocaleDateString(
          dictionary.date_format[this.context],
          this.conferenceDateOptions
        );

        this.ownerId = conference.user_id;
        this.ownerName = `${conference.first_name} ${conference.last_name}`;

        this.setState({
          dateEnd,
          dateStart,
          description: conference.about,
          isHidden: conference.privacy === "closed",
          place: conference.local,
          privacy: conference.privacy,
          talks: res.data.talks,
          title: conference.title
        });
      })
      .catch(() => console.log("Failed to get conference info"));
  }

  public getTalks() {
    const buffer: any[] = [];
    let lastEnd = "";
    this.state.talks.forEach(talk => {
      const dateEnd = new Date(talk.dateend).toLocaleDateString(
        dictionary.date_format[this.context],
        this.talkDateOptions
      );

      if (lastEnd !== dateEnd) {
        buffer.push(
          <h6>{`${dictionary.day_split[this.context]} ${dateEnd}`}</h6>
        );
      }
      lastEnd = dateEnd;
      buffer.push(
        <TalkCard
          id={talk.id}
          title={talk.title}
          local={talk.local}
          dateend={talk.datestart}
          datestart={talk.dateend}
          about={talk.about}
          avatar={talk.avatar}
        />
      );
    });

    console.log(buffer);
    return buffer;
  }

  public render() {
    if (this.state.isHidden && this.props.user.id === this.ownerId) {
      return (
        <div id="Conference" className="my-5">
          <div className="container my-5">
            <div>
              <h4>
                {dictionary.title[this.context]}: {this.state.title}
              </h4>
            </div>
            <div>
              <h5>Test Conference</h5>
            </div>
          </div>

          <div className="container my-5">
            <div className="conf_side" />
          </div>
        </div>
      );
    } else {
      return (
        <div id="Conference" className="my-5">
          <div className="container my-5">
            {this.ownerId === this.props.user.id ? (
              <div className={"float-right"}>{this.editForm()}</div>
            ) : null}
            <h4>{this.state.title}</h4>
            <h5>{this.state.description}</h5>
          </div>
          <div className="container my-5">
            <div className="conf_posts">
              <div className="p-3">{this.getTalks()}</div>
              <button className="create" onClick={this.createConfPost}>
                {dictionary.create_new_talk[this.context]}
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
                  step={"talkConf"}
                />
              ) : null}
            </div>
          </div>
        </div>
      );
    }
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

    if (request.type === "talk") {
      url += "/talk";

      console.log(request);

      axiosInstance
        .post(url, {
          about: request.about,
          author: this.props.user.id,
          avatar: request.avatar,
          conference: this.id,
          dateEnd: request.dateEnd,
          dateStart: request.dateStart,
          livestream: request.livestream,
          local: request.local,
          privacy: request.privacy,
          title: request.title
        })
        .then(res => {
          console.log(`talk with id = ${res.data.id} created`);
          window.location.href = "/talk/" + res.data.id;
          this.resetState();
        })
        .catch(error => console.log("Failed to create talk. " + error));
    }
  };

  private editForm = () => {
    const editFields = this.state.editFields;
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
          ...editFields,
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
            <Modal.Title>
              {dictionary.edit_conference[this.context]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Edit fields here!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHide} theme={"danger"}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
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
        type: "talk"
      },
      step: "type"
    });
  };
}

export default withAuth(Conference);
