import axios from "axios";
import queryString from "query-string";
import * as React from "react";

import Post from "../components/Post/Post";
import UserCard from "../components/UserCard/UserCard";
import { dictionary, LanguageContext } from "../utils/language";

type Props = {
  location: any;
};
type State = {
  authorPosts: any[];
  posts: any[];
  postsAreaActive: boolean;
  postsAuthorAreaActive: boolean;
  searchParams: SearchParameters;
  users: any[];
  usersAreaActive: boolean;
};

enum SearchType {
  post,
  author,
  user
}

type SearchParameters = {
  k: string[]; // keywords
  tags?: string[];
  type?: SearchType;
  di?: string; // initial date
  df?: string; // final date
};

export default class SearchResults extends React.Component<Props, State> {
  static contextType = LanguageContext;

  constructor(props: Props) {
    super(props);
    this.state = {
      authorPosts: [],
      posts: [],
      postsAreaActive: true,
      postsAuthorAreaActive: false,
      searchParams: queryString.parse(
        this.props.location.search
      ) as SearchParameters,
      users: [],
      usersAreaActive: false
    };
    this.handlePostsArea = this.handlePostsArea.bind(this);
    this.handlePostsAuthorArea = this.handlePostsAuthorArea.bind(this);
    this.handleUsersArea = this.handleUsersArea.bind(this);
  }

  public componentDidMount() {
    this.apiSubmitSearch();
  }

  public componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState(
        {
          authorPosts: [],
          posts: [],
          postsAreaActive: false,
          postsAuthorAreaActive: false,
          searchParams: queryString.parse(
            this.props.location.search
          ) as SearchParameters,
          users: [],
          usersAreaActive: false
        },
        () => {
          this.apiSubmitSearch();
        }
      );
    }
  }

  public render() {
    return (
      <div id="search-res-comp" className="container mt-3 ml-0">
        <div className="row">
          {/* Search menu */}
          <div className="col-12 col-md-3">
            <div className="dropdown">
              <h6 className="dropdown-header">
                {dictionary.search_results[this.context]}
              </h6>
              <div className="dropdown-divider" />
              <a className="dropdown-item" onClick={this.handlePostsArea}>
                {dictionary.posts_by_content[this.context]}
              </a>
              <a className="dropdown-item" onClick={this.handlePostsAuthorArea}>
                {dictionary.search_by_author[this.context]}
              </a>
              <a className="dropdown-item" onClick={this.handleUsersArea}>
                {dictionary.search_users[this.context]}
              </a>
            </div>
          </div>
          {this.state.postsAreaActive && this.getPostsArea()}
          {this.state.postsAuthorAreaActive && this.getPostsAuthorArea()}
          {this.state.usersAreaActive && this.getUsersArea()}
        </div>
      </div>
    );
  }

  private apiSubmitSearch() {
    let searchUrl = `${location.protocol}//${location.hostname}`;
    searchUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    searchUrl += "/search";
    axios
      .get(searchUrl, {
        params: {
          df: this.state.searchParams.df,
          di: this.state.searchParams.di,
          k: this.state.searchParams.k,
          t: this.state.searchParams.type,
          tags: this.state.searchParams.tags
        }
      })
      .then(res => {
        const r = res.data;
        this.setState({
          authorPosts: r.authorPosts,
          posts: r.posts,
          postsAreaActive: r.retrievePosts || r.retrieveAll,
          postsAuthorAreaActive: r.retrievePostsByAuthor,
          users: r.users,
          usersAreaActive: r.retrieveUsers
        });
      });
  }

  private handlePostsArea() {
    this.setState({
      postsAreaActive: true,
      postsAuthorAreaActive: false,
      usersAreaActive: false
    });
  }

  private handlePostsAuthorArea() {
    this.setState({
      postsAreaActive: false,
      postsAuthorAreaActive: true,
      usersAreaActive: false
    });
  }

  private handleUsersArea() {
    this.setState({
      postsAreaActive: false,
      postsAuthorAreaActive: false,
      usersAreaActive: true
    });
  }

  private getPostsArea() {
    return (
      <div id="search-res-posts-area" className="col-12 col-md-9">
        {this.getPosts()}
      </div>
    );
  }

  private getPostsAuthorArea() {
    return (
      <div id="search-res-posts-author-area" className="col-12 col-md-9">
        {this.getPostsByAuthor()}
      </div>
    );
  }

  private getUsersArea() {
    return (
      <div id="search-res-users-area" className="col-12 col-md-9">
        {this.getUsers()}
      </div>
    );
  }

  private getPosts() {
    const postElements: any[] = [];
    for (const post of this.state.posts) {
      postElements.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          user_id={post.user_id}
          likes={post.likes}
          likers={post.likers || []}
          tags={post.tags || []}
          comments={post.comments || []}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
        />
      );
    }
    return postElements;
  }

  private getPostsByAuthor() {
    const postElements: any[] = [];
    for (const post of this.state.authorPosts) {
      postElements.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          user_id={post.user_id}
          likes={post.likes}
          likers={post.likers || []}
          tags={post.tags || []}
          comments={post.comments || []}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
        />
      );
    }
    return postElements;
  }

  private getUsers() {
    const userElements: any[] = [];
    for (const user of this.state.users) {
      userElements.push(<UserCard key={user.id} {...user} />);
    }
    return userElements;
  }
}
