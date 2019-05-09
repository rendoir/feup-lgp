import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import axios from "axios";
import React, { Component, Fragment } from "react";
import Icon from "../Icon/Icon";
import Post, { Props as PostProps } from "../Post/Post";
import styles from "./InfiniteScroll.module.css";

export type Props = {
  requestUrl: string;
  itemsPerPage: number;
};

export type State = {
  content: PostProps[];
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
    requestUrl: defaultUrl()
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
        loadMore,
        state: { error, isLoading, hasMore }
      } = this;

      if (error || isLoading || !hasMore) {
        return;
      }

      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };
  }

  public componentWillMount(): void {
    this.loadMore();
  }

  public render() {
    const { error, hasMore, isLoading, content } = this.state;

    return (
      <div>
        {content.map(post => (
          <Fragment key={post.id}>
            <Post
              id={post.id}
              title={post.title}
              date={post.date}
              author={post.author}
              content={post.content}
              likes={post.likes}
              visibility={post.visibility}
              comments={post.comments}
              likers={post.likers}
              tags={post.tags}
              user_id={post.user_id}
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

  private loadMore = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .get(this.props.requestUrl, {
          params: {
            offset: this.state.content.length,
            perPage: this.props.itemsPerPage
          }
        })
        .then(results => {
          const incoming = results.data;

          incoming.posts.map((post: PostProps, idx: number) => {
            post.author =
              incoming.posts[idx].first_name +
              " " +
              incoming.posts[idx].last_name;
            post.date = incoming.posts[idx].date_created.replace(/T.*/gi, "");
            post.comments = incoming.comments[idx];
            post.likers = incoming.likers[idx];
            post.tags = incoming.tags[idx];
            post.files = incoming.files[idx];
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
}

export default InfiniteScroll;
