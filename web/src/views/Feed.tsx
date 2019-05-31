import classNames from 'classnames';
import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Post from '../components/Post/Post';
import styles from '../styles/Feed.module.css';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

type Props = {
  user: any;
};

type State = {
  conferences: any[];
  error: boolean;
  errorMessage: string;
  following: any[];
  hasMore: boolean;
  isLoading: boolean;
  itemsPerPage: number;
  posts: any[];
  talks: any[];
};

class Feed extends React.Component<Props, State> {
  public static contextType = LanguageContext;
  private readonly dateOptions: object;

  constructor(props: Props) {
    super(props);

    this.state = {
      conferences: [],
      error: false,
      errorMessage: '',
      following: [],
      hasMore: true,
      isLoading: true,
      itemsPerPage: 10,
      posts: [],
      talks: []
    };

    this.dateOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };

    window.onscroll = () => {
      const {
        loadMorePosts,
        state: { error, isLoading, hasMore }
      } = this;

      if (error || isLoading || !hasMore) {
        return;
      }

      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMorePosts();
      }
    };
  }

  public componentWillMount() {
    this.apiGetFeed();
  }

  public render() {
    const { error, isLoading, hasMore } = this.state;

    return (
      <div className="container-fluid row mt-3 ml-0 mr-0">
        <div className={classNames('col-lg-3 order-lg-1', styles.cardsLeft)}>
          {this.renderFollowedUsersCard()}
          {this.renderConferencesCard()}
        </div>
        <div className={classNames('col-lg-3 order-lg-3', styles.cardsRight)}>
          {this.renderJoinedTalksCard()}
        </div>
        <div className={classNames('col-lg-6 order-lg-2', styles.posts)}>
          {this.renderPosts()}
          {error ? this.renderErrorAlert() : null}
          {isLoading ? this.renderLoadingIcon() : null}
          {!hasMore ? <hr /> : null}
        </div>
      </div>
    );
  }

  private apiGetFeed = () => {
    this.setState({ isLoading: true }, () => {
      axiosInstance
        .get('/feed/', {
          params: {
            perPage: this.state.itemsPerPage
          }
        })
        .then(res => {
          this.setState({
            conferences: res.data.conferences,
            following: res.data.following,
            hasMore: this.state.posts.length < Number(res.data.size),
            isLoading: false,
            posts: res.data.posts,
            talks: res.data.talks
          });
        })
        .catch(error => {
          this.setState({
            error: true,
            errorMessage: error.response.data.message,
            isLoading: false
          });
        });
    });
  };

  private loadMorePosts = () => {
    this.setState({ isLoading: true }, () => {
      axiosInstance
        .get('/feed/posts', {
          params: {
            offset: this.state.posts.length,
            perPage: this.state.itemsPerPage
          }
        })
        .then(res => {
          this.setState({
            hasMore: this.state.posts.length < Number(res.data.size),
            isLoading: false,
            posts: [...this.state.posts, ...res.data.posts]
          });
        })
        .catch(error => {
          this.setState({
            error: true,
            errorMessage: error.response.data.message,
            isLoading: false
          });
        });
    });
  };

  private renderPosts = () => {
    return this.state.posts.map(post => (
      <Post
        key={post.id}
        id={post.id}
        title={post.title}
        date={new Date(post.date).toLocaleString(
          dictionary.date_format[this.context],
          this.dateOptions
        )}
        author={post.author}
        avatar={post.avatar}
        avatar_mimeType={post.avatar_mimeType}
        content={post.content}
        visibility={post.visibility}
        comments={post.comments}
        tags={post.tags}
        user_id={post.user_id}
        files={post.files}
      />
    ));
  };

  private renderErrorAlert = () => {
    return <Alert variant={'danger'}>{this.state.errorMessage}</Alert>;
  };

  private renderLoadingIcon = () => {
    return (
      <Spinner animation={'border'} role={'status'}>
        <span className={'sr-only'}>Loading...</span>
      </Spinner>
    );
  };

  private renderFollowedUsersCard = () => {
    const following = this.state.following;

    return (
      <Card className={classNames('col-lg-12 mb-3 p-0', styles.border)}>
        <Card.Header className={styles.header}>
          <Card.Title className={'mb-0'}>
            {dictionary.followers[this.context]}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <ListGroup variant={'flush'}>
            {following.length > 0 ? (
              following.map(user => (
                <ListGroup.Item
                  action={true}
                  href={`/user/${user.id}`}
                  key={user.id}
                  className={styles.link}
                >
                  {user.first_name} {user.last_name}
                </ListGroup.Item>
              ))
            ) : (
              <Card.Subtitle>
                {dictionary.following[this.context]}
              </Card.Subtitle>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  };

  private renderConferencesCard = () => {
    const conferences = this.state.conferences;
    const cardHeaderClassName = classNames(
      styles.header,
      'd-flex flex-fow justify-content-between align-items-center'
    );

    return (
      <Card className={classNames('col-lg-12 mb-3 p-0', styles.border)}>
        <Card.Header className={cardHeaderClassName}>
          <Card.Title className={'mb-0'}>
            {dictionary.upcoming_conferences[this.context]}
          </Card.Title>
          <Card.Link
            href={'/conferences'}
            className={'text-dark'}
            style={{ textDecoration: 'underline' }}
          >
            + {dictionary.view_more[this.context]}
          </Card.Link>
        </Card.Header>
        <Card.Body>
          <ListGroup variant={'flush'}>
            {conferences.length > 0 ? (
              conferences.map(conference => {
                const dateStart = new Date(
                  conference.datestart
                ).toLocaleDateString(
                  dictionary.date_format[this.context],
                  this.dateOptions
                );

                return (
                  <ListGroup.Item
                    key={conference.id}
                    action={true}
                    href={`/conference/${conference.id}`}
                    className={styles.link}
                  >
                    {conference.title}
                    <Card.Subtitle className={'mt-2 text-dark'}>
                      {dictionary.starting_date[this.context]}: {dateStart}
                    </Card.Subtitle>
                  </ListGroup.Item>
                );
              })
            ) : (
              <Card.Subtitle>
                {dictionary.no_upcoming_conferences[this.context]}
              </Card.Subtitle>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  };

  private renderJoinedTalksCard = () => {
    const talks = this.state.talks;

    return (
      <Card className={classNames('col-lg-12 mb-3 p-0', styles.border)}>
        <Card.Header className={styles.header}>
          <Card.Title className={'mb-0'}>
            {dictionary.joined_talks[this.context]}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <ListGroup variant={'flush'}>
            {talks.length > 0 ? (
              talks.map(talk => {
                const dateEnd = new Date(talk.dateend).toLocaleDateString(
                  dictionary.date_format[this.context],
                  this.dateOptions
                );

                return (
                  <ListGroup.Item
                    key={talk.id}
                    action={true}
                    href={`/talk/${talk.id}`}
                    className={styles.link}
                  >
                    {talk.title}
                    <Card.Subtitle className={'mt-2 text-dark'}>
                      {dictionary.ending_date[this.context]}: {dateEnd}
                    </Card.Subtitle>
                  </ListGroup.Item>
                );
              })
            ) : (
              <Card.Subtitle>
                {dictionary.no_joined_talks[this.context]}
              </Card.Subtitle>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  };
}

export default withAuth(Feed);
