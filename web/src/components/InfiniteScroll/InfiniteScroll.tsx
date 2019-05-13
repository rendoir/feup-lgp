import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import axios from "axios";
import React, { Component, Fragment } from "react";
import Icon from "../Icon/Icon";
import Post, { Props as PostProps } from "../Post/Post";
import UserCard, { Props as UserProps } from "../UserCard/UserCard";
import styles from "./InfiniteScroll.module.css";

export type Props = {
  requestUrl: string;
  requestParams?: object;
  itemsPerPage: number;
  type: "posts" | "users";
};

export type State = {
  content: PostProps[] | UserProps[];
  error: boolean;
  hasMore: boolean;
  isLoading: boolean;
};

function defaultUrl() {
  let url = `${location.protocol}//${location.hostname}`;
  url +=
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? `:${process.env.REACT_APP_API_PORT}/feed`
      : "/api/feed";

  return url;
}

class InfiniteScroll extends Component<Props, State> {
  public static defaultProps = {
    itemsPerPage: 10,
    requestUrl: defaultUrl(),
    type: "posts"
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      content: [],
      error: false,
      hasMore: true,
      isLoading: false
    };

    window.onscroll = () => {
      const {
        LoadMorePosts,
        LoadMoreUsers,
        state: { error, isLoading, hasMore }
      } = this;

      if (error || isLoading || !hasMore) {
        return;
      }

      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        this.props.type === "posts" ? LoadMorePosts() : LoadMoreUsers();
      }
    };
  }

  public componentWillMount(): void {
    this.props.type === "posts" ? this.LoadMorePosts() : this.LoadMoreUsers();
  }

  public render() {
    const { error, hasMore, isLoading, content } = this.state;

    return (
      <div>
        {this.props.type === "posts"
          ? (content as PostProps[]).map(post => (
              <Fragment key={post.id}>
                <Post
                  id={post.id}
                  title={post.title}
                  date={post.date}
                  author={post.author}
                  content={post.content}
                  visibility={post.visibility}
                  comments={post.comments}
                  tags={post.tags}
                  user_id={post.user_id}
                />
              </Fragment>
            ))
          : (content as UserProps[]).map(user => (
              <Fragment key={user.id}>
                <UserCard
                  id={user.id}
                  first_name={user.first_name}
                  last_name={user.last_name}
                  rate={user.rate}
                  date_created={user.date_created}
                />
              </Fragment>
            ))}
        <hr />
        {error ? <div className={styles.error}>Error: {error}</div> : null}
        {isLoading ? (
          <div className={styles.spinner}>
            <Icon icon={faSpinner} pulse={true} size={"2x"} theme={"primary"} />
          </div>
        ) : null}
        {!hasMore ? <div>You reached the end!</div> : null}
      </div>
    );
  }

  private LoadMorePosts = () => {
    let params = this.props.requestParams;
    if (!params) {
      params = {
        offset: this.state.content.length,
        perPage: this.props.itemsPerPage
      };
    } else {
      // @ts-ignore
      params.offset = this.state.content.length;
      // @ts-ignore
      params.perPage = this.props.itemsPerPage;
    }

    this.setState({ isLoading: true }, () => {
      axios
        .get(this.props.requestUrl, { params })
        .then(results => {
          console.log(results);
          const incoming = results.data;

          incoming.posts.map((post: PostProps, idx: number) => {
            post.author =
              incoming.posts[idx].first_name +
              " " +
              incoming.posts[idx].last_name;
            post.date = incoming.posts[idx].date_created.replace(/T.*/gi, "");
            post.comments = incoming.posts[idx].comments;
            post.tags = incoming.posts[idx].tags;
            post.files = incoming.posts[idx].files;
            delete incoming.posts[idx].first_name;
            delete incoming.posts[idx].last_name;
            delete incoming.posts[idx].date_created;
            delete incoming.posts[idx].conference;
          });

          this.setState({
            content: [...this.state.content, ...incoming.posts],
            hasMore: this.state.content.length < Number(incoming.size),
            isLoading: false
          });
        })
        .catch(err => {
          this.setState({
            error: err.message,
            isLoading: false
          });
        });
    });
  };

  private LoadMoreUsers = () => {
    let params = this.props.requestParams;
    if (!params) {
      params = {
        offset: this.state.content.length,
        perPage: this.props.itemsPerPage
      };
    } else {
      // @ts-ignore
      params.offset = this.state.content.length;
      // @ts-ignore
      params.perPage = this.props.itemsPerPage;
    }

    this.setState({ isLoading: true }, () => {
      axios
        .get(this.props.requestUrl, { params })
        .then(results => {
          const incoming = results.data;

          this.setState({
            content: [...this.state.content, ...incoming.users],
            hasMore: this.state.content.length < Number(incoming.size),
            isLoading: false
          });
        })
        .catch(err => {
          this.setState({
            error: err.message,
            isLoading: false
          });
        });
    });
  };
}

export default InfiniteScroll;
