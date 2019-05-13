import axios from "axios";
import queryString from "query-string";
import * as React from "react";
import InfiniteScroll from "../components/InfiniteScroll/InfiniteScroll";

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
  t?: SearchType;
  di?: string; // initial date
  df?: string; // final date
};

export default class SearchResults extends React.Component<Props, State> {
  public static contextType = LanguageContext;

  private static getSearchUrl() {
    let searchUrl = `${location.protocol}//${location.hostname}`;
    searchUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    searchUrl += "/search";

    return searchUrl;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      authorPosts: [],
      posts: [],
      postsAreaActive: true,
      postsAuthorAreaActive: false,
      searchParams: {
        ...(queryString.parse(this.props.location.search) as SearchParameters),
        t: 1
      },
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
          t: this.state.searchParams.t,
          tags: this.state.searchParams.tags
        }
      })
      .then(res => {
        const r = res.data;
        this.setState({
          authorPosts: r.authorPosts,
          posts: r.posts,
          postsAreaActive: true,
          postsAuthorAreaActive: false,
          users: r.users,
          usersAreaActive: false
        });
      });
  }

  private handlePostsArea() {
    this.setState({
      postsAreaActive: true,
      postsAuthorAreaActive: false,
      searchParams: {
        ...this.state.searchParams,
        t: 1
      },
      usersAreaActive: false
    });
  }

  private handlePostsAuthorArea() {
    this.setState({
      postsAreaActive: false,
      postsAuthorAreaActive: true,
      searchParams: {
        ...this.state.searchParams,
        t: 2
      },
      usersAreaActive: false
    });
  }

  private handleUsersArea() {
    this.setState({
      postsAreaActive: false,
      postsAuthorAreaActive: false,
      searchParams: {
        ...this.state.searchParams,
        t: 3
      },
      usersAreaActive: true
    });
  }

  private getPostsArea() {
    return (
      <div id="search-res-posts-area" className="col-12 col-md-9">
        <InfiniteScroll
          requestUrl={SearchResults.getSearchUrl()}
          requestParams={this.state.searchParams}
        />
      </div>
    );
  }

  private getPostsAuthorArea() {
    return (
      <div id="search-res-posts-author-area" className="col-12 col-md-9">
        <InfiniteScroll
          requestUrl={SearchResults.getSearchUrl()}
          requestParams={this.state.searchParams}
        />
      </div>
    );
  }

  private getUsersArea() {
    return (
      <div id="search-res-users-area" className="col-12 col-md-9">
        <InfiniteScroll
          requestUrl={SearchResults.getSearchUrl()}
          requestParams={this.state.searchParams}
          type={"users"}
        />
      </div>
    );
  }
}
