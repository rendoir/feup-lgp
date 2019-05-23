import classNames from 'classnames';
import React, { PureComponent } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { Avatar } from '../components';
import Post from '../components/Post/Post';
import InviteModal from '../components/PostModal/InviteModal';
import styles from '../styles/Feed.module.css';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

export type Props = {
  match: {
    params: {
      id: number;
    };
  };
  user: any;
};

export type State = {
  challenges: any[];
  challengeFields: {
    type: 'MCQ' | 'POST' | 'CMT';
    title: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    question: string;
    answers: string | string[];
    correctAnswer: string;
    points: number;
  };
  challengeFormOpen: boolean;
  editFields: {
    title: string;
    dateEnd: string;
    dateStart: string;
    description: string;
    livestreamURL: string;
    local: string;
  };
  editFormOpen: boolean;
  hasLivestream: boolean;
  inviteModalOpen: boolean;
  isArchived: boolean;
  isHidden: boolean;
  joined: boolean;
  postFields: {
    title: string;
    description: string;
    privacy: string;
    files: {
      images: File[];
      videos: File[];
      documents: File[];
    };
    tags: string[];
  };
  postFormOpen: boolean;
  posts: any[];
  talk: {
    title: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    livestreamURL: string;
    local: string;
  };
  userPoints: number;
};

class Talk extends PureComponent<Props, State> {
  public static contextType = LanguageContext;
  private readonly id: number;
  private readonly dateOptions: object;
  private readonly postDateOptions: object;
  private conferenceId: number | undefined;
  private conferenceTitle: string | undefined;
  private ownerId: number | undefined;
  private ownerName: string | undefined;
  private privacy: string;

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
    this.postDateOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    this.id = this.props.match.params.id;
    this.privacy = 'public';

    this.state = {
      challengeFields: {
        answers: '',
        correctAnswer: '',
        dateEnd: '',
        dateStart: '',
        description: '',
        points: 0,
        question: '',
        title: '',
        type: 'MCQ'
      },
      challengeFormOpen: false,
      challenges: [],
      editFields: {
        dateEnd: '',
        dateStart: '',
        description: '',
        livestreamURL: '',
        local: '',
        title: ''
      },
      editFormOpen: false,
      hasLivestream: false,
      inviteModalOpen: false,
      isArchived: false,
      isHidden: false,
      joined: false,
      postFields: {
        description: '',
        files: {
          documents: [],
          images: [],
          videos: []
        },
        privacy: '',
        tags: [],
        title: ''
      },
      postFormOpen: false,
      posts: [],
      talk: {
        dateEnd: '',
        dateStart: '',
        description: '',
        livestreamURL: '',
        local: '',
        title: ''
      },
      userPoints: 0
    };
  }

  public componentWillMount(): void {
    this.apiGetTalk();
  }

  public render() {
    return (
      <div className={'container-fluid mt-3 col-lg-12'}>
        <div className={'row'}>{this.renderBreadcrumb()}</div>
        <div className={'row'}>
          <div className={'col-lg-3'}>
            {this.renderInfoCard()}
            {this.renderAdminCard()}
            {this.renderChallengesCard()}
          </div>
          <div className={'col-lg-9'}>
            {this.state.joined ? (
              <div className={'row'}>
                <div className={'col-lg-7'}>{this.renderPosts()}</div>
                <div className={'col-lg-5'}>
                  {this.state.hasLivestream ? this.renderLivestream() : null}
                  {this.renderChat()}
                </div>
              </div>
            ) : (
              <div>{this.renderJoinAlert()}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  private apiGetTalk = () => {
    axiosInstance
      .get(`/talk/${this.id}`)
      .then(res => {
        console.log(res);
        const talk = res.data.talk;
        const posts = res.data.posts;
        const challenges = res.data.challenges;
        const joined = res.data.isParticipating;

        this.conferenceId = talk.conference_id;
        this.conferenceTitle = talk.conference_title;
        this.ownerId = talk.user_id;
        this.ownerName = talk.user_name;
        this.privacy = talk.privacy;

        this.setState({
          challenges,
          hasLivestream: talk.livestream_url !== '',
          isArchived: talk.archived,
          isHidden: talk.privacy === 'closed',
          joined,
          posts,
          talk: {
            dateEnd: talk.dateend,
            dateStart: talk.datestart,
            description: talk.about,
            livestreamURL: talk.livestream_url,
            local: talk.local,
            title: talk.title
          }
        });
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
  };

  /* Components */

  private renderJoinAlert = () => {
    return (
      <Alert variant={'danger'}>
        <p>{dictionary.user_not_joined[this.context]}.</p>
      </Alert>
    );
  };

  private renderJoin = () => {
    const handleJoin = () => {
      this.state.joined
        ? axiosInstance
            .delete(`/talk/${this.id}/leave`)
            .then(() => {
              this.setState({
                joined: false
              });
            })
            .catch(error => {
              console.log(error.response.data.message);
            })
        : axiosInstance
            .post(`/talk/${this.id}/join`)
            .then(() => {
              this.setState({
                joined: true
              });
            })
            .catch(error => {
              console.log(error.response.data.message);
            });
    };

    return (
      <Button
        onClick={handleJoin}
        className={'w-100'}
        variant={this.state.joined ? 'danger' : 'success'}
      >
        {this.state.joined
          ? dictionary.leave_talk[this.context]
          : dictionary.join_talk[this.context]}
      </Button>
    );
  };

  private renderBreadcrumb = () => {
    return (
      <nav aria-label={'breadcrumb'} className={'col-lg-12'}>
        <ol className={classNames('breadcrumb', styles.header)}>
          <li className={'breadcrumb-item'}>
            <a href={'/'} className={styles.breadcrumbLink}>
              {dictionary.home[this.context]}
            </a>
          </li>
          <li className={'breadcrumb-item'}>
            <a href={'/conferences'} className={styles.breadcrumbLink}>
              {dictionary.conferences[this.context]}
            </a>
          </li>
          <li className={'breadcrumb-item'}>
            <a
              href={`/conference/${this.conferenceId}`}
              className={styles.breadcrumbLink}
            >
              {this.conferenceTitle}
            </a>
          </li>
          <li className={'breadcrumb-item active'} aria-current={'page'}>
            {this.state.talk.title}
          </li>
        </ol>
      </nav>
    );
  };

  private renderInfoCard = () => {
    const talk = this.state.talk;
    const dateStart = new Date(talk.dateStart).toLocaleDateString(
      dictionary.date_format[this.context],
      this.dateOptions
    );
    const dateEnd = new Date(talk.dateEnd).toLocaleDateString(
      dictionary.date_format[this.context],
      this.dateOptions
    );

    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header className={styles.header}>
          <div
            className={'d-flex justify-content-between align-items-center mb-1'}
          >
            <div className={'d-flex align-items-center'}>
              <Avatar image={''} title={talk.title} /> &nbsp;
              <strong>{talk.title}</strong>
            </div>
            {this.renderTalkStatus()}
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>{talk.description}</Card.Text>
          <hr />
          <div>
            <strong>{dictionary.talk_local[this.context]}</strong>
            <br />
            {talk.local}
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
        <Card.Footer>{this.renderJoin()}</Card.Footer>
      </Card>
    );
  };

  private renderAdminCard = () => {
    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header className={styles.header}>
          <Card.Title className={'mb-0'}>
            {dictionary.admin_area[this.context]}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <ListGroup variant={'flush'}>
            {this.renderInviteForm()}
            {this.renderChallengeForm()}
            {this.renderEditForm()}
            {this.renderArchiveForm()}
            {this.renderHideForm()}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  };

  private renderTalkStatus = () => {
    if (this.state.isArchived) {
      return (
        <Card.Subtitle className={'text-info mb-0'}>
          {dictionary.archived[this.context]}
        </Card.Subtitle>
      );
    } else if (this.state.isHidden) {
      return (
        <Card.Subtitle className={'text-danger mb-0'}>
          {dictionary.hidden[this.context]}
        </Card.Subtitle>
      );
    } else {
      return (
        <Card.Subtitle className={'text-success mb-0'}>
          {dictionary.open[this.context]}
        </Card.Subtitle>
      );
    }
  };

  private renderChallengesCard = () => {
    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header className={styles.header}>
          <Card.Title className={'mb-0'}>
            {dictionary.challenge_conference[this.context]}
          </Card.Title>
        </Card.Header>
        <Card.Body>CHALLENGES</Card.Body>
      </Card>
    );
  };

  private renderPosts = () => {
    const posts = this.state.posts;

    return (
      <div>
        <div className={'mb-3'}>
          <Card
            className={
              'p-3 d-flex flex-row justify-content-between align-items-center'
            }
          >
            <Card.Title className={'mb-0'}>
              {dictionary.posts_cap[this.context]}
            </Card.Title>
            {this.renderPostForm()}
          </Card>
        </div>
        {posts.map(post => (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            date={new Date(post.date).toLocaleDateString(
              dictionary.date_format[this.context],
              this.postDateOptions
            )}
            author={post.author}
            content={post.content}
            visibility={post.visibility}
            comments={post.comments}
            tags={post.tags}
            user_id={post.user_id}
            files={post.files}
          />
        ))}
      </div>
    );
  };

  private renderLivestream = () => {
    return (
      <div className={'embed-responsive embed-responsive-16by9 mb-3'}>
        <iframe
          id={'livestream'}
          className={'embed-responsive-item'}
          src={this.state.talk.livestreamURL}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        />
      </div>
    );
  };

  private renderChat = () => {
    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header className={styles.header}>Chat</Card.Header>
        <Card.Body style={{ height: '20rem' }} className={'overflow-auto'} />
        <Card.Footer className={'row m-0 p-1'}>
          <div className={'col-9 m-0 p-0'}>
            <textarea
              className={'w-100'}
              rows={3}
              maxLength={300}
              minLength={1}
            />
          </div>
          <div
            className={'col-3 d-flex justify-content-center align-items-center'}
          >
            <Button className={classNames('w-100 h-50', styles.button)}>
              <i className={'fas fa-paper-plane mr-2'} />
              Send
            </Button>
          </div>
        </Card.Footer>
      </Card>
    );
  };

  /* Forms */

  private renderInviteForm = () => {
    const handleOpen = () => this.setState({ inviteModalOpen: true });
    const handleHide = () => this.setState({ inviteModalOpen: false });

    return (
      <>
        <ListGroup.Item onClick={handleOpen}>
          <i className={'fas fa-envelope mr-2'} />
          {dictionary.invite_users[this.context]}
        </ListGroup.Item>

        <Modal
          centered={true}
          show={this.state.inviteModalOpen}
          onHide={handleHide}
        >
          <Modal.Header closeButton={true}>
            <Modal.Title>
              {dictionary.invite_users_to[this.context]}{' '}
              {dictionary.talk[this.context]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId={'invite_user'}>
                <Form.Label>{dictionary.email[this.context]}</Form.Label>
                <Form.Control
                  type={'email'}
                  className={styles.border}
                  placeholder={'Enter email'}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant={'danger'} onClick={handleHide}>
              Cancel
            </Button>
            <Button
              type={'submit'}
              className={styles.button}
              onClick={this.handleInviteSubmission}
              form={'invite_user'}
            >
              Invite
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleInviteSubmission = () => {};

  private renderChallengeForm = () => {
    const handleOpen = () => this.setState({ challengeFormOpen: true });
    const handleClose = () => this.setState({ challengeFormOpen: false });
    const handleSelect = event => {
      this.setState({
        challengeFields: {
          ...this.state.challengeFields,
          type: event.target.value
        }
      });
    };

    return (
      <>
        <ListGroup.Item onClick={handleOpen}>
          <i className={'fas fa-puzzle-piece mr-2'} />
          {dictionary.create_challenge_talk[this.context]}
        </ListGroup.Item>

        <Modal
          centered={true}
          show={this.state.challengeFormOpen}
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title>{dictionary.new_challenge[this.context]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId={'create_challenge.title'}>
                <Form.Label>{dictionary.title[this.context]}</Form.Label>
                <Form.Control
                  type={'text'}
                  placeholder={dictionary.challenge_title[this.context]}
                  className={styles.border}
                />
              </Form.Group>
              <Form.Group controlId={'create_challenge.description'}>
                <Form.Label>{dictionary.description[this.context]}</Form.Label>
                <Form.Control
                  as={'textarea'}
                  rows={5}
                  placeholder={
                    dictionary.chal_description_placeholder[this.context]
                  }
                  className={styles.border}
                />
              </Form.Group>
              <Form.Group controlId={'create_challenge.type'}>
                <Form.Label>
                  {dictionary.challenge_type[this.context]}
                </Form.Label>
                <Form.Control
                  as={'select'}
                  className={styles.border}
                  value={this.state.challengeFields.type}
                  onChange={handleSelect}
                >
                  <option value={'MCQ'}>
                    {dictionary.mult_choice_question[this.context]}
                  </option>
                  <option value={'POST'}>
                    {dictionary.post_create[this.context]}
                  </option>
                  <option value={'CMT'}>
                    {dictionary.comment_post[this.context]}
                  </option>
                </Form.Control>
                {this.state.challengeFields.type === 'MCQ' ? (
                  <>
                    <small className={'text-muted'}>
                      {dictionary.mult_choice_question_desc[this.context]}
                    </small>
                    <Form.Group
                      controlId={'create_challenge.question'}
                      className={'mt-3'}
                    >
                      <Form.Label>
                        {dictionary.question[this.context]}
                      </Form.Label>
                      <Form.Control type={'text'} className={styles.border} />
                    </Form.Group>
                    <Form.Group controlId={'create_challenge.answers'}>
                      <Form.Label>
                        {dictionary.options[this.context]}
                      </Form.Label>
                      <Form.Control type={'text'} />
                    </Form.Group>
                  </>
                ) : null}
                {this.state.challengeFields.type === 'POST' ? (
                  <small className={'text-muted'}>
                    {dictionary.post_create_desc[this.context]}
                  </small>
                ) : null}
                {this.state.challengeFields.type === 'CMT' ? (
                  <>
                    <small className={'text-muted'}>
                      {dictionary.comment_post_desc[this.context]}
                    </small>
                    <Form.Group
                      controlId={'create_challenge.question'}
                      className={'mt-3'}
                    >
                      <Form.Label>
                        {dictionary.post_to_com[this.context]}
                      </Form.Label>
                      <Form.Control as={'select'} className={styles.border}>
                        {this.state.posts.map(post => {
                          return (
                            <option key={post.id} value={post.title}>
                              {post.title}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Form.Group>
                  </>
                ) : null}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} variant={'danger'}>
              {dictionary.cancel[this.context]}
            </Button>
            <Button
              onClick={this.handleChallengeSubmission}
              className={styles.button}
            >
              {dictionary.create[this.context]}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleChallengeSubmission = () => {};

  private renderEditForm = () => {
    return (
      <ListGroup.Item>
        <i className={'fas fa-pen mr-2'} />
        {dictionary.edit_talk[this.context]}
      </ListGroup.Item>
    );
  };

  private handleEditSubmission = () => {};

  private renderArchiveForm = () => {
    return (
      <ListGroup.Item>
        <i className={'fas fa-archive mr-2'} />
        {this.state.isArchived
          ? dictionary.unarchive_talk[this.context]
          : dictionary.archive_talk[this.context]}
      </ListGroup.Item>
    );
  };

  private handleArchiveSubmission = () => {};

  private renderHideForm = () => {
    return (
      <ListGroup.Item>
        <i className={'fas fa-trash mr-2'} />
        {this.state.isHidden
          ? dictionary.reopen_talk[this.context]
          : dictionary.hide_talk[this.context]}
      </ListGroup.Item>
    );
  };

  private handleHideSubmission = () => {};

  private renderPostForm = () => {
    return <i className={'fas fa-plus'} />;
  };

  private handlePostSubmission = () => {};
}

export default withAuth(Talk);
