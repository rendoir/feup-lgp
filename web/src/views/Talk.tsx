import classNames from 'classnames';
import moment from 'moment';
import React, { PureComponent } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import openSocket from 'socket.io-client';
import { Avatar, AvatarSelector, Select } from '../components';
import InputNext from '../components/InputNext/InputNext';
import Post from '../components/Post/Post';
import Switcher from '../components/Switcher/Switcher';
import Tag from '../components/Tags/Tag';
import styles from '../styles/Feed.module.css';
import { getApiURL } from '../utils/apiURL';
import AuthHelperMethods from '../utils/AuthHelperMethods';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';

export type User = {
  avatar: string | undefined;
  id: number;
  name: string;
};

export type Message = {
  id: number;
  user: User;
  text: string;
  date: string;
};

export type Props = {
  match: {
    params: {
      id: number;
    };
  };
  user: any;
};

export type State = {
  activeIndex: number;
  adminCardOpen: boolean;
  archiveModalOpen: boolean;
  challenges: any[];
  challengesCardOpen: boolean;
  challengeFields: {
    answer: string | undefined;
    challengetype: 'question_options' | 'create_post' | 'comment_post';
    correctAnswer: string | undefined;
    dateEnd: string;
    dateStart: string;
    description: string;
    isComplete: boolean;
    isCorrect: boolean;
    options: string[];
    points: number;
    post: string | undefined;
    question: string | undefined;
    title: string;
    userAnswer: string;
  };
  challengeFormOpen: boolean;
  chatCardOpen: boolean;
  chatFields: {
    message: string;
    messageList: Message[];
  };
  editFields: {
    avatar?: File;
    avatar_str?: string;
    title: string;
    dateEnd: string;
    dateStart: string;
    description: string;
    hasLivestream: string;
    livestreamURL: string;
    local: string;
    privacy: string;
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
  errorFetching: boolean;
  errorFetchingMessage: string;
  hideModalOpen: boolean;
  infoCardOpen: boolean;
  inviteFields: {
    email: string;
    error: boolean;
    results: any[];
    selected: any[];
    success: boolean;
    userSubs: any[];
  };
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
    avatar?: string;
    avatar_mimeType?: string;
    avatar_src?: string;
    title: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    hasLivestream: string;
    livestreamURL: string;
    local: string;
    privacy: string;
  };
  userPoints: number;
};

class Talk extends PureComponent<Props, State> {
  public static contextType = LanguageContext;
  private readonly id: number;
  private readonly dateOptions: object;
  private readonly postDateOptions: object;
  private readonly socketIo: SocketIOClient.Socket;
  private readonly ioNamespace: number;
  private conferenceId: number | undefined;
  private conferenceTitle: string | undefined;
  private owner: boolean | undefined;
  private ownerId: number | undefined;
  private ownerName: string | undefined;
  private privacy: string | undefined;
  private user: User;
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
  private messageIndex: number;
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

    this.messageIndex = 0;
    this.ioNamespace = this.id;
    this.socketIo = openSocket(getApiURL(''));
    this.socketIo.emit('groupConnect', this.ioNamespace);
    setTimeout(() => {
      const localSocketIo = openSocket(getApiURL(`/${this.ioNamespace}`));
      localSocketIo.on('message', (msg: Message) => {
        msg.id = ++this.messageIndex;
        this.setState({
          chatFields: {
            ...this.state.chatFields,
            messageList: [...this.state.chatFields.messageList, msg]
          }
        });
      });
    }, 1500);

    this.user = {
      avatar: undefined,
      id: 0,
      name: ''
    };

    this.apiGetTalk = this.apiGetTalk.bind(this);
    this.apiGetSubs = this.apiGetSubs.bind(this);
    this.apiGetUser = this.apiGetUser.bind(this);

    this.state = {
      activeIndex: 0,
      adminCardOpen: false,
      archiveModalOpen: false,
      challengeFields: {
        answer: undefined,
        challengetype: 'question_options',
        correctAnswer: undefined,
        dateEnd: '',
        dateStart: '',
        description: '',
        isComplete: false,
        isCorrect: false,
        options: [],
        points: 0,
        post: undefined,
        question: undefined,
        title: '',
        userAnswer: ''
      },
      challengeFormOpen: false,
      challenges: [],
      challengesCardOpen: false,
      chatCardOpen: true,
      chatFields: {
        message: '',
        messageList: []
      },
      editFields: {
        avatar: undefined,
        avatar_str: '',
        dateEnd: '',
        dateStart: '',
        description: '',
        hasLivestream: 'false',
        livestreamURL: '',
        local: '',
        privacy: 'public',
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
      errorFetching: false,
      errorFetchingMessage: '',
      hideModalOpen: false,
      infoCardOpen: true,
      inviteFields: {
        email: '',
        error: false,
        results: [],
        selected: [],
        success: false,
        userSubs: []
      },
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
        avatar: '',
        avatar_mimeType: '',
        avatar_src: '',
        dateEnd: '',
        dateStart: '',
        description: '',
        hasLivestream: 'false',
        livestreamURL: '',
        local: '',
        privacy: 'public',
        title: ''
      },
      userPoints: 0
    };
  }

  public async componentDidMount() {
    await this.apiGetTalk();
    await this.apiGetUser();
    if (this.owner) {
      await this.apiGetSubs();
    }
  }

  public render() {
    return (
      <div className={'container-fluid mt-3 col-lg-12'}>
        <div className={'row'}>{this.renderBreadcrumb()}</div>
        <div className={'row'}>
          <div className={'col-lg-3 order-lg-1'}>
            {this.renderInfoCard()}
            {this.owner ? this.renderAdminCard() : null}
            {!this.state.errorFetching ? this.renderChallengesCard() : null}
          </div>
          <div className={'col-lg-9 order-lg-2'}>
            {this.state.errorFetching ? (
              this.renderErrorFetchingAlert()
            ) : this.state.joined || this.owner ? (
              <div className={'row'}>
                {this.state.inviteFields.error ||
                this.state.inviteFields.success ? (
                  <div className={'col-lg-12'}>{this.renderInviteAlert()}</div>
                ) : null}
                <div className={'col-lg-5 order-lg-2'}>{this.renderChat()}</div>
                <div className={'col-lg-7 order-lg-1'}>
                  {this.state.talk.hasLivestream === 'true'
                    ? this.renderLivestream()
                    : null}
                  {this.renderPosts()}
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

  /**
   * Data requests
   */

  private async apiGetTalk() {
    await axiosInstance
      .get(`/talk/${this.id}`)
      .then(res => {
        const talk = res.data.talk;
        const posts = res.data.posts;
        const challenges = res.data.challenges;
        const joined = res.data.isParticipating;
        const tags = res.data.tags;
        const userPoints = Number(res.data.userPoints);

        this.conferenceId = talk.conference_id;
        this.conferenceTitle = talk.conference_title;
        this.ownerId = Number(talk.user_id);
        this.ownerName = talk.user_name;
        this.owner = this.ownerId === Number(this.auth.getUserPayload().id);
        this.privacy = talk.privacy;
        this.tags = tags;

        this.apiGetTalkAvatar(talk);

        this.setState({
          challengeFields: {
            ...this.state.challengeFields,
            post: posts[0] ? posts[0].id : 0
          },
          challenges,
          editFields: {
            avatar: undefined,
            avatar_str: talk.avatar_src,
            dateEnd: talk.dateend,
            dateStart: talk.datestart,
            description: talk.about,
            hasLivestream: String(talk.livestream_url !== ''),
            livestreamURL: talk.livestream_url,
            local: talk.local,
            privacy: talk.privacy,
            title: talk.title
          },
          errorFetching: false,
          errorFetchingMessage: '',
          isArchived: talk.archived,
          isHidden: talk.hidden,
          joined,
          posts,
          talk: {
            avatar: talk.avatar,
            avatar_mimeType: talk.avatar_mimeType,
            avatar_src: talk.avatar_src,
            dateEnd: talk.dateend,
            dateStart: talk.datestart,
            description: talk.about,
            hasLivestream: String(talk.livestream_url !== ''),
            livestreamURL: talk.livestream_url,
            local: talk.local,
            privacy: talk.privacy,
            title: talk.title
          },
          userPoints
        });
      })
      .catch(error => {
        this.setState({
          errorFetching: true,
          errorFetchingMessage: error.response.data.message
        });
      });
  }

  private apiGetTalkAvatar(talk: any) {
    if (
      talk.avatar === undefined ||
      talk.avatar === null ||
      talk.avatar === ''
    ) {
      return;
    }

    axiosInstance
      .get(`/talk/${this.id}/avatar/${talk.avatar}`, {
        responseType: 'arraybuffer'
      })
      .then(res => {
        const src =
          'data:' +
          talk.avatar_mimeType +
          ';base64, ' +
          new Buffer(res.data, 'binary').toString('base64');

        talk.avatar_src = src;
        this.setState({ talk });
        this.forceUpdate();
      })
      .catch(() => {
        console.log('Failed to get talk avatar');
      });
  }

  private async apiGetSubs() {
    await axiosInstance
      .get(`/talk/${this.id}/uninvited_users_info`)
      .then(res => {
        const userSubs = res.data.uninvitedUsers;
        this.setState({
          inviteFields: {
            ...this.state.inviteFields,
            userSubs
          }
        });
      })
      .catch(error => console.log(error.response.data.message));
  }

  private async apiGetUser() {
    await axiosInstance
      .get(`/users/${this.auth.getUserPayload().id}`)
      .then(async res => {
        const user = res.data.user;
        if (
          res.data.user.avatar !== null &&
          res.data.user.avatar !== undefined &&
          res.data.user.avatar !== ''
        ) {
          await axiosInstance
            .get(`/users/${user.id}/avatar/${user.avatar}`, {
              responseType: 'arraybuffer'
            })
            // tslint:disable-next-line: no-shadowed-variable
            .then(res => {
              const src =
                'data:' +
                user.avatar_mimeType +
                ';base64, ' +
                new Buffer(res.data, 'binary').toString('base64');

              this.user = {
                avatar: src,
                id: Number(user.id),
                name: `${user.first_name} ${user.last_name}`
              };
            })
            .catch(() => {
              console.log('Failed to get user avatar');
            });
        } else {
          this.user = {
            avatar: '',
            id: Number(user.id),
            name: `${user.first_name} ${user.last_name}`
          };
        }
      })
      .catch(error => console.log(error.response.data.message));
  }

  /**
   * Components
   */

  private renderJoinAlert = () => {
    return (
      <Alert variant={'danger'}>
        <p>{dictionary.user_not_joined[this.context]}.</p>
      </Alert>
    );
  };

  private renderInviteAlert = () => {
    const handleClose = () => {
      this.setState({
        inviteFields: {
          ...this.state.inviteFields,
          error: false,
          success: false
        }
      });
    };

    return (
      <Alert
        variant={
          this.state.inviteFields.error
            ? 'danger'
            : this.state.inviteFields.success
            ? 'success'
            : undefined
        }
        dismissible={true}
        onClose={handleClose}
      >
        <p>
          {this.state.inviteFields.error
            ? dictionary.invite_all_subs_error[this.context]
            : dictionary.invite_all_subs_done[this.context]}
        </p>
      </Alert>
    );
  };

  private renderErrorFetchingAlert = () => {
    return (
      <Alert variant={'danger'}>
        <p>{this.state.errorFetchingMessage}.</p>
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
    const handleClick = () =>
      this.setState({ infoCardOpen: !this.state.infoCardOpen });

    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header
          className={styles.header + ' pointer'}
          onClick={handleClick}
          aria-controls={'talk_info_card'}
          aria-expanded={this.state.infoCardOpen}
        >
          <div
            className={'d-flex justify-content-between align-items-center mb-1'}
          >
            <div className={'d-flex align-items-center'}>
              <Avatar image={talk.avatar_src} title={talk.title} /> &nbsp;
              <strong>{talk.title}</strong>
            </div>
            {this.renderTalkStatus()}
          </div>
        </Card.Header>
        <Collapse in={this.state.infoCardOpen}>
          <Card.Body id={'talk_info_card'}>
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
        </Collapse>
        {this.owner || this.state.errorFetching ? null : (
          <Card.Footer>{this.renderJoin()}</Card.Footer>
        )}
      </Card>
    );
  };

  private renderAdminCard = () => {
    const handleClick = () =>
      this.setState({ adminCardOpen: !this.state.adminCardOpen });

    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header
          className={styles.header + ' pointer'}
          onClick={handleClick}
          aria-controls={'talk_admin_card'}
          aria-expanded={this.state.adminCardOpen}
        >
          <Card.Title className={'mb-0'}>
            {dictionary.admin_area[this.context]}
          </Card.Title>
        </Card.Header>
        <Collapse in={this.state.adminCardOpen}>
          <Card.Body id={'talk_admin_card'}>
            <ListGroup variant={'flush'}>
              {this.renderInviteForm()}
              {this.renderChallengeForm()}
              {this.renderEditForm()}
              {this.renderArchiveForm()}
              {this.renderHideForm()}
            </ListGroup>
          </Card.Body>
        </Collapse>
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
    const handleCollapse = () =>
      this.setState({ challengesCardOpen: !this.state.challengesCardOpen });

    const handleSelect = eventKey => this.setState({ activeIndex: eventKey });

    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header
          className={classNames(
            'd-flex flex-row justify-content-between align-items-center pointer',
            styles.header
          )}
          onClick={handleCollapse}
          aria-controls={'talk_challenges_card'}
          aria-expanded={this.state.challengesCardOpen}
        >
          <Card.Title className={'mb-0'}>
            {dictionary.challenge_conference[this.context]}
          </Card.Title>
          <Card.Title className={'mb-0'}>
            {dictionary.points[this.context]}: {this.state.userPoints}
          </Card.Title>
        </Card.Header>
        <Collapse in={this.state.challengesCardOpen}>
          <Card.Body
            className={'p-1'}
            style={{ height: '39rem' }}
            id={'talk_challenges_card'}
          >
            {this.state.challenges.length > 0 ? (
              <Carousel
                indicators={false}
                controls={this.state.challenges.length > 1}
                nextIcon={nextIcon}
                prevIcon={prevIcon}
                interval={0}
                className={'h-100'}
                activeIndex={this.state.activeIndex}
                onSelect={handleSelect}
              >
                {this.state.challenges.map(challenge => {
                  const cardBackgroundColor = challenge.isComplete
                    ? challenge.isCorrect
                      ? styles.correctAnswer
                      : styles.wrongAnswer
                    : undefined;
                  const challengeType = () => {
                    if (challenge.challengetype === 'question_options') {
                      return 'Multiple Choice Question';
                    } else if (challenge.challengetype === 'create_post') {
                      return 'Create post';
                    } else {
                      return 'Comment on a post';
                    }
                  };
                  const handleClick = option => {
                    if (
                      challenge.isComplete ||
                      new Date(challenge.dateEnd) < new Date()
                    ) {
                      return;
                    }

                    axiosInstance
                      .post(`/talk/${this.id}/challenge/solve`, {
                        author: this.auth.getUserPayload().id,
                        challenge: challenge.id,
                        challenge_answer: option,
                        completion: option === challenge.correctAnswer
                      })
                      .then(() => {
                        const challenges = this.state.challenges;
                        let points = 0;
                        challenges.forEach(ch => {
                          if (ch.id === challenge.id) {
                            challenge.userAnswer = option;
                            challenge.isCorrect =
                              option === challenge.correctAnswer;
                            challenge.isComplete = true;
                            points = challenge.isCorrect ? challenge.points : 0;
                          }
                        });

                        let activeIndex = this.state.activeIndex;
                        let length = this.state.challenges.length - 1;
                        length = length < 0 ? 0 : length;
                        activeIndex =
                          activeIndex + 1 > length ? 0 : activeIndex + 1;

                        this.setState({
                          activeIndex,
                          challenges,
                          userPoints:
                            Number(this.state.userPoints) + Number(points)
                        });
                        this.forceUpdate();
                      })
                      .catch(error => console.log(error.response.data.message));
                  };
                  return (
                    <Carousel.Item key={challenge.id} className={'h-100'}>
                      <Card border={'light'} className={'px-5 w-100'}>
                        <Card.Header className={cardBackgroundColor}>
                          <Card.Title className={'mb-0'}>
                            {challenge.title}
                          </Card.Title>
                        </Card.Header>
                        <Card.Body>
                          {new Date(challenge.dateend) < new Date() ? (
                            <Alert variant={'danger'}>
                              {dictionary.finished[this.context]}
                            </Alert>
                          ) : null}
                          <Card.Subtitle className={'w-100 mb-1'}>
                            {dictionary.description[this.context]}
                          </Card.Subtitle>
                          <p className={'w-100 mb-3'}>
                            {challenge.description}
                          </p>
                          <Card.Subtitle className={'w-100 mb-1'}>
                            {dictionary.challenge_type[this.context]}
                          </Card.Subtitle>
                          <p className={'w-100 mb-3'}>{challengeType()}</p>
                          {challenge.challengetype === 'comment_post' ? (
                            <>
                              <hr />
                              <Card.Subtitle className={'w-100 mb-1'}>
                                Post to comment
                              </Card.Subtitle>
                              {this.state.posts.map(post => {
                                if (post.id === challenge.post) {
                                  return (
                                    <a
                                      href={`#${post.id}`}
                                      className={classNames(
                                        styles.link,
                                        'w-100'
                                      )}
                                    >
                                      {post.title}
                                    </a>
                                  );
                                }
                              })}
                            </>
                          ) : null}
                          {challenge.challengetype === 'question_options' ? (
                            <>
                              <hr />
                              <Card.Subtitle className={'w-100 mb-1'}>
                                {dictionary.question[this.context]}
                              </Card.Subtitle>
                              <p className={'w-100 mb-3'}>
                                {challenge.question}
                              </p>
                              <Card.Subtitle className={'w-100 mb-3'}>
                                {dictionary.options[this.context]}
                              </Card.Subtitle>
                              <ListGroup variant={'flush'}>
                                {challenge.options.map((option, index) => {
                                  const selected = challenge.isComplete
                                    ? challenge.userAnswer === option
                                      ? option === challenge.correctAnswer
                                        ? styles.correctAnswer
                                        : styles.wrongAnswer
                                      : undefined
                                    : undefined;

                                  return (
                                    <ListGroup.Item
                                      key={index}
                                      className={selected}
                                      onClick={() => handleClick(option)}
                                    >
                                      {option}
                                    </ListGroup.Item>
                                  );
                                })}
                              </ListGroup>
                            </>
                          ) : null}
                        </Card.Body>
                        <Card.Footer
                          className={
                            'd-flex flex-row justify-content-between align-items-center'
                          }
                        >
                          <Card.Subtitle className={'mt-0'}>
                            {dictionary.points[this.context]}
                          </Card.Subtitle>
                          <div>{challenge.points}</div>
                        </Card.Footer>
                      </Card>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            ) : null}
          </Card.Body>
        </Collapse>
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
              avatar={post.avatar}
              avatar_mimeType={post.avatar_mimeType}
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
    const handleChange = event =>
      this.setState({
        chatFields: {
          ...this.state.chatFields,
          message: event.target.value
        }
      });
    const handleKeyUp = event => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    };
    const handleSubmit = () => {
      if (this.state.chatFields.message.length === 0) {
        return;
      }

      const msg = {
        date: new Date(),
        text: this.state.chatFields.message,
        user: this.user
      };
      this.socketIo.emit('message', {
        msg,
        namespace: this.ioNamespace
      });
      this.setState({
        chatFields: {
          ...this.state.chatFields,
          message: ''
        }
      });
    };
    const handleClick = () =>
      this.setState({ chatCardOpen: !this.state.chatCardOpen });

    return (
      <Card className={classNames('mb-3', styles.border)}>
        <Card.Header
          className={styles.header + ' pointer'}
          onClick={handleClick}
          aria-controls={'talk_chat_card'}
          aria-expanded={this.state.chatCardOpen}
        >
          Chat
        </Card.Header>
        <Collapse in={this.state.chatCardOpen}>
          <div id={'talk_chat_card'}>
            <Card.Body style={{ height: '20rem' }} className={'overflow-auto'}>
              {this.state.chatFields.messageList.map(msg => (
                <div
                  key={msg.id}
                  className={
                    this.user.id === msg.user.id
                      ? 'd-flex flex-row mb-2 justify-content-end'
                      : 'd-flex flex-row mb-2 justify-content-start'
                  }
                >
                  <div
                    className={
                      this.user.id === msg.user.id
                        ? 'order-last ml-2'
                        : 'order-first mr-2'
                    }
                  >
                    <Avatar image={msg.user.avatar} title={msg.user.name} />
                  </div>
                  <div
                    className={
                      this.user.id === msg.user.id ? 'order-fist' : 'order-last'
                    }
                  >
                    <p
                      className={`
                  d-flex text-muted flex-row text-capitalize
                  ${
                    this.user.id === msg.user.id
                      ? 'justify-content-end'
                      : 'justify-content-start'
                  }
                  `}
                    >
                      {msg.user.name.toLowerCase()}
                    </p>
                    <Card
                      className={
                        this.user.id === msg.user.id
                          ? styles.header
                          : 'bg-light'
                      }
                    >
                      <Card.Body
                        style={{ maxWidth: '22.5rem' }}
                        className={'pb-1 pt-0'}
                      >
                        <Card.Text>{msg.text}</Card.Text>
                      </Card.Body>
                    </Card>
                    <small className={'text-muted'}>
                      {moment(msg.date).fromNow()}
                    </small>
                  </div>
                </div>
              ))}
            </Card.Body>
            <Card.Footer className={'row m-0 p-1'}>
              <div className={'col w-75 m-0 p-0'}>
                <textarea
                  className={'w-100'}
                  rows={3}
                  maxLength={250}
                  minLength={1}
                  value={this.state.chatFields.message}
                  onChange={handleChange}
                  onKeyUp={handleKeyUp}
                  disabled={this.state.isHidden || this.state.isArchived}
                />
              </div>
              <div
                className={
                  'col-3 w-25 justify-content-center d-flex align-items-center'
                }
              >
                <Button
                  className={classNames('w-100', styles.button)}
                  disabled={this.state.isArchived || this.state.isHidden}
                  onClick={handleSubmit}
                >
                  <i className={'fas fa-paper-plane mr-2 h-100'} />
                </Button>
              </div>
            </Card.Footer>
          </div>
        </Collapse>
      </Card>
    );
  };

  /**
   * Forms
   */

  private renderInviteForm = () => {
    const handleOpen = () => this.setState({ inviteModalOpen: true });
    const handleHide = () =>
      this.setState({
        inviteFields: {
          email: '',
          error: false,
          results: [],
          selected: [],
          success: false,
          userSubs: this.state.inviteFields.userSubs
        },
        inviteModalOpen: false
      });
    const handleChange = event =>
      this.setState({
        inviteFields: {
          ...this.state.inviteFields,
          email: event.target.value
        }
      });
    const handleSearch = () => {
      const email = this.state.inviteFields.email.trim();

      if (email.length === 0) {
        return;
      }

      axiosInstance
        .get('/search/user/email', {
          params: {
            email
          }
        })
        .then(res => {
          const results: any[] = [];
          const users = res.data.users;

          users.forEach(user => {
            results.push(user);
          });

          this.setState({
            inviteFields: {
              ...this.state.inviteFields,
              results
            }
          });
        })
        .catch(error => {
          console.log(error.response.data.message);
        });
    };
    const handleClick = userId => {
      const results = this.state.inviteFields.results;
      const userSubs = this.state.inviteFields.userSubs;
      const users = new Set([
        ...results.map(r => r.id),
        ...userSubs.map(u => u.id)
      ]);
      let selected = this.state.inviteFields.selected;

      if (users.size > 0) {
        users.forEach(id => {
          if (id === userId) {
            if (selected.includes(id)) {
              selected = selected.filter(i => i !== userId);
            } else {
              selected.push(userId);
            }
          }
        });
      }

      this.setState({
        inviteFields: {
          ...this.state.inviteFields,
          selected
        }
      });
    };

    return (
      <>
        <ListGroup.Item
          className="pointer"
          onClick={handleOpen}
          disabled={this.state.isArchived || this.state.isHidden}
        >
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
                <InputGroup>
                  <FormLabel className={'w-100'}>
                    {dictionary.email[this.context]}
                  </FormLabel>
                  <FormControl
                    type={'text'}
                    placeholder={'Enter email'}
                    className={styles.border}
                    value={this.state.inviteFields.email}
                    onChange={handleChange}
                  />
                  <InputGroup.Append>
                    <Button variant={'outline-info'} onClick={handleSearch}>
                      <i className={'fas fa-search'} /> Search
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <ListGroup>
                  {this.state.inviteFields.results.length > 0 ? (
                    <div
                      className={'overflow-auto'}
                      style={{ maxHeight: '15rem' }}
                    >
                      {this.state.inviteFields.results.map((user, index) => (
                        <ListGroup.Item
                          key={index}
                          className={`
                              mt-2
                              ${
                                this.state.inviteFields.selected.includes(
                                  user.id
                                )
                                  ? 'bg-info text-light'
                                  : ''
                              }
                            `}
                          onClick={() => handleClick(user.id)}
                        >
                          {user.user_name}
                        </ListGroup.Item>
                      ))}
                    </div>
                  ) : null}
                </ListGroup>
              </Form.Group>
              <ListGroup>
                <Form.Label>
                  {dictionary.invite_subs_header[this.context]}
                </Form.Label>
                <div className={'overflow-auto'} style={{ height: '15rem' }}>
                  {this.state.inviteFields.userSubs.map((sub, index) => (
                    <ListGroup.Item
                      key={index}
                      className={`
                      mt-2
                      ${
                        this.state.inviteFields.selected.includes(sub.id)
                          ? 'bg-info text-light'
                          : ''
                      }
                    `}
                      onClick={() => handleClick(sub.id)}
                    >
                      {sub.user_name}
                    </ListGroup.Item>
                  ))}
                </div>
              </ListGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant={'danger'} onClick={handleHide}>
              Cancel
            </Button>
            <Button
              type={'button'}
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
    const selected = this.state.inviteFields.selected;
    axiosInstance
      .post(`/talk/${this.id}/invite`, {
        selected
      })
      .then(() => {
        this.setState({
          inviteFields: {
            email: '',
            error: false,
            results: [],
            selected: [],
            success: true,
            userSubs: []
          },
          inviteModalOpen: false
        });
      })
      .catch(error => {
        console.log(error.response.data.message);
        this.setState({
          inviteFields: {
            email: '',
            error: true,
            results: [],
            selected: [],
            success: false,
            userSubs: []
          },
          inviteModalOpen: false
        });
      });
  };

  private renderChallengeForm = () => {
    const handleOpen = () => {
      this.setState({
        challengeFields: {
          ...this.state.challengeFields,
          post: this.state.posts[0] ? this.state.posts[0].id : undefined
        },
        challengeFormOpen: true
      });
    };
    const handleClose = () => {
      this.setState({
        challengeFields: {
          answer: undefined,
          challengetype: 'question_options',
          correctAnswer: undefined,
          dateEnd: '',
          dateStart: '',
          description: '',
          isComplete: false,
          isCorrect: false,
          options: [],
          points: 0,
          post: this.state.posts[0]
            ? this.state.posts[0].id.toString()
            : undefined,
          question: undefined,
          title: '',
          userAnswer: ''
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
        const answer = this.state.challengeFields.answer!.trim();
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
      const answer = this.state.challengeFields.answer!.trim();
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
              value={this.state.challengeFields.post}
              name={'post'}
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
            value={this.state.challengeFields.challengetype}
            name={'challengetype'}
            onChange={handleChange}
            required={true}
          >
            <option value={'question_options'}>
              {dictionary.mult_choice_question[this.context]}
            </option>
            <option value={'create_post'}>
              {dictionary.post_create[this.context]}
            </option>
            <option value={'comment_post'}>
              {dictionary.comment_post[this.context]}
            </option>
          </Form.Control>
          {this.state.challengeFields.challengetype === 'question_options'
            ? renderMCQFields()
            : null}
          {this.state.challengeFields.challengetype === 'create_post'
            ? renderPOSTFields()
            : null}
          {this.state.challengeFields.challengetype === 'comment_post'
            ? renderCMTFields()
            : null}
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
        <ListGroup.Item
          className="pointer"
          onClick={handleOpen}
          disabled={this.state.isArchived}
        >
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
      if (fields[key]) {
        if (key !== 'options') {
          fields[key] = fields[key].toString().trim();
        } else {
          fields[key] = fields[key].map(value => value.toString().trim());
        }
      }
    });

    if (fields.title.length === 0) {
      this.setState({
        error: {
          ...this.state.error,
          title: true
        }
      });
      this.errorMessages.title =
        dictionary.title_empty_error_message[this.context];
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
      this.errorMessages.description =
        dictionary.description_empty_error_message[this.context];
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
      this.errorMessages.dateStart =
        dictionary.date_empty_error_message[this.context];
      return false;
    } else if (Date.now() - Date.parse(fields.dateStart) >= 0) {
      this.setState({
        error: {
          ...this.state.error,
          dateStart: true
        }
      });
      this.errorMessages.dateStart =
        dictionary.invalid_date_error_message[this.context];
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
      this.errorMessages.dateEnd =
        dictionary.date_empty_error_message[this.context];
      return false;
    } else if (Date.parse(fields.dateEnd) - Date.parse(fields.dateStart) < 0) {
      this.setState({
        error: {
          ...this.state.error,
          dateEnd: true
        }
      });
      this.errorMessages.dateEnd =
        dictionary.end_date_error_message[this.context];
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
    if (
      fields.challengetype === 'question_options' &&
      (fields.question === undefined || fields.question!.length === 0)
    ) {
      this.setState({
        error: {
          ...this.state.error,
          question: true
        }
      });
      this.errorMessages.question =
        dictionary.question_empty_error_message[this.context];
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
    if (
      fields.options === undefined ||
      (fields.challengetype === 'question_options' &&
        fields.options!.length <= 1)
    ) {
      this.setState({
        error: {
          ...this.state.error,
          options: true
        }
      });
      this.errorMessages.options =
        dictionary.options_empty_error_message[this.context];
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
    if (
      fields.challengetype === 'question_options' &&
      (fields.correctAnswer === undefined || fields.correctAnswer!.length === 0)
    ) {
      this.setState({
        error: {
          ...this.state.error,
          correctAnswer: true
        }
      });
      this.errorMessages.correctAnswer =
        dictionary.correct_answer_empty_error_message[this.context];
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
    if (fields.points < 0 || fields.points > 99) {
      this.setState({
        error: {
          ...this.state.error,
          points: true
        }
      });
      this.errorMessages.points = dictionary.points_invalid_field[this.context];
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
      if (entry[1] && entry[1]!.toString().length > 0) {
        if (!this.validateInput(entry[0], entry[1])) {
          error = true;
        }
      }
    });

    if (error) {
      return;
    }

    const formData = new FormData();
    formData.append('type', fields.challengetype);
    formData.append('title', fields.title);
    formData.append('description', fields.description);
    formData.append('dateStart', new Date(fields.dateStart).toISOString());
    formData.append('dateEnd', new Date(fields.dateEnd).toISOString());
    formData.append('points', fields.points.toString());
    formData.append('question', fields.question!);
    formData.append('correctAnswer', fields.correctAnswer!);
    fields.options.forEach((option, index) =>
      formData.append(`options[${index}]`, option)
    );
    formData.append('post', fields.post!);
    formData.append('talk_id', this.id.toString());

    axiosInstance
      .post(`/talk/${this.id}/challenge/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        const newChallenge = { id: res.data.challenge, ...fields };
        this.setState({
          challengeFields: {
            answer: '',
            challengetype: 'question_options',
            correctAnswer: '',
            dateEnd: '',
            dateStart: '',
            description: '',
            isComplete: false,
            isCorrect: false,
            options: [],
            points: 0,
            post: this.state.posts[0]
              ? this.state.posts[0].id.toString()
              : undefined,
            question: '',
            title: '',
            userAnswer: ''
          },
          challengeFormOpen: false,
          challenges: [...this.state.challenges, newChallenge]
        });
      })
      .catch(err => console.log(err.response.data.message));
  };

  private renderAvatarTalk() {
    const onAvatarChange = (avatar: File) => {
      const editFields = this.state.editFields;
      editFields.avatar = avatar;
      this.setState({
        editFields
      });
      this.forceUpdate();
    };

    const onAvatarRemove = () => {
      const editFields = this.state.editFields;
      editFields.avatar = undefined;
      this.setState({
        editFields
      });
    };

    if (
      this.state.editFields.avatar_str !== '' &&
      this.state.editFields.avatar_str !== undefined &&
      this.state.editFields.avatar === undefined
    ) {
      return (
        <div className={styles.avatarBlock}>
          <AvatarSelector
            title={this.state.talk.title}
            placeholder={'empty'}
            avatar={this.state.editFields.avatar_str}
            size={140}
            onRemove={onAvatarRemove}
            onChange={onAvatarChange}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.avatarBlock}>
          <AvatarSelector
            title={this.state.talk.title}
            placeholder={'empty'}
            avatar={this.state.editFields.avatar}
            size={140}
            onRemove={onAvatarRemove}
            onChange={onAvatarChange}
          />
        </div>
      );
    }
  }

  private renderEditForm = () => {
    const editFields = this.state.editFields;

    const handleHide = () => {
      this.setState({
        editFields: {
          avatar: undefined,
          avatar_str: this.state.talk.avatar_src,
          dateEnd: this.state.talk.dateEnd,
          dateStart: this.state.talk.dateStart,
          description: this.state.talk.description,
          hasLivestream: this.state.talk.hasLivestream,
          livestreamURL: this.state.talk.livestreamURL,
          local: this.state.talk.local,
          privacy: this.state.talk.privacy,
          title: this.state.talk.title
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
        }
      });
    };

    const handleShow = () => {
      this.setState({
        editFormOpen: true
      });
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
        <ListGroup.Item
          className="pointer"
          onClick={handleShow}
          disabled={this.state.isArchived}
        >
          <i className={'fas fa-pen mr-2'} />
          {dictionary.edit_talk[this.context]}
        </ListGroup.Item>

        <Modal show={this.state.editFormOpen} onHide={handleHide}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{dictionary.edit_talk[this.context]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="avatarEditTalk" className={styles.avatarEdit}>
              {this.renderAvatarTalk()}
            </div>
            <InputNext
              onChange={handleChange}
              id={`talk_title_field`}
              name={'title'}
              label={dictionary.title[this.context]}
              placeholder={dictionary.insert_title[this.context]}
              value={editFields.title}
              required={true}
              status={this.state.error.title ? 'error' : 'normal'}
              hint={this.state.error.title ? this.errorMessages.title : ''}
            />
            <InputNext
              onChange={handleChange}
              id={`talk_description_field`}
              name={'about'}
              label={dictionary.description[this.context]}
              placeholder={dictionary.description_placeholder[this.context]}
              value={editFields.description}
              required={true}
              type={'textarea'}
              rows={5}
              maxLength={3000}
              status={this.state.error.description ? 'error' : 'normal'}
              hint={
                this.state.error.description
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
              value={editFields.local}
              status={this.state.error.local ? 'error' : 'normal'}
              hint={this.state.error.local ? this.errorMessages.local : ''}
            />
            <div className={styles.Wrapper}>
              <Select
                id={'talk_privacy_field'}
                name={'privacy'}
                value={editFields.privacy}
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
                value={editFields.dateStart}
                type={'datetime-local'}
                status={this.state.error.dateStart ? 'error' : 'normal'}
                hint={
                  this.state.error.dateStart ? this.errorMessages.dateStart : ''
                }
              />
              <InputNext
                onChange={handleChange}
                id={`talk_date_end_field`}
                name={'dateEnd'}
                label={dictionary.date_end[this.context]}
                value={editFields.dateEnd}
                type={'datetime-local'}
                status={this.state.error.dateEnd ? 'error' : 'normal'}
                hint={
                  this.state.error.dateEnd ? this.errorMessages.dateEnd : ''
                }
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
                value={editFields.hasLivestream === 'true'}
                className={styles.switcher}
              />
              <InputNext
                onChange={handleChange}
                id={`talk_livestream_url_field`}
                value={editFields.livestreamURL}
                name={'livestream'}
                label={dictionary.livestream_url[this.context]}
                type={'url'}
                placeholder={'https://www.youtube.com/embed/<id>'}
                disabled={!(editFields.hasLivestream === 'true')}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHide} variant={'danger'}>
              {dictionary.cancel[this.context]}
            </Button>
            <Button onClick={this.handleEditSubmission} variant={'success'}>
              {dictionary.save[this.context]}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  private validateField = (field, value) => {
    if (field === 'title') {
      /* Alphanumerical characters with whitespaces and hyphen */
      const re = /^([\s\-]*[\w\u00C0-\u017F]+[\s\-]*){2,150}$/;
      if (!re.test(value)) {
        this.setState({
          error: {
            ...this.state.error,
            title: true
          }
        });
      } else {
        this.setState({
          error: {
            ...this.state.error,
            title: false
          }
        });
      }
    } else if (field === 'description' || field === 'about') {
      /* Alphanumerical characters with whitespaces and some special characters */
      const re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
      if (!re.test(value)) {
        this.setState({
          error: {
            ...this.state.error,
            description: true
          }
        });
      } else {
        this.setState({
          error: {
            ...this.state.error,
            description: false
          }
        });
      }
    } else if (field === 'place' || field === 'local') {
      /* Alphanumerical characters with whitespaces, comma, dot and hyphen */
      const re = /^([\w\u00C0-\u017F]+[ \-,.\w\u00C0-\u017F]*){2,}$/;
      if (!re.test(value)) {
        this.setState({
          error: {
            ...this.state.error,
            local: true
          }
        });
      } else {
        this.setState({
          error: {
            ...this.state.error,
            local: false
          }
        });
      }
    } else if (field === 'dateStart') {
      /*
       * YYYY-MM-DDThh:mm date format, where Y = year, M = month, D = day, h = hour, m = minute
       * T is the separator and must be written as the capital letter T
       */
      const re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!re.test(value)) {
        this.setState({
          error: {
            ...this.state.error,
            dateStart: true
          }
        });
      } else {
        this.setState({
          error: {
            ...this.state.error,
            dateStart: false
          }
        });
      }
    } else if (field === 'dateEnd') {
      /*
       * YYYY-MM-DDThh:mm date format, where Y = year, M = month, D = day, h = hour, m = minute
       * T is the separator and must be written as the capital letter T
       */
      const re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!re.test(value)) {
        this.setState({
          error: {
            ...this.state.error,
            dateEnd: true
          }
        });
      } else {
        this.setState({
          error: {
            ...this.state.error,
            dateEnd: false
          }
        });
      }
    }
  };

  private handleEditSubmission = () => {
    const editFields = this.state.editFields;
    const errors = this.state.error;

    if (Object.values(errors).includes(true)) {
      return;
    }

    const formData = new FormData();

    if (editFields.avatar !== undefined) {
      formData.append('avatar', editFields.avatar);
    }

    formData.append('description', editFields.description.trim());
    formData.append('dateEnd', editFields.dateEnd.trim());
    formData.append('dateStart', editFields.dateStart.trim());
    formData.append('livestream', editFields.livestreamURL.trim());
    formData.append('privacy', editFields.privacy.trim());
    formData.append('title', editFields.title.trim());
    formData.append('local', editFields.local.trim());

    axiosInstance
      .put(`/talk/${this.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        this.setState({
          ...this.state,
          // ...editFields,
          editFormOpen: false
        });
        window.location.reload();
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
        <ListGroup.Item className="pointer" onClick={handleShow}>
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
        <ListGroup.Item
          className="pointer"
          onClick={handleShow}
          disabled={this.state.isArchived}
        >
          <i
            className={`fas ${
              this.state.isHidden ? 'fa-eye' : 'fa-eye-slash'
            } mr-2`}
          />
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
    const buttonClassName = classNames(
      'pt-2 pb-2 pl-3 pr-3 pointer',
      styles.button,
      {
        [styles.disabled]: this.state.isHidden || this.state.isArchived
      }
    );

    return (
      <>
        <ListGroup.Item
          onClick={handleShow}
          className={buttonClassName}
          disabled={this.state.isHidden || this.state.isArchived}
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
      this.errorMessages.title =
        dictionary.title_empty_error_message[this.context];
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
      this.errorMessages.description =
        dictionary.description_empty_error_message[this.context];
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
          .then(res => {
            const post = res.data.post;
            let points = 0;
            for (const challenge of this.state.challenges) {
              if (
                challenge.challengetype === 'create_post' &&
                !challenge.isComplete
              ) {
                challenge.isComplete = true;
                challenge.isCorrect = true;
                points = challenge.points;
                break;
              }
            }

            post.comments = res.data.comments;
            post.files = res.data.files;
            post.tags = res.data.tags;

            let activeIndex = this.state.activeIndex;
            let length = this.state.challenges.length - 1;
            length = length < 0 ? 0 : length;
            activeIndex = activeIndex + 1 > length ? 0 : activeIndex + 1;

            this.setState({
              activeIndex,
              challenges: this.state.challenges,
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
              posts: [post, ...this.state.posts],
              userPoints: Number(this.state.userPoints) + Number(points)
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
        message = dictionary.answer_invalid_field[this.context];
        break;
      case 'correctAnswer':
        re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
        message = dictionary.answer_invalid_field[this.context];
        break;
      case 'dateEnd':
        re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        message = dictionary.date_invalid_field[this.context];
        break;
      case 'dateStart':
        re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        message = dictionary.date_invalid_field[this.context];
        break;
      case 'description':
        re = /^[\-!?%@#)( ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.)(\w\u00C0-\u017F]*$/;
        message = dictionary.description_invalid_field[this.context];
        break;
      case 'local':
        re = /^([\w\u00C0-\u017F]+[ \-,.\w\u00C0-\u017F]*){2,}$/;
        message = dictionary.local_invalid_field[this.context];
        break;
      case 'options':
        re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
        message = dictionary.options_invalid_field[this.context];
        break;
      case 'points':
        re = /^\d{1,2}$/;
        message = dictionary.points_invalid_field[this.context];
        break;
      case 'question':
        re = /^[\-!?%@# ]*[\w\u00C0-\u017F]+[\s\-!?@#%,.\w\u00C0-\u017F]*$/;
        message = dictionary.question_invalid_field[this.context];
        break;
      case 'tags':
        re = /^([\s\-]*[\w\u00C0-\u017F]+[\s\-]*){2,150}$/;
        message = dictionary.tag_invalid_field[this.context];
        break;
      case 'title':
        re = /^([\s\-]*[\w\u00C0-\u017F]+[\s\-]*){2,150}$/;
        message = dictionary.title_invalid_field[this.context];
        break;
      case 'challengetype':
        re = /^(question_options|create_post|comment_post)$/;
        message = dictionary.type_invalid_field[this.context];
        break;
      case 'livestreamURL':
        re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\\x{00a1}\-\\x{ffff}0-9]+-?)*[a-z\\x{00a1}\-\\x{ffff}0-9]+)(?:\.(?:[a-z\\x{00a1}\-\\x{ffff}0-9]+-?)*[a-z\\x{00a1}\-\\x{ffff}0-9]+)*(?:\.(?:[a-z\\x{00a1}\-\\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$|^$/;
        message = dictionary.livestream_invalid_field[this.context];
        break;
      default:
        return true;
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
