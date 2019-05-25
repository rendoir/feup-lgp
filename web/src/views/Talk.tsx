import classNames from 'classnames';
import React, { PureComponent } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { Avatar } from '../components';
import Post from '../components/Post/Post';
import Switcher from '../components/Switcher/Switcher';
import Tag from '../components/Tags/Tag';
import styles from '../styles/Feed.module.css';
import AuthHelperMethods from '../utils/AuthHelperMethods';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';

export type Props = {
  match: {
    params: {
      id: number;
    };
  };
  user: any;
};

export type State = {
  archiveModalOpen: boolean;
  challenges: any[];
  challengeFields: {
    answer: string;
    correctAnswer: string;
    dateEnd: string;
    dateStart: string;
    description: string;
    options: string[];
    points: number;
    question: string;
    title: string;
    type: 'MCQ' | 'POST' | 'CMT';
  };
  challengeFormOpen: boolean;
  editFields: {
    title: string;
    dateEnd: string;
    dateStart: string;
    description: string;
    hasLivestream: boolean;
    livestreamURL: string;
    local: string;
  };
  editFormOpen: boolean;
  error: {
    answer: boolean;
    correctAnswer: boolean;
    dateEnd: boolean;
    dateStart: boolean;
    description: boolean;
    livestreamURL: boolean;
    local: boolean;
    options: boolean;
    points: boolean;
    question: boolean;
    tags: boolean;
    title: boolean;
  };
  hideModalOpen: boolean;
  inviteModalOpen: boolean;
  isArchived: boolean;
  isHidden: boolean;
  joined: boolean;
  postFields: {
    title: string;
    description: string;
    files: {
      images: File[];
      videos: File[];
      documents: File[];
    };
    tag: string;
    tags: string[];
  };
  postFormOpen: boolean;
  posts: any[];
  talk: {
    title: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    hasLivestream: boolean;
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
  private errorMessages: {
    answer: string;
    correctAnswer: string;
    dateEnd: string;
    dateStart: string;
    description: string;
    livestreamURL: string;
    local: string;
    options: string;
    points: string;
    question: string;
    title: string;
  };
  private tags: any[];
  private auth = new AuthHelperMethods();

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
    this.errorMessages = {
      answer: '',
      correctAnswer: '',
      dateEnd: '',
      dateStart: '',
      description: '',
      livestreamURL: '',
      local: '',
      options: '',
      points: '',
      question: '',
      title: ''
    };
    this.tags = [];

    this.state = {
      archiveModalOpen: false,
      challengeFields: {
        answer: '',
        correctAnswer: '',
        dateEnd: '',
        dateStart: '',
        description: '',
        options: [],
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
        hasLivestream: false,
        livestreamURL: '',
        local: '',
        title: ''
      },
      editFormOpen: false,
      error: {
        answer: false,
        correctAnswer: false,
        dateEnd: false,
        dateStart: false,
        description: false,
        livestreamURL: false,
        local: false,
        options: false,
        points: false,
        question: false,
        tags: false,
        title: false
      },
      hideModalOpen: false,
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
        tag: '',
        tags: [],
        title: ''
      },
      postFormOpen: false,
      posts: [],
      talk: {
        dateEnd: '',
        dateStart: '',
        description: '',
        hasLivestream: false,
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
                  {this.state.talk.hasLivestream
                    ? this.renderLivestream()
                    : null}
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
        const tags = res.data.tags;

        this.conferenceId = talk.conference_id;
        this.conferenceTitle = talk.conference_title;
        this.ownerId = talk.user_id;
        this.ownerName = talk.user_name;
        this.privacy = talk.privacy;
        this.tags = tags;

        this.setState({
          challenges,
          editFields: {
            dateEnd: talk.dateend,
            dateStart: talk.datestart,
            description: talk.about,
            hasLivestream: talk.livestream_url !== '',
            livestreamURL: talk.livestream_url,
            local: talk.local,
            title: talk.title
          },
          isArchived: talk.archived,
          isHidden: talk.hidden,
          joined,
          posts,
          talk: {
            dateEnd: talk.dateend,
            dateStart: talk.datestart,
            description: talk.about,
            hasLivestream: talk.livestream_url !== '',
            livestreamURL: talk.livestream_url,
            local: talk.local,
            title: talk.title
          },
          userPoints: 0
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
    const nextIcon = (
      <span
        aria-hidden={'true'}
        className={classNames('carousel-control-next-icon', styles.arrow)}
      />
    );
    const prevIcon = (
      <span
        aria-hidden={'true'}
        className={classNames('carousel-control-prev-icon', styles.arrow)}
      />
    );
    const handleType = type => {
      return (
        <>
          <Card.Subtitle className={'mt-3 mb-2'}>
            {dictionary.challenge_type[this.context]}
          </Card.Subtitle>
          {type === 'question_options' ? 'Multiple Choice Question' : null}
          {type === 'create_post' ? 'Create post' : null}
          {type === 'comment_post' ? 'Comment on a post' : null}
        </>
      );
    };
    const handleClick = (challenge, userAnswer) => {
      if (challenge.isComplete) {
        return;
      }
      axiosInstance
        .post(`/talk/${this.id}/challenge/solve`, {
          author: this.auth.getUserPayload().id,
          challenge: challenge.id,
          challenge_answer: userAnswer,
          completion: userAnswer === challenge.correctAnswer
        })
        .then(() => {
          const challenges = this.state.challenges;
          challenges.forEach(ch => {
            if (ch.id === challenge.id) {
              challenge.userAnswer = userAnswer;
              challenge.isCorrect = userAnswer === challenge.correctAnswer;
              challenge.isComplete = true;
            }
          });
          this.setState({
            challenges
          });
        })
        .catch(error => console.log(error.response.data.message));
    };
    const handleMCQ = challenge => {
      const itemClassName = option => {
        if (challenge.isComplete) {
          if (challenge.userAnswer === option) {
            return challenge.isCorrect
              ? classNames(styles.correctAnswer, 'mb-1')
              : classNames(styles.wrongAnswer, 'mb-1');
          }
        }
        return 'mb-1';
      };

      return (
        <>
          <Card.Subtitle className={'mt-3 mb-2'}>
            {dictionary.question[this.context]}
          </Card.Subtitle>
          {challenge.question}
          <Card.Subtitle className={'mt-3 mb-2'}>
            {dictionary.options[this.context]}
          </Card.Subtitle>
          <ListGroup>
            {challenge.options.map((option, index) => (
              <ListGroup.Item
                key={index}
                action={!challenge.isComplete}
                onClick={() => handleClick(challenge, option)}
                className={itemClassName(option)}
              >
                {option}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      );
    };
    const handleCMT = challenge => {
      return (
        <>
          <Card.Subtitle className={'mt-3 mb-2'}>
            {dictionary.post_to_com[this.context]}
          </Card.Subtitle>
          {this.state.posts.map(post => {
            if (post.id === challenge.post) {
              return (
                <a href={`#${post.id}`} className={styles.link} key={post.id}>
                  {post.title}
                </a>
              );
            }
          })}
        </>
      );
    };
    const handleChallenges = () => {
      return this.state.challenges.map(challenge => {
        return (
          <Carousel.Item key={challenge.id}>
            <Card
              className={
                challenge.challengetype !== 'question_options' &&
                challenge.isComplete
                  ? classNames('mr-5 ml-5', styles.correctAnswer)
                  : 'mr-5 ml-5'
              }
              border={'light'}
            >
              <Card.Body>
                <Card.Title>{challenge.title}</Card.Title>
                <hr />
                <Card.Subtitle className={'mb-2'}>
                  {dictionary.description[this.context]}:
                </Card.Subtitle>
                {challenge.description}
                {handleType(challenge.challengetype)}
                {challenge.challengetype === 'question_options'
                  ? handleMCQ(challenge)
                  : null}
                {challenge.challengetype === 'comment_post'
                  ? handleCMT(challenge)
                  : null}
              </Card.Body>
            </Card>
          </Carousel.Item>
        );
      });
    };

    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header
          className={classNames(
            'd-flex flex-row justify-content-between align-items-center',
            styles.header
          )}
        >
          <Card.Title className={'mb-0'}>
            {dictionary.challenge_conference[this.context]}
          </Card.Title>
          <Card.Title className={'mb-0'}>
            {dictionary.points[this.context]}: {this.state.userPoints}
          </Card.Title>
        </Card.Header>
        <Card.Body className={'p-1'}>
          {this.state.challenges.length > 0 ? (
            <Carousel
              fade={true}
              indicators={false}
              controls={this.state.challenges.length > 1}
              nextIcon={nextIcon}
              prevIcon={prevIcon}
              interval={0}
            >
              {handleChallenges()}
            </Carousel>
          ) : null}
        </Card.Body>
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
          <div id={post.id} key={post.id}>
            <Post
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
          </div>
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

  private handleInviteSubmission = () => {
    console.log(
      'USER INVITED! - YOU ARE SEEING THIS MESSAGE BECAUSE THIS FEATURE IS NOT YET FULLY IMPLEMENTED!'
    );
  };

  /* TODO: finish and improve */
  private renderChallengeForm = () => {
    const handleOpen = () => this.setState({ challengeFormOpen: true });
    const handleClose = () => {
      this.setState({
        challengeFields: {
          answer: '',
          correctAnswer: '',
          dateEnd: '',
          dateStart: '',
          description: '',
          options: [],
          points: 0,
          question: '',
          title: '',
          type: 'MCQ'
        },
        challengeFormOpen: false,
        error: {
          answer: false,
          correctAnswer: false,
          dateEnd: false,
          dateStart: false,
          description: false,
          livestreamURL: false,
          local: false,
          options: false,
          points: false,
          question: false,
          tags: false,
          title: false
        }
      });
      this.errorMessages = {
        answer: '',
        correctAnswer: '',
        dateEnd: '',
        dateStart: '',
        description: '',
        livestreamURL: '',
        local: '',
        options: '',
        points: '',
        question: '',
        title: ''
      };
    };
    const handleChange = event => {
      this.setState({
        challengeFields: {
          ...this.state.challengeFields,
          [event.target.name]: event.target.value
        }
      });
    };
    const handleAddOptionsByKeyPress = event => {
      if (event.key === 'Enter') {
        const answer = this.state.challengeFields.answer.trim();
        const options = this.state.challengeFields.options;

        if (options.length >= 5 || answer.length === 0) {
          return;
        }

        if (!options.includes(answer)) {
          options.push(answer);
        }

        this.setState({
          challengeFields: {
            ...this.state.challengeFields,
            answer: '',
            options
          }
        });
      }
    };
    const handleAddOptionsByButtonPress = () => {
      const answer = this.state.challengeFields.answer.trim();
      const options = this.state.challengeFields.options;

      if (options.length >= 5 || answer.length === 0) {
        return;
      }

      if (!options.includes(answer)) {
        options.push(answer);
      }

      this.setState({
        challengeFields: {
          ...this.state.challengeFields,
          answer: '',
          options
        }
      });
    };
    const handleRemoveOptions = (event, value) => {
      event.preventDefault();
      event.stopPropagation();
      let options = this.state.challengeFields.options;
      options = options.filter(option => option !== value);
      let correctAnswer = this.state.challengeFields.correctAnswer;
      correctAnswer = correctAnswer === value ? '' : correctAnswer;

      this.setState({
        challengeFields: {
          ...this.state.challengeFields,
          correctAnswer,
          options
        }
      });
    };
    const handleSelectCorrectAnswer = option => {
      this.setState({
        challengeFields: {
          ...this.state.challengeFields,
          correctAnswer: option
        }
      });
    };

    const renderTitleField = () => {
      return (
        <Form.Group controlId={'create_challenge.title'}>
          <Form.Label>{dictionary.title[this.context]}</Form.Label>
          <Form.Control
            type={'text'}
            placeholder={dictionary.challenge_title[this.context]}
            className={styles.border}
            value={this.state.challengeFields.title}
            name={'title'}
            onChange={handleChange}
            required={true}
          />
          {this.state.error.title ? (
            <Form.Text className={'text-danger'}>
              {this.errorMessages.title}
            </Form.Text>
          ) : null}
        </Form.Group>
      );
    };
    const renderDescriptionField = () => {
      return (
        <Form.Group controlId={'create_challenge.description'}>
          <Form.Label>{dictionary.description[this.context]}</Form.Label>
          <Form.Control
            as={'textarea'}
            rows={5}
            placeholder={dictionary.chal_description_placeholder[this.context]}
            value={this.state.challengeFields.description}
            name={'description'}
            onChange={handleChange}
            className={styles.border}
            required={true}
          />
          {this.state.error.description ? (
            <Form.Text className={'text-danger'}>
              {this.errorMessages.description}
            </Form.Text>
          ) : null}
        </Form.Group>
      );
    };
    const renderDatesFields = () => {
      return (
        <>
          <Form.Group>
            <Form.Label>{dictionary.starting_date[this.context]}</Form.Label>
            <Form.Control
              type={'datetime-local'}
              value={this.state.challengeFields.dateStart}
              name={'dateStart'}
              onChange={handleChange}
              className={styles.border}
              required={true}
            />
            {this.state.error.dateStart ? (
              <Form.Text className={'text-danger'}>
                {this.errorMessages.dateStart}
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>{dictionary.ending_date[this.context]}</Form.Label>
            <Form.Control
              type={'datetime-local'}
              value={this.state.challengeFields.dateEnd}
              name={'dateEnd'}
              onChange={handleChange}
              className={styles.border}
              required={true}
            />
            {this.state.error.dateEnd ? (
              <Form.Text className={'text-danger'}>
                {this.errorMessages.dateEnd}
              </Form.Text>
            ) : null}
          </Form.Group>
        </>
      );
    };
    const renderOptionsField = () => {
      return (
        <>
          <Form.Group controlId={'create_challenge.answers'}>
            <Form.Label>{dictionary.options[this.context]}</Form.Label>
            <InputGroup>
              <FormControl
                type={'text'}
                value={this.state.challengeFields.answer}
                name={'answer'}
                onChange={handleChange}
                onKeyUp={handleAddOptionsByKeyPress}
                className={styles.border}
              />
              <InputGroup.Append>
                <Button
                  className={styles.button}
                  onClick={handleAddOptionsByButtonPress}
                  disabled={this.state.challengeFields.options.length >= 5}
                >
                  Add
                </Button>
              </InputGroup.Append>
            </InputGroup>
            {this.state.error.options ? (
              <Form.Text className={'text-danger'}>
                {this.errorMessages.options}
              </Form.Text>
            ) : null}
          </Form.Group>
          <ListGroup>
            {this.state.challengeFields.options.map((option, index) => (
              <ListGroup.Item
                key={index}
                className={`d-flex flex-row
                    justify-content-between
                    align-items-center
                    ${
                      option === this.state.challengeFields.correctAnswer
                        ? styles.header
                        : ''
                    }
                    `}
                onClick={() => handleSelectCorrectAnswer(option)}
              >
                ({index + 1}) {option}
                <a
                  href={'#'}
                  onClick={event => handleRemoveOptions(event, option)}
                  className={'text-danger'}
                >
                  <i className={'fas fa-times'} />
                </a>
              </ListGroup.Item>
            ))}
            {this.state.challengeFields.options.length > 0 ? (
              <small className={'text-muted'}>
                Click on an option to set it as the correct answer
              </small>
            ) : null}
            {this.state.error.correctAnswer ? (
              <Form.Text className={'text-danger'}>
                {this.errorMessages.correctAnswer}
              </Form.Text>
            ) : null}
          </ListGroup>
        </>
      );
    };
    const renderMCQFields = () => {
      return (
        <>
          <small className={'text-muted'}>
            {dictionary.mult_choice_question_desc[this.context]}
          </small>
          <Form.Group
            controlId={'create_challenge.question'}
            className={'mt-3'}
          >
            <Form.Label>{dictionary.question[this.context]}</Form.Label>
            <Form.Control
              type={'text'}
              className={styles.border}
              value={this.state.challengeFields.question}
              name={'question'}
              onChange={handleChange}
            />
            {this.state.error.question ? (
              <Form.Text className={'text-danger'}>
                {this.errorMessages.question}
              </Form.Text>
            ) : null}
          </Form.Group>
          {renderOptionsField()}
        </>
      );
    };
    const renderPOSTFields = () => {
      return (
        <small className={'text-muted'}>
          {dictionary.post_create_desc[this.context]}
        </small>
      );
    };
    const renderCMTFields = () => {
      return (
        <>
          <small className={'text-muted'}>
            {dictionary.comment_post_desc[this.context]}
          </small>
          <Form.Group
            controlId={'create_challenge.question'}
            className={'mt-3'}
          >
            <Form.Label>{dictionary.post_to_com[this.context]}</Form.Label>
            <Form.Control
              as={'select'}
              className={styles.border}
              value={this.state.challengeFields.answer}
              name={'answer'}
              onChange={handleChange}
            >
              {this.state.posts.map(post => {
                return (
                  <option key={post.id} value={post.id}>
                    {post.title}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </>
      );
    };
    const renderTypeFields = () => {
      return (
        <Form.Group controlId={'create_challenge.type'}>
          <Form.Label>{dictionary.challenge_type[this.context]}</Form.Label>
          <Form.Control
            as={'select'}
            className={styles.border}
            value={this.state.challengeFields.type}
            name={'type'}
            onChange={handleChange}
            required={true}
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
          {this.state.challengeFields.type === 'MCQ' ? renderMCQFields() : null}
          {this.state.challengeFields.type === 'POST'
            ? renderPOSTFields()
            : null}
          {this.state.challengeFields.type === 'CMT' ? renderCMTFields() : null}
        </Form.Group>
      );
    };
    const renderPointsField = () => {
      return (
        <Form.Group>
          <Form.Label>{dictionary.points[this.context]}</Form.Label>
          <Form.Control
            type={'number'}
            min={0}
            value={this.state.challengeFields.points.toString()}
            name={'points'}
            onChange={handleChange}
            className={styles.border}
            required={true}
          />
          {this.state.error.points ? (
            <Form.Text className={'text-danger'}>
              {this.errorMessages.points}
            </Form.Text>
          ) : null}
        </Form.Group>
      );
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
          <Modal.Header closeButton={true}>
            <Modal.Title>{dictionary.new_challenge[this.context]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id={'create_challenge'}>
              {renderTitleField()}
              {renderDescriptionField()}
              {renderDatesFields()}
              {renderTypeFields()}
              {renderPointsField()}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} variant={'danger'}>
              {dictionary.cancel[this.context]}
            </Button>
            <Button
              onClick={this.handleChallengeSubmission}
              className={styles.button}
              form={'create_challenge'}
            >
              {dictionary.create[this.context]}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleChallengeSubmission = () => {
    let error = false;
    const fields = this.state.challengeFields;

    Object.keys(fields).map(key => {
      if (key !== 'options') {
        fields[key] = fields[key].toString().trim();
      } else {
        fields[key] = fields[key].map(value => value.toString().trim());
      }
    });

    if (fields.title.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          title: true
        }
      });
      this.errorMessages.title = 'Field title can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          title: false
        }
      });
      this.errorMessages.title = '';
    }
    if (fields.description.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          description: true
        }
      });
      this.errorMessages.description = 'Field description can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          description: false
        }
      });
      this.errorMessages.description = '';
    }
    if (fields.dateStart.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          dateStart: true
        }
      });
      this.errorMessages.dateStart = 'Field date start can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          dateStart: false
        }
      });
      this.errorMessages.dateStart = '';
    }
    if (fields.dateEnd.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          dateEnd: true
        }
      });
      this.errorMessages.dateEnd = 'Field date end can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          dateEnd: false
        }
      });
      this.errorMessages.dateEnd = '';
    }
    if (fields.type === 'MCQ' && fields.question.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          question: true
        }
      });
      this.errorMessages.question = 'Field question can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          question: false
        }
      });
      this.errorMessages.question = '';
    }
    if (fields.type === 'MCQ' && fields.options.length <= 1) {
      this.setState({
        error: {
          ...this.state.error,
          options: true
        }
      });
      this.errorMessages.options =
        'Field options must have at least two values!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          options: false
        }
      });
      this.errorMessages.options = '';
    }
    if (fields.type === 'MCQ' && fields.correctAnswer.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          correctAnswer: true
        }
      });
      this.errorMessages.correctAnswer =
        'Field correct answer can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          correctAnswer: false
        }
      });
      this.errorMessages.correctAnswer = '';
    }
    if (fields.points < 0) {
      this.setState({
        error: {
          ...this.state.error,
          points: true
        }
      });
      this.errorMessages.points = 'Field points can not be smaller than 0!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          points: false
        }
      });
      this.errorMessages.points = '';
    }

    Object.entries(this.state.challengeFields).forEach(entry => {
      if (entry[1].toString().length > 0) {
        if (!this.validateInput(entry[0], entry[1])) {
          error = true;
        }
      }
    });

    if (error) {
      return;
    }

    const formData = new FormData();
    formData.append('type', fields.type);
    formData.append('title', fields.title);
    formData.append('description', fields.description);
    formData.append('dateEnd', fields.dateEnd);
    formData.append('dateStart', fields.dateStart);
    formData.append('points', fields.points.toString());
    formData.append('question', fields.question);
    formData.append('correctAnswer', fields.correctAnswer);
    fields.options.forEach((option, index) =>
      formData.append(`options[${index}]`, option)
    );
    formData.append('post', fields.answer);
    formData.append('talk_id', this.id.toString());

    axiosInstance
      .post(`/talk/${this.id}/challenge/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        this.setState({
          challengeFields: {
            answer: '',
            correctAnswer: '',
            dateEnd: '',
            dateStart: '',
            description: '',
            options: [],
            points: 0,
            question: '',
            title: '',
            type: 'MCQ'
          },
          challengeFormOpen: false,
          challenges: [...this.state.challenges, this.state.challengeFields]
        });
      })
      .catch(err => console.log(err.response.data.message));
  };

  private renderEditForm = () => {
    const editFields = this.state.editFields;
    const handleHide = () => {
      this.setState({
        editFields: {
          ...this.state.talk
        },
        editFormOpen: false
      });
    };
    const handleShow = () => {
      this.setState({
        editFormOpen: true
      });
    };
    const handleChange = event => {
      this.setState({
        editFields: {
          ...editFields,
          [event.target.name]: event.target.value
        }
      });
    };
    const handleSwitcher = value => {
      this.setState({
        editFields: {
          ...editFields,
          hasLivestream: value,
          livestreamURL: value ? this.state.talk.livestreamURL : ''
        }
      });
    };

    return (
      <>
        <ListGroup.Item onClick={handleShow}>
          <i className={'fas fa-pen mr-2'} />
          {dictionary.edit_talk[this.context]}
        </ListGroup.Item>

        <Modal show={this.state.editFormOpen} onHide={handleHide}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{dictionary.edit_talk[this.context]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId={'edit_talk.title'}>
                <Form.Label>{dictionary.title[this.context]}</Form.Label>
                <Form.Control
                  type={'text'}
                  placeholder={dictionary.insert_title[this.context]}
                  value={editFields.title}
                  name={'title'}
                  onChange={handleChange}
                  className={styles.border}
                />
                {this.state.error.title ? (
                  <Form.Text className={'text-danger'}>
                    {this.errorMessages.title}
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId={'edit_talk.description'}>
                <Form.Label>{dictionary.description[this.context]}</Form.Label>
                <Form.Control
                  as={'textarea'}
                  rows={10}
                  placeholder={dictionary.description_placeholder[this.context]}
                  value={editFields.description}
                  name={'description'}
                  onChange={handleChange}
                  className={classNames('overflow-auto', styles.border)}
                  style={{ height: '20rem' }}
                />
                {this.state.error.description ? (
                  <Form.Text className={'text-danger'}>
                    {this.errorMessages.description}
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId={'edit_talk.local'}>
                <Form.Label>{dictionary.talk_local[this.context]}</Form.Label>
                <Form.Control
                  type={'text'}
                  value={editFields.local}
                  name={'local'}
                  onChange={handleChange}
                  className={styles.border}
                />
                {this.state.error.local ? (
                  <Form.Text className={'text-danger'}>
                    {this.errorMessages.local}
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId={'edit_talk.dateStart'}>
                <Form.Label>
                  {dictionary.starting_date[this.context]}
                </Form.Label>
                <Form.Control
                  type={'datetime-local'}
                  value={editFields.dateStart}
                  name={'dateStart'}
                  onChange={handleChange}
                  className={styles.border}
                />
                {this.state.error.dateStart ? (
                  <Form.Text className={'text-danger'}>
                    {this.errorMessages.dateStart}
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId={'edit_talk.dateEnd'}>
                <Form.Label>{dictionary.ending_date[this.context]}</Form.Label>
                <Form.Control
                  type={'datetime-local'}
                  value={editFields.dateEnd}
                  name={'dateEnd'}
                  onChange={handleChange}
                  className={styles.border}
                />
                {this.state.error.dateEnd ? (
                  <Form.Text className={'text-danger'}>
                    {this.errorMessages.dateEnd}
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId={'edit_talk.livestreamSwitcher'}>
                <Form.Label>{dictionary.livestream[this.context]}</Form.Label>
                <Switcher
                  id={'edit_talk.livestreamSwitcher'}
                  name={'hasLivestream'}
                  onChange={handleSwitcher}
                  value={editFields.hasLivestream}
                  label={
                    editFields.hasLivestream
                      ? dictionary.enabled[this.context]
                      : dictionary.disabled[this.context]
                  }
                />
              </Form.Group>
              <Form.Group controlId={'edit_talk.livestreamURL'}>
                <Form.Label>
                  {dictionary.livestream_url[this.context]}
                </Form.Label>
                <Form.Control
                  type={'url'}
                  value={editFields.livestreamURL}
                  name={'livestreamURL'}
                  onChange={handleChange}
                  disabled={!editFields.hasLivestream}
                  className={styles.border}
                />
                {this.state.error.livestreamURL ? (
                  <Form.Text className={'text-danger'}>
                    {this.errorMessages.livestreamURL}
                  </Form.Text>
                ) : null}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHide} variant={'danger'}>
              {dictionary.cancel[this.context]}
            </Button>
            <Button onClick={this.handleEditSubmission} variant={'success'}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleEditSubmission = () => {
    let error = false;
    const editFields = this.state.editFields;

    Object.keys(editFields).map(key => {
      if (key !== 'hasLivestream') {
        editFields[key] = editFields[key].trim();
      }
    });

    if (editFields.title.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          title: true
        }
      });
      this.errorMessages.title = 'Field title can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          title: false
        }
      });
      this.errorMessages.title = '';
    }
    if (editFields.description.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          description: true
        }
      });
      this.errorMessages.description = 'Field description can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          description: false
        }
      });
      this.errorMessages.description = '';
    }
    if (editFields.dateStart.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          dateStart: true
        }
      });
      this.errorMessages.dateStart = 'Field date start can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          dateStart: false
        }
      });
      this.errorMessages.dateStart = '';
    }
    if (editFields.dateEnd.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          dateEnd: true
        }
      });
      this.errorMessages.dateEnd = 'Field date end can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          dateEnd: false
        }
      });
      this.errorMessages.dateEnd = '';
    }
    if (editFields.local.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          local: true
        }
      });
      this.errorMessages.local = 'Field local can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          local: false
        }
      });
      this.errorMessages.local = '';
    }

    Object.entries(editFields).forEach(entry => {
      if (entry[0] !== 'hasLivestream') {
        if (!this.validateInput(entry[0], entry[1])) {
          error = true;
        }
      }
    });

    if (error) {
      return;
    }

    const formData = new FormData();
    formData.append('title', editFields.title);
    formData.append('description', editFields.description);
    formData.append('dateEnd', editFields.dateEnd);
    formData.append('dateStart', editFields.dateStart);
    formData.append('local', editFields.local);
    formData.append('livestreamURL', editFields.livestreamURL);

    axiosInstance
      .put(`/talk/${this.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        this.setState({
          editFormOpen: false,
          talk: {
            ...editFields
          }
        });
      })
      .catch(err => console.log(err.response.data.message));
  };

  private renderArchiveForm = () => {
    const isArchived = this.state.isArchived;
    const handleShow = () => {
      this.setState({
        archiveModalOpen: true
      });
    };
    const handleHide = () => {
      this.setState({
        archiveModalOpen: false
      });
    };

    return (
      <>
        <ListGroup.Item onClick={handleShow}>
          <i className={'fas fa-archive mr-2'} />
          {this.state.isArchived
            ? dictionary.restore_talk[this.context]
            : dictionary.archive_talk[this.context]}
        </ListGroup.Item>

        <Modal
          show={this.state.archiveModalOpen}
          onHide={handleHide}
          centered={true}
        >
          <Modal.Header closeButton={true}>
            <Modal.Title>
              {isArchived
                ? dictionary.restore_talk[this.context]
                : dictionary.archive_talk[this.context]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            className={
              'd-flex flex-column justify-content-start align-items-start'
            }
          >
            <strong className={'text-danger'}>
              {isArchived
                ? dictionary.confirm_restore[this.context]
                : dictionary.confirm_archive[this.context]}
            </strong>
            <small>
              {isArchived
                ? dictionary.restore_description[this.context]
                : dictionary.archive_description[this.context]}
            </small>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHide} variant={'secondary'}>
              {dictionary.cancel[this.context]}
            </Button>
            <Button
              onClick={this.handleArchiveSubmission}
              variant={isArchived ? 'success' : 'danger'}
            >
              {isArchived
                ? dictionary.restore[this.context]
                : dictionary.archive[this.context]}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleArchiveSubmission = () => {
    axiosInstance
      .put(`/talk/${this.id}/archive`, {
        value: !this.state.isArchived
      })
      .then(() => {
        this.setState({
          archiveModalOpen: false,
          isArchived: !this.state.isArchived
        });
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
  };

  private renderHideForm = () => {
    const isHidden = this.state.isHidden;
    const handleShow = () => {
      this.setState({
        hideModalOpen: true
      });
    };
    const handleHide = () => {
      this.setState({
        hideModalOpen: false
      });
    };

    return (
      <>
        <ListGroup.Item onClick={handleShow}>
          <i className={'fas fa-trash mr-2'} />
          {this.state.isHidden
            ? dictionary.reopen_talk[this.context]
            : dictionary.hide_talk[this.context]}
        </ListGroup.Item>

        <Modal
          show={this.state.hideModalOpen}
          onHide={handleHide}
          centered={true}
        >
          <Modal.Header closeButton={true}>
            <Modal.Title>
              {isHidden
                ? dictionary.reopen_talk[this.context]
                : dictionary.hide_talk[this.context]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            className={
              'd-flex flex-column justify-content-start align-items-start'
            }
          >
            <strong className={'text-danger'}>
              {isHidden
                ? dictionary.confirm_open[this.context]
                : dictionary.confirm_hide[this.context]}
            </strong>
            <small>
              {isHidden
                ? dictionary.open_description[this.context]
                : dictionary.hide_description[this.context]}
            </small>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHide} variant={'secondary'}>
              {dictionary.cancel[this.context]}
            </Button>
            <Button
              onClick={this.handleHideSubmission}
              variant={isHidden ? 'success' : 'danger'}
            >
              {isHidden
                ? dictionary.open[this.context]
                : dictionary.hide[this.context]}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handleHideSubmission = () => {
    axiosInstance
      .put(`/talk/${this.id}/hide`, {
        value: !this.state.isHidden
      })
      .then(() => {
        this.setState({
          hideModalOpen: false,
          isHidden: !this.state.isHidden
        });
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
  };

  private renderPostForm = () => {
    const postFields = this.state.postFields;
    const handleHide = () => {
      this.setState({
        postFields: {
          description: '',
          files: {
            documents: [],
            images: [],
            videos: []
          },
          tag: '',
          tags: [],
          title: ''
        },
        postFormOpen: false
      });
    };
    const handleShow = () => {
      this.setState({
        postFormOpen: true
      });
    };
    const handleChange = event => {
      this.setState({
        postFields: {
          ...postFields,
          [event.target.name]: event.target.value
        }
      });
    };
    const handleKeyUp = event => {
      if (event.key === 'Enter') {
        const tags = this.state.postFields.tags;
        const tag = event.target.value.trim();

        if (tag.length > 0 && !tags.includes(tag)) {
          tags.unshift(tag);
        }
        this.setState({
          postFields: {
            ...this.state.postFields,
            tag: '',
            tags
          }
        });
      }
    };
    const handleTagRemove = value => {
      const tags = this.state.postFields.tags.filter(tag => tag !== value);

      this.setState({
        postFields: {
          ...this.state.postFields,
          tags
        }
      });
    };
    const handleFileChange = event => {
      const files = event.target.files as FileList;
      const images: File[] = [];
      const videos: File[] = [];
      const documents: File[] = [];

      Array.from(files).forEach(file => {
        if (file.type.startsWith('image')) {
          images.push(file);
        } else if (file.type.startsWith('video')) {
          videos.push(file);
        } else {
          documents.push(file);
        }
      });

      this.setState({
        postFields: {
          ...this.state.postFields,
          files: {
            documents,
            images,
            videos
          }
        }
      });
    };

    return (
      <>
        <ListGroup.Item
          onClick={handleShow}
          className={classNames('pt-2 pb-2 pl-3 pr-3', styles.button)}
        >
          <i className={'fas fa-plus mr-2'} />
          {dictionary.create_new_post[this.context]}
        </ListGroup.Item>

        <Modal show={this.state.postFormOpen} onHide={handleHide}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{dictionary.new_talk_post[this.context]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId={'create_post.title'}>
                <Form.Label>{dictionary.title[this.context]}</Form.Label>
                <Form.Control
                  type={'text'}
                  placeholder={dictionary.insert_title[this.context]}
                  value={postFields.title}
                  name={'title'}
                  onChange={handleChange}
                  className={styles.border}
                />
                {this.state.error.title ? (
                  <Form.Text className={'text-danger'}>
                    {this.errorMessages.title}
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId={'create_post.description'}>
                <Form.Label>{dictionary.description[this.context]}</Form.Label>
                <Form.Control
                  as={'textarea'}
                  rows={10}
                  placeholder={dictionary.description_placeholder[this.context]}
                  value={postFields.description}
                  name={'description'}
                  onChange={handleChange}
                  className={classNames('overflow-auto', styles.border)}
                  style={{ height: '20rem' }}
                />
                {this.state.error.description ? (
                  <Form.Text className={'text-danger'}>
                    {this.errorMessages.description}
                  </Form.Text>
                ) : null}
              </Form.Group>
              <Form.Group controlId={'create_post.tags'}>
                <Form.Label>{dictionary.tags[this.context]}</Form.Label>
                <Form.Control
                  type={'text'}
                  placeholder={dictionary.tag_placeholder[this.context]}
                  value={this.state.postFields.tag}
                  name={'tag'}
                  onChange={handleChange}
                  onKeyUp={handleKeyUp}
                  className={styles.border}
                  list={'existing_tags'}
                />
                <datalist id={'existing_tags'}>
                  {this.tags.map((tag, index) => (
                    <option key={`tag_${tag.id}`} value={tag.name}>
                      {index}
                    </option>
                  ))}
                </datalist>
                {this.state.postFields.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    id={index.toString()}
                    value={tag}
                    onRemove={handleTagRemove}
                    className={'mt-2 mr-1'}
                  />
                ))}
              </Form.Group>
              <Form.Group>
                <Form.Label>{dictionary.files[this.context]}</Form.Label>
                <Form.Control
                  type={'file'}
                  multiple={true}
                  name={'files'}
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHide} variant={'danger'}>
              {dictionary.cancel[this.context]}
            </Button>
            <Button onClick={this.handlePostSubmission} variant={'success'}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private handlePostSubmission = () => {
    let error = false;
    const postFields = this.state.postFields;

    Object.keys(postFields).map(key => {
      if (key === 'title' || key === 'description') {
        postFields[key] = postFields[key].trim();
      } else if (key === 'tags') {
        postFields[key] = postFields[key].map(tag => tag.trim());
      }
    });

    if (postFields.title.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          title: true
        }
      });
      this.errorMessages.title = 'Field title can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          title: false
        }
      });
      this.errorMessages.title = '';
    }
    if (postFields.description.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          description: true
        }
      });
      this.errorMessages.description = 'Field description can not be empty!';
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          description: false
        }
      });
      this.errorMessages.description = '';
    }

    Object.entries(postFields).forEach(entry => {
      if (entry[0] !== 'files' && entry[0] !== 'tag') {
        if (!this.validateInput(entry[0], entry[1])) {
          error = true;
        }
      }
    });

    if (error) {
      return;
    }

    const formData = new FormData();
    formData.append('title', postFields.title);
    formData.append('text', postFields.description);
    formData.append('visibility', 'public');
    formData.append('talk', this.id.toString());
    postFields.files.images.forEach((image, index) =>
      formData.append(`images[${index}]`, image)
    );
    postFields.files.videos.forEach((video, index) =>
      formData.append(`videos[${index}]`, video)
    );
    postFields.files.documents.forEach((document, index) =>
      formData.append(`docs[${index}]`, document)
    );
    postFields.tags.forEach((tag, index) =>
      formData.append(`tags[${index}]`, tag)
    );

    axiosInstance
      .post(`/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        axiosInstance
          .get(`/post/${response.data.post}`)
          .then(post => {
            this.setState({
              postFormOpen: false,
              posts: [post.data, ...this.state.posts]
            });
          })
          .catch(err => {
            console.log(`Error retrieving new post. Error: ${err}`);
          });
      })
      .catch(err => console.log(err.response.data.message));
  };

  private validateInput = (type, value) => {
    let re;
    let message;

    switch (type) {
      case 'answer':
        re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
        message =
          "Invalid field. Answer can only contain alphanumerical characters, -, !, ?, %, @, #, '.', ','";
        break;
      case 'correctAnswer':
        re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
        message =
          "Invalid field. Answer can only contain alphanumerical characters, -, !, ?, %, @, #, '.', ','";
        break;
      case 'dateEnd':
        re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        message =
          'Invalid field. Date must have the format DD-MM-YYYYThh:mm, e.g., 01-01-2019T00:00';
        break;
      case 'dateStart':
        re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        message =
          'Invalid filed. Date must have the format DD-MM-YYYYThh:mm, e.g., 01-01-2019T00:00';
        break;
      case 'description':
        re = /^[\-!?%@#)( ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.)(\w\u00C0-\u017F]*$/;
        message =
          "Invalid field. Description can only contain alphanumerical characters, -, !, ?, %, @, #, '.', ',', ), (";
        break;
      case 'local':
        re = /^([\w\u00C0-\u017F]+[ \-,.\w\u00C0-\u017F]*){2,}$/;
        message =
          "Invalid field. Local can only contain alphanumerical characters, -, ',', '.' and must have at least 2 characters";
        break;
      case 'options':
        re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
        message =
          "Invalid field. Option can only contain alphanumerical characters, -, !, ?, %, @, #, '.', ','";
        break;
      case 'points':
        re = /^\d{1,2}$/;
        message =
          'Invalid field. Points must be a positive integer with at maximum 2 digits';
        break;
      case 'question':
        re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
        message =
          "Invalid field. Question can only contain alphanumerical characters, -, !, ?, %, @, #, '.', ','";
        break;
      case 'tags':
        re = /^([\s\-]*[\w\u00C0-\u017F]+[\s\-]*){2,150}$/;
        message =
          'Invalid field. Tag can only contain alphanumerical characters or - and must have 2 to 150 characters';
        break;
      case 'title':
        re = /^([\s\-]*[\w\u00C0-\u017F]+[\s\-]*){2,150}$/;
        message =
          'Invalid field. Title can only contain alphanumerical characters or - and must have 2 to 150 characters';
        break;
      case 'type':
        re = /^(MCQ|POST|CMT)$/;
        message = "Invalid field. Type must be one of 'MCQ', 'POST', or 'CMT'";
        break;
      case 'livestreamURL':
        re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\\x{00a1}\-\\x{ffff}0-9]+-?)*[a-z\\x{00a1}\-\\x{ffff}0-9]+)(?:\.(?:[a-z\\x{00a1}\-\\x{ffff}0-9]+-?)*[a-z\\x{00a1}\-\\x{ffff}0-9]+)*(?:\.(?:[a-z\\x{00a1}\-\\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$|^$/;
        message = "Invalid field. Livestream's url must be an embed link";
        break;
    }

    if (type === 'options' || type === 'tags') {
      for (const entry of value) {
        if (!re.test(entry)) {
          this.setState({
            error: {
              ...this.state.error,
              [type]: true
            }
          });
          this.errorMessages[type] = message;
          return false;
        }
      }
      this.errorMessages[type] = '';
      return true;
    }

    if (!re.test(value.toString())) {
      this.setState({
        error: {
          ...this.state.error,
          [type]: true
        }
      });
      this.errorMessages[type] = message;
      return false;
    } else {
      this.setState({
        error: {
          ...this.state.error,
          [type]: false
        }
      });
      this.errorMessages[type] = '';
      return true;
    }
  };
}

export default Talk;
