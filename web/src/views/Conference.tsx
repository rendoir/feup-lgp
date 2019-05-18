import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { PureComponent } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { Avatar, Button, Icon, InputNext, Select } from "../components";

import styles from "../components/CreateNewModal/CreateNewModal.module.css";
import Switcher from "../components/Switcher/Switcher";
// - Import utils
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

type State = {
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
    title: string;
    about: string;
    privacy: string;
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
};

class Conference extends PureComponent<Props, State> {
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
      minute: "numeric",
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
        dateEnd: "",
        dateStart: "",
        livestream: "",
        local: "",
        privacy: "public",
        switcher: "false",
        title: ""
      },
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
        this.ownerId = conference.user_id;
        this.ownerName = `${conference.first_name} ${conference.last_name}`;

        this.setState({
          dateEnd: conference.dateend,
          dateStart: conference.datestart,
          description: conference.about,
          editFields: {
            dateEnd: conference.dateend,
            dateStart: conference.datestart,
            description: conference.about,
            place: conference.local,
            title: conference.title
          },
          isHidden: conference.privacy === "closed",
          place: conference.local,
          privacy: conference.privacy,
          talks: res.data.talks,
          title: conference.title
        });
      })
      .catch(() => console.log("Failed to get conference info"));
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
              <h5>{this.state.description}</h5>
            </div>
          </div>

          <div className="container my-5">
            <div className="conf_side" />
          </div>
        </div>
      );
    } else {
      return (
        <div id="Conference" className="container-fluid w-75 my-5">
          <div className={"d-flex flex-row flex-wrap"}>
            <div className={"col-lg-4 mb-3"}>{this.renderConferenceCard()}</div>
            <div className={"col-lg-8"}>{this.renderTalks()}</div>
          </div>
        </div>
      );
    }
  }

  private renderConferenceCard = () => {
    const dateStart = new Date(this.state.dateStart).toLocaleDateString(
      dictionary.date_format[this.context],
      this.conferenceDateOptions
    );
    const dateEnd = new Date(this.state.dateEnd).toLocaleDateString(
      dictionary.date_format[this.context],
      this.conferenceDateOptions
    );

    return (
      <Card border={"light"}>
        <Card.Header>
          <div
            className={"d-flex justify-content-between align-items-center mb-1"}
          >
            <div className={"d-flex align-items-center"}>
              <Avatar image={""} title={this.state.title} /> &nbsp;
              <strong>{this.state.title}</strong>
            </div>
            {this.renderEditForm()}
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>{this.state.description}</Card.Text>
          <hr />
          <div>
            <strong>{dictionary.conference_local[this.context]}</strong>
            <br />
            {this.state.place}
            <br />
            <br />
            <strong>{dictionary.date_start[this.context]}</strong>
            <br />
            {dateStart}
            <br />
            <br />
            <strong>{dictionary.date_end[this.context]}</strong>
            <br />
            {dateEnd}
          </div>
        </Card.Body>
      </Card>
    );
  };

  private renderTalks = () => {
    this.state.talks.sort((a, b) => (a.dateend > b.dateend ? a : b));

    return (
      <div>
        <div
          className={
            "col-lg-12 d-flex justify-content-between align-items-center"
          }
        >
          <h2>{dictionary.talks[this.context]}</h2>
          {this.renderTalkForm()}
        </div>
        <hr />
        <div>
          {this.state.talks.map(talk => {
            const dateEnd = new Date(talk.dateend).toLocaleDateString(
              dictionary.date_format[this.context],
              this.conferenceDateOptions
            );

            return (
              <a
                key={talk.id}
                href={`/talk/${talk.id}`}
                style={{ textDecoration: "none" }}
                className={"text-dark"}
              >
                <Card className={"mb-2"}>
                  <Card.Header
                    className={
                      "d-flex justify-content-between align-items-center flex-wrap"
                    }
                  >
                    <div>
                      <Card.Title
                        className={"d-flex align-items-center mb-1 mt-1"}
                      >
                        <Avatar
                          image={talk.avatar}
                          title={talk.title}
                          className={"mr-1"}
                        />
                        {talk.title}
                      </Card.Title>
                    </div>
                    <div className={"mb-1 mt-1"}>
                      {dictionary.day_split[this.context]} {dateEnd}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      {talk.about.substring(0, 100)}
                      {talk.about.length > 100 ? "..." : null}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  private renderTalkForm = () => {
    const handleShow = event => {
      event.preventDefault();
      this.setState({ postModalOpen: true });
    };
    const handleHide = () => this.resetState();
    const handleChange = (name, value) =>
      this.setState({
        request: {
          ...this.state.request,
          [name]: value
        }
      });
    const options = [
      {
        title: dictionary.visibility_public[this.context],
        value: "public"
      },
      {
        title: dictionary.visibility_followers[this.context],
        value: "followers"
      },
      {
        title: dictionary.visibility_private[this.context],
        value: "private"
      }
    ];

    return (
      <>
        <a href={"#"} onClick={handleShow} style={{ marginBottom: "0.5rem" }}>
          <Icon icon={faPlus} size={"2x"} />
        </a>

        <Modal show={this.state.postModalOpen} onHide={handleHide}>
          <Modal.Header closeButton={true}>
            <Modal.Title>
              {dictionary.create_new_talk[this.context]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={"d-flex flex-column"}>
            <InputNext
              onChange={(value, event) =>
                handleChange(event.target.name, value)
              }
              id={`talk_title_field`}
              name={"title"}
              label={dictionary.title[this.context]}
              placeholder={dictionary.insert_title[this.context]}
              value={this.state.request.title}
              required={true}
            />
            <InputNext
              onChange={(value, event) =>
                handleChange(event.target.name, value)
              }
              id={`talk_description_field`}
              name={"about"}
              label={dictionary.description[this.context]}
              placeholder={dictionary.description_placeholder[this.context]}
              value={this.state.request.about}
              required={true}
              type={"textarea"}
              rows={5}
              maxLength={3000}
            />
            <InputNext
              onChange={(value, event) =>
                handleChange(event.target.name, value)
              }
              id={`talk_local_field`}
              name={"local"}
              label={dictionary.location[this.context]}
              placeholder={dictionary.talk_local[this.context]}
              value={this.state.request.local}
            />
            <div className={styles.Wrapper}>
              <Select
                id={"talk_privacy_field"}
                name={"privacy"}
                value={this.state.request.privacy}
                label={dictionary.visibility[this.context]}
                options={options}
                onChange={(value, event) =>
                  handleChange(event.target.name, value)
                }
              />
            </div>
            <div id={`talk_dates_field`}>
              <label htmlFor={`talk_dates_field`} className={styles.dates}>
                {dictionary.dates[this.context]}
              </label>
              <InputNext
                onChange={(value, event) =>
                  handleChange(event.target.name, value)
                }
                id={`talk_date_start_field`}
                name={"dateStart"}
                label={dictionary.date_start[this.context]}
                value={this.state.request.dateStart}
                type={"datetime-local"}
              />
              <InputNext
                onChange={(value, event) =>
                  handleChange(event.target.name, value)
                }
                id={`talk_date_end_field`}
                name={"dateEnd"}
                label={dictionary.date_end[this.context]}
                value={this.state.request.dateEnd}
                type={"datetime-local"}
              />
            </div>
            <div id={`talk_livestream_field`}>
              <label htmlFor={`talk_livestream_field`} className={styles.dates}>
                {dictionary.livestream[this.context]}
              </label>
              <Switcher
                id={`talk_switcher`}
                name={"switcher"}
                label={dictionary.livestream[this.context]}
                onChange={(value, event) =>
                  handleChange(event.target.name, String(value))
                }
                value={this.state.request.switcher === "true"}
                className={styles.switcher}
              />
              <InputNext
                onChange={(value, event) =>
                  handleChange(event.target.name, value)
                }
                id={`talk_livestream_url_field`}
                value={this.state.request.livestream}
                name={"livestream"}
                label={dictionary.livestream_url[this.context]}
                type={"url"}
                placeholder={"https://www.youtube.com/embed/<id>"}
                disabled={!(this.state.request.switcher === "true")}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleTalkSubmission} theme={"success"}>
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

  private handleTalkSubmission = () => {
    const request = this.state.request;

    let url = `${location.protocol}//${location.hostname}`;
    url +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    url += "/talk";

    axiosInstance
      .post(url, {
        about: request.about,
        author: this.props.user.id,
        conference: this.id,
        dateEnd: request.dateEnd,
        dateStart: request.dateStart,
        livestream: request.livestream,
        local: request.local,
        privacy: request.privacy,
        title: request.title
      })
      .then(res => {
        window.location.href = "/talk/" + res.data.id;
        this.resetState();
      })
      .catch(error => console.log("Failed to create talk. " + error));
  };

  private renderEditForm = () => {
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
    const handleChange = (value, event) =>
      this.setState({
        editFields: {
          ...editFields,
          [event.target.name]: value
        }
      });

    return (
      <>
        <a href={"#"} onClick={handleShow}>
          <Icon icon={faEdit} size={"lg"} />
        </a>

        <Modal show={this.state.editFormOpen} onHide={handleHide}>
          <Modal.Header closeButton={true}>
            <Modal.Title>
              {dictionary.edit_conference[this.context]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputNext
              onChange={handleChange}
              id={"conference_edit_title_field"}
              name={"title"}
              value={editFields.title}
              label={dictionary.title[this.context]}
              placeholder={dictionary.insert_title[this.context]}
            />
            <InputNext
              onChange={handleChange}
              id={"conference_edit_description_field"}
              name={"description"}
              value={editFields.description}
              label={dictionary.description[this.context]}
              placeholder={dictionary.description_placeholder[this.context]}
              type={"textarea"}
              rows={5}
              maxLength={3000}
            />
            <InputNext
              onChange={handleChange}
              id={"conference_edit_place_field"}
              name={"place"}
              value={editFields.place}
              label={dictionary.location[this.context]}
              placeholder={dictionary.conference_local[this.context]}
            />
            <InputNext
              onChange={handleChange}
              id={"conference_edit_date_start_field"}
              name={"dateStart"}
              value={editFields.dateStart}
              label={dictionary.date_start[this.context]}
              type={"datetime-local"}
            />
            <InputNext
              onChange={handleChange}
              id={"conference_edit_date_end_field"}
              name={"dateEnd"}
              value={editFields.dateEnd}
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
      .put(`/conference/${this.id}`, {
        about: editFields.description,
        dateEnd: editFields.dateEnd,
        dateStart: editFields.dateStart,
        local: editFields.place,
        title: editFields.title
      })
      .then(() => {
        this.setState({
          ...this.state,
          ...editFields,
          editFormOpen: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  private resetState = () => {
    this.setState({
      postModalOpen: false,
      request: {
        about: "",
        dateEnd: "",
        dateStart: "",
        livestream: "",
        local: "",
        privacy: "public",
        switcher: "false",
        title: ""
      }
    });
  };
}

export default withAuth(Conference);
