import axios from "axios";
import * as React from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";

import "./SearchSimple.scss";

type State = {
  search: string;
  redirect: boolean;
  authorPosts: any[];
  posts: any[];
  users: any[];
};

enum SearchType {
  post,
  author,
  user
}

type SearchParameters = {
  keywords: string[];
  type?: SearchType;
  di?: string; // initial date
  df?: string; // final date
  [key: string]: SearchType | string[] | string | undefined;
};

class SearchSimple extends React.Component<RouteComponentProps<any>, State> {
  constructor(props: RouteComponentProps<any>) {
    super(props);
    this.state = {
      authorPosts: [],
      posts: [],
      redirect: false,
      search: "",
      users: []
    };

    this.submitSearch = this.submitSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public componentDidUpdate(prevProps: RouteComponentProps<any>) {
    if (this.props.location !== prevProps.location) {
      this.setState({ redirect: false });
    }
  }

  public render() {
    return (
      <div id="search-comp">
        <form
          id="search-comp"
          className="form-inline my-2 my-lg-0"
          onSubmit={this.submitSearch}
        >
          <input
            id="search-input"
            className="form-control mr-sm-2"
            type="text"
            name="search"
            onChange={this.handleInputChange}
            placeholder="Search"
          />
          <button className="btn btn-secondary my-2 my-sm-0" type="submit">
            <i className="fas fa-search" />
          </button>
        </form>
        {this.renderRedirect()}
      </div>
    );
  }

  private submitSearch(event: any) {
    event.preventDefault();
    const searchParams = this.processSearchString(this.state.search);
    this.apiSubmitSearch(searchParams);
  }

  // e.g. "bananas --type=post apples --di=20/04/2016 --df=22/05/2019"
  private processSearchString(search: string): SearchParameters {
    const keywords = [];
    let type;
    let di;
    let df;

    // Matches variables | keywords.
    const pattern = /--([^=]+)=([^\s]+)|([^-\s]{2}[^\s]*)/g;
    let temp;

    // tslint:disable-next-line: no-conditional-assignment
    while ((temp = pattern.exec(search)) != null) {
      if (!temp[0].startsWith("--")) {
        keywords.push(temp[0]);
      } else if (temp[1] === "type") {
        type = (temp[2] as unknown) as SearchType;
      } else if (temp[1] === "di") {
        di = temp[2];
      } else if (temp[1] === "df") {
        df = temp[2];
      } else {
        console.error("?");
      }
    }

    return {
      df,
      di,
      keywords,
      type
    };
  }

  private apiSubmitSearch(searchParams: SearchParameters) {
    let searchUrl = `${location.protocol}//${location.hostname}`;
    searchUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    searchUrl += "/search";
    axios
      .get(searchUrl, {
        params: {
          df: searchParams.df,
          di: searchParams.di,
          k: JSON.stringify(searchParams.keywords),
          t: searchParams.type
        }
      })
      .then(res => {
        this.setState({
          authorPosts: res.data.authorPosts,
          posts: res.data.posts,
          redirect: true,
          users: res.data.users
        });
      });
  }

  private handleInputChange(event: any) {
    const field = event.target.name;
    const value = !event.target.value.replace(/\s/g, "").length
      ? ""
      : event.target.value; // Ignore input only containing white spaces

    const partialState: any = {};
    partialState[field] = value;
    this.setState(partialState);
  }

  private renderRedirect() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/search/",
            state: {
              authorPosts: this.state.authorPosts,
              posts: this.state.posts,
              postsAreaActive: true,
              users: this.state.users
            }
          }}
        />
      );
    }
  }
}

export default withRouter(SearchSimple);
