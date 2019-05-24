import { MouseEvent } from 'react';
import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Avatar, Button, Icon, InputNext } from '../components';

import ChallengeCarousel from '../components/ChallengeCarousel/ChallengeCarousel';
import Chat from '../components/Chat/Chat';
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll';
import Livestream from '../components/Livestream/Livestream';
import InviteModal from '../components/PostModal/InviteModal';

import styles from '../components/Post/Post.module.css';
import '../styles/Talk.css';

import {
  faGlobeAfrica,
  faLock,
  faQuestion,
  faUserFriends,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import CreateNewModal from '../components/CreateNewModal/CreateNewModal';
import CreateNewModalChallenge from '../components/CreateNewModalChallenges/CreateNewModalChallenge';

import { Request, Step } from '../components/CreateNewModal/types';
import {
  RequestChallenge,
  StepChallenge
} from '../components/CreateNewModalChallenges/types';
import Switcher from '../components/Switcher/Switcher';

// - Import utils
import {
  apiCheckUserCanJoinTalk,
  apiCheckUserTalkParticipation,
  apiUserJoinTalk,
  apiUserLeaveTalk
} from '../utils/apiTalk';
import AuthHelperMethods from '../utils/AuthHelperMethods';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

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
    description: string;
    dateStart: string;
    dateEnd: string;
    hasLiveStream: boolean;
    livestreamUrl: string;
    place: string;
    title: string;
  };
  archived: boolean;
  challenges: any[];
  clickedChallenge: number | undefined;
  conf_id: number;
  step: Step;
  stepChallenge: StepChallenge;
  hasLiveStream: boolean;
  livestreamUrl: string;
  posts: any[];
  title: string;
  description: string;
  place: string;
  dateStart: string;
  dateEnd: string;
  points: number;
  userCanJoin: boolean;
  userParticipation: boolean;
  waitingUserJoinLeave: boolean;
  isChallengeModalOpen: boolean;
  isHidden: boolean;
  privacy: string;
  postModalOpen: boolean;
  request: {
    type: 'post' | 'talk' | 'conference';
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
    type: 'post' | 'options' | 'question' | 'comment';
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

class Talk extends React.Component<IProps, IState> {
  public static contextType = LanguageContext;

  private id: number;
  private ownerId: number | undefined;
  private ownerName: string | undefined;
  private tags: string[];
  private auth = new AuthHelperMethods();

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;
    this.tags = [];
    this.state = {
      archived: false,
      challenges: [],
      clickedChallenge: undefined,
      conf_id: 0,
      dateEnd: '',
      dateStart: '',
      description: '',
      editFields: {
        dateEnd: '',
        dateStart: '',
        description: '',
        hasLiveStream: false,
        livestreamUrl: '',
        place: '',
        title: ''
      },
      editFormOpen: false,
      hasLiveStream: true,
      isChallengeModalOpen: false,
      isHidden: false,
      livestreamUrl: '',
      place: '',
      points: 0,
      postModalOpen: false,
      posts: [],
      privacy: '',
      request: {
        about: '',
        avatar: undefined,
        dateEnd: '',
        dateStart: '',
        files: {
          docs: [],
          images: [],
          videos: []
        },
        livestream: '',
        local: '',
        privacy: 'public',
        switcher: 'false',
        tags: [],
        title: '',
        type: 'post'
      },
      requestChallenge: {
        about: '',
        correctAnswer: '',
        dateEnd: '',
        dateStart: '',
        options: [],
        post: '',
        prize: '',
        prizePoints: '',
        question: '',
        title: '',
        type: 'question'
      },
      step: 'type',
      stepChallenge: 'type',
      title: '',
      userCanJoin: false,
      userParticipation: false,
      waitingUserJoinLeave: false
    };

    this.handleHideTalk = this.handleHideTalk.bind(this);
    this.getHiddenInfo = this.getHiddenInfo.bind(this);
    this.handleChallengeClick = this.handleChallengeClick.bind(this);
    this.handleJoinTalk = this.handleJoinTalk.bind(this);
    this.handleLeaveTalk = this.handleLeaveTalk.bind(this);
  }

  public async componentDidMount() {
    await this.apiGetTalk();
    if (this.props.user.id === this.ownerId || !this.state.isHidden) {
      this.getPossibleTags();
      this.apiGetUserCanJoin();
      this.apiGetUserParticipation();
      this.apiGetPointsOfUserTalk();
    }
  }

  public render() {
    if (this.state.isHidden && this.props.user.id === this.ownerId) {
      return (
        <div id="Talk" className="my-5">
          <div className="container my-5">
            <button className="return_conf">
              <i className="fas fa-undo" />
              <a href={'/conference/' + this.state.conf_id}>
                {dictionary.return_conference[this.context]}
              </a>
            </button>
            <h4>
              {dictionary.title[this.context]}: {this.state.title}
            </h4>
            <h5>{dictionary.closed_talk[this.context]}</h5>
          </div>

          <div className="container my-5">
            <div className="conf_side">
              <div className="p-3">{this.getDetails()}</div>
              {(this.auth.isLoggedInUser(this.ownerId) ||
                this.auth.isAdmin()) && (
                <div className="p-3">{this.getAdminButtons()}</div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="Talk" className="my-5">
          <div className="container my-5">
            <button className="return_conf">
              <i className="fas fa-undo" />
              <a href={'/conference/' + this.state.conf_id}>
                {dictionary.return_conference[this.context]}
              </a>
            </button>
            <h4>{this.state.title}</h4>
            <p>{this.state.description}</p>
          </div>
          {this.state.hasLiveStream &&
            this.state.userParticipation &&
            this.state.userCanJoin &&
            this.renderStream()}
          <div className="container my-5">
            <div className="conf_side">
              {this.getJoinButton()}
              <div className="p-3">{this.getDetails()}</div>
              {(this.auth.isLoggedInUser(this.ownerId) ||
                this.auth.isAdmin()) && (
                <div className="p-3">{this.getAdminButtons()}</div>
              )}
              {this.getChallenges()}
            </div>
            <div className="conf_posts">
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
                  step={'postConf'}
                  tags={this.tags}
                />
              ) : null}
              <button
                className="create"
                onClick={this.createConfPost}
                hidden={this.state.archived}
              >
                {dictionary.create_post[this.context]}
              </button>
              <InfiniteScroll requestUrl={`/talk/${this.id}`} />
            </div>
          </div>
        </div>
      );
    }
  }

  private async handleJoinTalk() {
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

  private async handleLeaveTalk() {
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

  private apiGetPointsOfUserTalk() {
    axiosInstance
      .get(`/talk/${this.id}/user/${this.props.user.id}/points`)
      .then(res => {
        this.setState({ points: res.data.points });
      })
      .catch(() =>
        console.log('Failed to get points of user in the conference')
      );
  }

  private async apiGetTalk() {
    try {
      const res = await axiosInstance.get(`/talk/${this.id}`);
      const talk = res.data.talk;
      const posts = res.data.posts;

      const challengesConf = res.data.challenges;

      if (talk.privacy === 'closed') {
        this.setState({
          isHidden: true
        });
      }

      this.ownerId = talk.user_id;
      this.ownerName = `${talk.first_name} ${talk.last_name}`;

      const reqChalCopy = this.state.requestChallenge;
      if (posts.length > 0) {
        reqChalCopy.post = posts[0].id;
      }

      this.setState({
        archived: talk.archived,
        challenges: challengesConf,
        conf_id: talk.conference,
        dateEnd: talk.dateend,
        dateStart: talk.datestart,
        description: talk.about,
        editFields: {
          dateEnd: talk.dateend,
          dateStart: talk.datestart,
          description: talk.about,
          hasLiveStream: talk.livestream_url !== '',
          livestreamUrl: talk.livestream_url,
          place: talk.local,
          title: talk.title
        },
        hasLiveStream: talk.livestream_url !== '',
        livestreamUrl: talk.livestream_url,
        place: talk.local,
        posts,
        privacy: talk.privacy,
        requestChallenge: reqChalCopy,
        title: talk.title
      });
    } catch (e) {
      console.log('Failed to get talk info');
    }
  }

  private handleHideTalk() {
    let privacyState = 'closed';

    if (this.state.isHidden) {
      privacyState = 'public';
      this.setState({
        isHidden: false
      });
    } else {
      privacyState = 'closed';
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
        console.log('Talk hidden...');
      })
      .catch(() => console.log('Failed to update privacy'));
  }

  private apiSetArchived() {
    axiosInstance
      .post(`/talk/${this.id}/archive`)
      .then()
      .catch(() => console.log('Failed to archive talk'));

    this.setState({
      archived: true
    });
  }

  private apiSetUnarchived() {
    axiosInstance
      .delete(`/talk/${this.id}/archive`)
      .then()
      .catch(() => console.log('Failed to unarchive talk'));

    this.setState({
      archived: false
    });
  }

  private async apiGetUserCanJoin() {
    const canJoin: boolean = await apiCheckUserCanJoinTalk(this.id);
    this.setState({ userCanJoin: canJoin });
  }

  private async apiGetUserParticipation() {
    const participant: boolean = await apiCheckUserTalkParticipation(this.id);
    this.setState({ userParticipation: participant });
  }

  private getHiddenInfo() {
    if (this.state.isHidden) {
      return (
        <div id="hidden_info">
          <b>{dictionary.closed_talk[this.context]}</b>
        </div>
      );
    }
  }

  private getDropdownButtons() {
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

  private returnToConf() {
    window.location.href = '/conference/' + this.state.conf_id;
  }

  private createConfPost = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ postModalOpen: true });
  };

  private handleSubmit = (request: Request) => {
    if (request.type === 'post') {
      const formData = new FormData();
      request.files.images.forEach((file, idx) =>
        formData.append('images[' + idx + ']', file)
      );
      request.files.videos.forEach((file, idx) =>
        formData.append('videos[' + idx + ']', file)
      );
      request.files.docs.forEach((file, idx) =>
        formData.append('docs[' + idx + ']', file)
      );
      request.tags.forEach((tag, i) => formData.append('tags[' + i + ']', tag));

      formData.append('text', request.about);
      formData.append('title', request.title);
      formData.append('visibility', request.privacy);
      formData.append('talk', this.id + '');

      axiosInstance
        .post('/post', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          console.log('Post created - reloading page...');
          window.location.reload();
          this.resetState();
        })
        .catch(() => console.log('Failed to create post'));
    }
  };

  private handleSubmitChallenge = (request: RequestChallenge) => {
    let url = `${location.protocol}//${location.hostname}`;
    url +=
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? `:${process.env.REACT_APP_API_PORT}`
        : '/api';

    const formData = new FormData();

    formData.append('type', request.type);
    formData.append('title', request.title);
    formData.append('text', request.about);
    formData.append('dateEnd', request.dateEnd);
    formData.append('dateStart', request.dateStart);
    formData.append('prize', request.prize);
    formData.append('prizePoints', request.prizePoints);
    formData.append('question', request.question);

    let correctAns = '';

    if (request.type === 'options') {
      correctAns = request.options[Number(request.correctAnswer)];
    } else {
      correctAns = request.correctAnswer;
    }

    formData.append('correctAnswer', correctAns);

    request.options.forEach((opt, i) =>
      formData.append('options[' + i + ']', opt)
    );

    formData.append('post', request.post);
    formData.append('talk_id', String(this.id));

    url += `/talk/${this.id}/challenge/create`;
    axiosInstance
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log('Challenge created - reloading page...');
        window.location.reload();
        this.resetState();
      })
      .catch(() => console.log('Failed to create post'));
  };

  private getPossibleTags = (): void => {
    axiosInstance
      .get('/tags')
      .then(res => {
        res.data.forEach(tag => {
          this.tags.push(tag.name);
        });
      })
      .catch(() => console.log('Failed to get tags'));
  };

  private resetState = () => {
    this.setState({
      postModalOpen: false,
      request: {
        about: '',
        avatar: undefined,
        dateEnd: '',
        dateStart: '',
        files: {
          docs: [],
          images: [],
          videos: []
        },
        livestream: '',
        local: '',
        privacy: 'public',
        shortname: '',
        switcher: 'false',
        tags: [],
        title: '',
        type: 'post'
      },
      step: 'type'
    });
  };

  private resetStateChallenge = () => {
    this.setState({
      isChallengeModalOpen: false,
      requestChallenge: {
        about: '',
        correctAnswer: '',
        dateEnd: '',
        dateStart: '',
        options: [],
        post: '',
        prize: '',
        prizePoints: '',
        question: '',
        title: '',
        type: 'question'
      },
      stepChallenge: 'type'
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
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      month: 'long',
      weekday: 'long',
      year: 'numeric'
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
        <a className={styles.post_author} href={'/user/' + this.ownerId}>
          {' '}
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
    const hideBtnText = this.state.isHidden
      ? dictionary.reopen_talk[this.context]
      : dictionary.hide_talk[this.context];
    return (
      <div id="conf-admin-buttons" className="p-0 m-0">
        <h6>{dictionary.administrator[this.context]}</h6>
        {this.auth.isLoggedInUser(this.ownerId) && this.renderInvite()}
        {this.auth.isLoggedInUser(this.ownerId) && this.renderChallenge()}
        {this.auth.isLoggedInUser(this.ownerId) && this.renderEditTalk()}
        {this.auth.isLoggedInUser(this.ownerId) && this.renderArchiveTalk()}
        <button onClick={this.handleHideTalk} disabled={this.state.archived}>
          <i className="fas fa-trash" />
          {hideBtnText}
        </button>
        {this.getHiddenInfo()}
      </div>
    );
  }

  private renderInvite() {
    return (
      <>
        <button
          disabled={this.state.archived}
          data-toggle="modal"
          data-target={`#invite_talk_modal_${this.id}`}
        >
          <i className="fas fa-envelope" />
          {dictionary.invite_users[this.context]}
        </button>
        {/* Invite Users */}
        <InviteModal talkId={this.id} />
      </>
    );
  }

  private renderChallenge() {
    return (
      <>
        <button
          type="button"
          onClick={this.handleCreateChallenge}
          disabled={this.state.archived}
        >
          <i className="fas fa-puzzle-piece" />
          {dictionary.create_challenge_talk[this.context]}
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
      </>
    );
  }

  private renderEditTalk() {
    const editFields = this.state.editFields;
    const handleHide = () =>
      this.setState({
        editFields: {
          dateEnd: this.state.dateEnd,
          dateStart: this.state.dateStart,
          description: this.state.description,
          hasLiveStream: this.state.hasLiveStream,
          livestreamUrl: this.state.livestreamUrl,
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
        <button disabled={this.state.archived} onClick={handleShow}>
          <i className="fas fa-pen" />
          {dictionary.edit_talk[this.context]}
        </button>

        <Modal show={this.state.editFormOpen} onHide={handleHide}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{dictionary.edit_talk[this.context]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={'title'}
              value={editFields.title}
              label={dictionary.title[this.context]}
              placeholder={dictionary.insert_title[this.context]}
            />
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={'description'}
              value={editFields.description}
              label={dictionary.description[this.context]}
              type={'textarea'}
              rows={5}
              maxLength={3000}
              placeholder={dictionary.description_placeholder[this.context]}
            />
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={'place'}
              value={editFields.place}
              label={dictionary.talk_local[this.context]}
            />
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={'dateStart'}
              value={editFields.dateStart}
              label={dictionary.date_start[this.context]}
              type={'datetime-local'}
            />
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={'dateEnd'}
              value={editFields.dateEnd}
              label={dictionary.date_end[this.context]}
              type={'datetime-local'}
            />
            <div className={'mb-3'}>
              <label htmlFor={'hasLivrestream'}>Enable Livrestream</label>
              <Switcher
                id={'hasLiveStream'}
                name={'livestreamSwitcher'}
                onChange={(value, event) =>
                  handleChange(event.target.id, value)
                }
                label={editFields.hasLiveStream ? 'Enabled' : 'Disabled'}
                value={editFields.hasLiveStream}
              />
            </div>
            <InputNext
              onChange={(value, event) => handleChange(event.target.id, value)}
              id={'livestreamUrl'}
              value={editFields.livestreamUrl}
              label={dictionary.livestream_url[this.context]}
              type={'url'}
              disabled={!editFields.hasLiveStream}
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
  }

  private renderArchiveTalk() {
    const isArchivedBtn = this.state.archived
      ? dictionary.unarchive_talk[this.context]
      : dictionary.archive_talk[this.context];
    return (
      <button
        type="button"
        onClick={() => {
          this.archiveTalk();
        }}
      >
        <i className="fas fa-archive" />
        {isArchivedBtn}
      </button>
    );
  }

  private handleCreateChallenge = (event: MouseEvent): void => {
    event.preventDefault();
    this.setState({ isChallengeModalOpen: true });
  };

  private getJoinButton() {
    let buttonClass = this.state.userParticipation ? 'leave' : 'join';
    let buttonText = this.state.userParticipation
      ? dictionary.leave_talk[this.context]
      : dictionary.join_talk[this.context];

    if (!this.state.userCanJoin) {
      buttonClass = 'cannot_join';
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
      case 'public':
        return faGlobeAfrica;
      case 'followers':
        return faUserFriends;
      case 'private':
        return faLock;
      default:
        return faQuestion;
    }
  }

  private handleChallengeClick(challenge: number | undefined) {
    if (challenge) {
      this.setState({
        clickedChallenge: challenge
      } as IState);
    }
  }

  private getChallenges() {
    if (!this.state.userParticipation || !this.state.userCanJoin) {
      return;
    }

    const challenges: any[] = [];
    if (this.state.challenges.length > 0) {
      challenges.push(
        <ChallengeCarousel
          key={'challenges_' + this.id}
          id={this.id}
          challenges={this.state.challenges}
          userId={this.props.user.id}
          handleChallengeClick={this.handleChallengeClick}
        />
      );
    } else {
      challenges.push(
        <div key={'no_challenges'}>
          {' '}
          {dictionary.no_challenges[this.context]}{' '}
        </div>
      );
    }

    return (
      <div key={'challenges_points'}>
        <div key={'points_div_' + this.id} className="challenges">
          <div key={'points_ins_div_' + this.id} className="p-3">
            <div key={'points_ins_ins_div_' + this.id} className="p-0 m-0">
              <h5>
                {dictionary.my_points[this.context]}{' '}
                <small>{this.state.points}</small>
              </h5>
            </div>
          </div>
        </div>
        <div key={'challenges_div_' + this.id} className="challenges">
          <div key={'challenges_ins_div_' + this.id} className="p-3">
            <div key={'challenges_ins_ins_div_' + this.id} className="p-0 m-0">
              <h4>
                {dictionary.challenge_conference[this.context]}{' '}
                <i className="fas fa-puzzle-piece" />
              </h4>
              <br />
              {challenges}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleEditSubmission = () => {
    const editFields = this.state.editFields;
    axiosInstance
      .put(`/talk/${this.id}`, {
        about: editFields.description,
        dateEnd: editFields.dateEnd,
        dateStart: editFields.dateStart,
        livestreamUrl: editFields.hasLiveStream ? editFields.livestreamUrl : '',
        local: editFields.place,
        title: editFields.title
      })
      .then(() => {
        this.setState({
          ...this.state,
          ...editFields,
          editFields: {
            ...editFields,
            livestreamUrl: editFields.hasLiveStream
              ? editFields.livestreamUrl
              : ''
          },
          editFormOpen: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default withAuth(Talk);
