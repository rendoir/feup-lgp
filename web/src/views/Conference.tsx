import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { PureComponent } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { Avatar, Button, Icon, InputNext, Select } from '../components';

import styles from '../components/CreateNewModal/CreateNewModal.module.css';
import Switcher from '../components/Switcher/Switcher';
// - Import utils
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

type Props = {
  user: any;
  match: {
    params: {
      id: number;
    };
  };
};

type State = {
  avatar?: string;
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
  errors: {
    title: boolean;
    description: boolean;
    place: boolean;
    dateStart: boolean;
    dateEnd: boolean;
  };
};

class Conference extends PureComponent<Props, State> {
  public static contextType = LanguageContext;

  private id: number;
  private ownerId: number | undefined;
  private ownerName: string | undefined;
  private readonly dateOptions: object;
  private readonly errorMessages: {
    title;
    description;
    local;
    dates;
  };

  constructor(props: Props) {
    super(props);

    this.dateOptions = {
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      month: 'long',
      weekday: 'long',
      year: 'numeric'
    };
    this.errorMessages = {
      dates: 'Dates must follow the format YYYY-MM-DDThh:mm',
      description:
        'Description must contain at least one alphanumerical character, ' +
        "! , ? , - , ',' , . , @ , # , % ",
      local:
        "Local must contain only 2 to 150 alphanumerical characters, ',' , . , -",
      title: 'title must contain only 2 to 150 alphanumerical characters'
    };

    this.id = this.props.match.params.id;

    this.state = {
      dateEnd: '',
      dateStart: '',
      description: '',
      editFields: {
        dateEnd: '',
        dateStart: '',
        description: '',
        place: '',
        title: ''
      },
      editFormOpen: false,
      errors: {
        dateEnd: false,
        dateStart: false,
        description: false,
        place: false,
        title: false
      },
      isHidden: false,
      place: '',
      postModalOpen: false,
      privacy: '',
      request: {
        about: '',
        dateEnd: '',
        dateStart: '',
        livestream: '',
        local: '',
        privacy: 'public',
        switcher: 'false',
        title: ''
      },
      talks: [],
      title: ''
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
            talks: res.data.talks,
            title: conference.title
          },
          isHidden: conference.privacy === 'closed',
          place: conference.local,
          privacy: conference.privacy,
          talks: res.data.talks,
          title: conference.title
        });
      })
      .catch(() => console.log('Failed to get conference info'));
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
        <div id="Conference" className="container-fluid w-100 my-5">
          <div className={'d-flex flex-row flex-wrap'}>
            <div className={'col-lg-4 mb-3'}>{this.renderConferenceCard()}</div>
            <div className={'col-lg-8'}>{this.renderTalks()}</div>
          </div>
        </div>
      );
    }
  }

  private renderConferenceCard = () => {
    const dateStart = new Date(this.state.dateStart).toLocaleDateString(
      dictionary.date_format[this.context],
      this.dateOptions
    );
    const dateEnd = new Date(this.state.dateEnd).toLocaleDateString(
      dictionary.date_format[this.context],
      this.dateOptions
    );

    return (
      <Card border={'light'}>
        <Card.Header>
          <div
            className={'d-flex justify-content-between align-items-center mb-1'}
          >
            <div className={'d-flex align-items-center'}>
              <Avatar image={''} title={this.state.title} /> &nbsp;
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
            'col-lg-12 d-flex justify-content-between align-items-center'
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
              this.dateOptions
            );

            return (
              <a
                key={talk.id}
                href={`/talk/${talk.id}`}
                style={{ textDecoration: 'none' }}
                className={'text-dark'}
              >
                <Card className={'mb-2'}>
                  <Card.Header
                    className={
                      'd-flex justify-content-between align-items-center flex-wrap'
                    }
                  >
                    <div>
                      <Card.Title
                        className={'d-flex align-items-center mb-1 mt-1'}
                      >
                        <Avatar
                          image={talk.avatar}
                          title={talk.title}
                          className={'mr-1'}
                        />
                        {talk.title}
                      </Card.Title>
                    </div>
                    <div className={'mb-1 mt-1'}>
                      {dictionary.day_split[this.context]} {dateEnd}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      {talk.about.substring(0, 100)}
                      {talk.about.length > 100 ? '...' : null}
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
    const handleChange = (value, event) => {
      this.setState({
        request: {
          ...this.state.request,
          [event.target.name]: value
        }
      });
      this.validateField(event.target.name, value);
    };
    const options = [
      {
        title: dictionary.visibility_public[this.context],
        value: 'public'
      },
      {
        title: dictionary.visibility_followers[this.context],
        value: 'followers'
      },
      {
        title: dictionary.visibility_private[this.context],
        value: 'private'
      }
    ];

    return (
      <>
        <a href={'#'} onClick={handleShow} style={{ marginBottom: '0.5rem' }}>
          <Icon icon={faPlus} size={'2x'} />
        </a>

        <Modal show={this.state.postModalOpen} onHide={handleHide}>
          <Modal.Header closeButton={true}>
            <Modal.Title>
              {dictionary.create_new_talk[this.context]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={'d-flex flex-column'}>
            <InputNext
              onChange={handleChange}
              id={`talk_title_field`}
              name={'title'}
              label={dictionary.title[this.context]}
              placeholder={dictionary.insert_title[this.context]}
              value={this.state.request.title}
              required={true}
              status={this.state.errors.title ? 'error' : 'normal'}
              hint={this.state.errors.title ? this.errorMessages.title : ''}
            />
            <InputNext
              onChange={handleChange}
              id={`talk_description_field`}
              name={'about'}
              label={dictionary.description[this.context]}
              placeholder={dictionary.description_placeholder[this.context]}
              value={this.state.request.about}
              required={true}
              type={'textarea'}
              rows={5}
              maxLength={3000}
              status={this.state.errors.description ? 'error' : 'normal'}
              hint={
                this.state.errors.description
                  ? this.errorMessages.description
                  : ''
              }
            />
            <InputNext
              onChange={handleChange}
              id={`talk_local_field`}
              name={'local'}
              label={dictionary.location[this.context]}
              placeholder={dictionary.talk_local[this.context]}
              value={this.state.request.local}
              status={this.state.errors.place ? 'error' : 'normal'}
              hint={this.state.errors.place ? this.errorMessages.local : ''}
            />
            <div className={styles.Wrapper}>
              <Select
                id={'talk_privacy_field'}
                name={'privacy'}
                value={this.state.request.privacy}
                label={dictionary.visibility[this.context]}
                options={options}
                onChange={handleChange}
              />
            </div>
            <div id={`talk_dates_field`}>
              <label htmlFor={`talk_dates_field`} className={styles.dates}>
                {dictionary.dates[this.context]}
              </label>
              <InputNext
                onChange={handleChange}
                id={`talk_date_start_field`}
                name={'dateStart'}
                label={dictionary.date_start[this.context]}
                value={this.state.request.dateStart}
                type={'datetime-local'}
                status={this.state.errors.dateStart ? 'error' : 'normal'}
                hint={
                  this.state.errors.dateStart ? this.errorMessages.dates : ''
                }
              />
              <InputNext
                onChange={handleChange}
                id={`talk_date_end_field`}
                name={'dateEnd'}
                label={dictionary.date_end[this.context]}
                value={this.state.request.dateEnd}
                type={'datetime-local'}
                status={this.state.errors.dateEnd ? 'error' : 'normal'}
                hint={this.state.errors.dateEnd ? this.errorMessages.dates : ''}
              />
            </div>
            <div id={`talk_livestream_field`}>
              <label htmlFor={`talk_livestream_field`} className={styles.dates}>
                {dictionary.livestream[this.context]}
              </label>
              <Switcher
                id={`talk_switcher`}
                name={'switcher'}
                label={dictionary.livestream[this.context]}
                onChange={(value, event) => handleChange(String(value), event)}
                value={this.state.request.switcher === 'true'}
                className={styles.switcher}
              />
              <InputNext
                onChange={handleChange}
                id={`talk_livestream_url_field`}
                value={this.state.request.livestream}
                name={'livestream'}
                label={dictionary.livestream_url[this.context]}
                type={'url'}
                placeholder={'https://www.youtube.com/embed/<id>'}
                disabled={!(this.state.request.switcher === 'true')}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleTalkSubmission} theme={'success'}>
              Save
            </Button>
            <Button onClick={handleHide} theme={'danger'}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleTalkSubmission = () => {
    const request = this.state.request;
    const errors = this.state.errors;

    if (Object.values(errors).includes(true)) {
      return;
    }

    axiosInstance
      .post('/talk', {
        about: request.about.trim(),
        author: this.props.user.id,
        conference: this.id,
        dateEnd: request.dateEnd.trim(),
        dateStart: request.dateStart.trim(),
        livestream: request.livestream.trim(),
        local: request.local.trim(),
        privacy: request.privacy.trim(),
        title: request.title.trim()
      })
      .then(res => {
        this.resetState();
        window.location.href = '/talk/' + res.data.id;
      })
      .catch(error => console.log(error));
  };

  private renderEditForm = () => {
    const editFields = this.state.editFields;
    const handleHide = () =>
      this.setState({
        editFields: {
          dateEnd: this.state.dateEnd.trim(),
          dateStart: this.state.dateStart.trim(),
          description: this.state.description.trim(),
          place: this.state.place.trim(),
          title: this.state.title.trim()
        },
        editFormOpen: false
      });
    const handleShow = event => {
      event.preventDefault();
      this.setState({ editFormOpen: true });
    };
    const handleChange = (value, event) => {
      this.setState({
        editFields: {
          ...editFields,
          [event.target.name]: value
        }
      });
      this.validateField(event.target.name, value);
    };

    return (
      <>
        <a href={'#'} onClick={handleShow}>
          <Icon icon={faEdit} size={'lg'} />
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
              id={'conference_edit_title_field'}
              name={'title'}
              value={editFields.title}
              label={dictionary.title[this.context]}
              placeholder={dictionary.insert_title[this.context]}
              status={this.state.errors.title ? 'error' : 'normal'}
              hint={this.state.errors.title ? this.errorMessages.title : ''}
            />
            <InputNext
              onChange={handleChange}
              id={'conference_edit_description_field'}
              name={'description'}
              value={editFields.description}
              label={dictionary.description[this.context]}
              placeholder={dictionary.description_placeholder[this.context]}
              type={'textarea'}
              rows={5}
              maxLength={3000}
              status={this.state.errors.description ? 'error' : 'normal'}
              hint={
                this.state.errors.description
                  ? this.errorMessages.description
                  : ''
              }
            />
            <InputNext
              onChange={handleChange}
              id={'conference_edit_place_field'}
              name={'place'}
              value={editFields.place}
              label={dictionary.location[this.context]}
              placeholder={dictionary.conference_local[this.context]}
              status={this.state.errors.place ? 'error' : 'normal'}
              hint={this.state.errors.place ? this.errorMessages.local : ''}
            />
            <InputNext
              onChange={handleChange}
              id={'conference_edit_date_start_field'}
              name={'dateStart'}
              value={editFields.dateStart}
              label={dictionary.date_start[this.context]}
              type={'datetime-local'}
              status={this.state.errors.dateStart ? 'error' : 'normal'}
              hint={this.state.errors.dateStart ? this.errorMessages.dates : ''}
            />
            <InputNext
              onChange={handleChange}
              id={'conference_edit_date_end_field'}
              name={'dateEnd'}
              value={editFields.dateEnd}
              label={dictionary.date_end[this.context]}
              type={'datetime-local'}
              status={this.state.errors.dateEnd ? 'error' : 'normal'}
              hint={this.state.errors.dateEnd ? this.errorMessages.dates : ''}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleEditSubmission} theme={'success'}>
              Save
            </Button>
            <Button onClick={handleHide} theme={'danger'}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleEditSubmission = () => {
    const editFields = this.state.editFields;
    const errors = this.state.errors;

    editFields.title = editFields.title.trim();
    editFields.description = editFields.description.trim();
    editFields.dateStart = editFields.dateStart.trim();
    editFields.dateEnd = editFields.dateEnd.trim();
    editFields.place = editFields.place.trim();

    if (Object.values(errors).includes(true)) {
      return;
    } else {
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
    }
  };

  private validateField = (field, value) => {
    if (field === 'title') {
      /* Alphanumerical characters with whitespaces and hyphen */
      const re = /^([\s\-]*[\w\u00C0-\u017F]+[\s\-]*){2,150}$/;
      if (!re.test(value)) {
        this.setState({
          errors: {
            ...this.state.errors,
            title: true
          }
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            title: false
          }
        });
      }
    } else if (field === 'description' || field === 'about') {
      /* Alphanumerical characters with whitespaces and some special characters */
      const re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
      if (!re.test(value)) {
        this.setState({
          errors: {
            ...this.state.errors,
            description: true
          }
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            description: false
          }
        });
      }
    } else if (field === 'place' || field === 'local') {
      /* Alphanumerical characters with whitespaces, comma, dot and hyphen */
      const re = /^([\w\u00C0-\u017F]+[ \-,.\w\u00C0-\u017F]*){2,}$/;
      if (!re.test(value)) {
        this.setState({
          errors: {
            ...this.state.errors,
            place: true
          }
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            place: false
          }
        });
      }
    } else if (field === 'dateStart' || field === 'dateEnd') {
      /*
       * YYYY-MM-DDThh:mm date format, where Y = year, M = month, D = day, h = hour, m = minute
       * T is the separator and must be written as the capital letter T
       */
      const re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!re.test(value)) {
        this.setState({
          errors: {
            ...this.state.errors,
            dateStart: true
          }
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            dateStart: false
          }
        });
      }
    }
  };

  private resetState = () => {
    this.setState({
      errors: {
        dateEnd: false,
        dateStart: false,
        description: false,
        livestream: false,
        place: false,
        title: false
      },
      postModalOpen: false,
      request: {
        about: '',
        dateEnd: '',
        dateStart: '',
        livestream: '',
        local: '',
        privacy: 'public',
        switcher: 'false',
        title: ''
      }
    });
  };
}

export default withAuth(Conference);
