import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import "./SearchSimpleForm.scss";

type State = {
  search: string;
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
  k: string[];
  tags?: string[];
  type?: SearchType;
  di?: string; // initial date
  df?: string; // final date
};

class SearchSimpleForm extends React.Component<
  RouteComponentProps<any>,
  State
> {
  constructor(props: RouteComponentProps<any>) {
    super(props);
    this.state = {
      authorPosts: [],
      posts: [],
      search: "",
      users: []
    };

    this.submitSearch = this.submitSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
      </div>
    );
  }

  private assembleUrlQuery(params: SearchParameters) {
    return Object.keys(params)
      .filter(k => params[k])
      .map(k => {
        return (
          encodeURIComponent(k) +
          "=" +
          encodeURIComponent(JSON.stringify(params[k]))
        );
      })
      .join("&");
  }

  private submitSearch(event: any) {
    event.preventDefault();
    const searchParams = this.processSearchString(this.state.search);
    this.redirectToResults(searchParams);
  }

  // e.g. "bananas --type=post apples --di=20/04/2016 --df=22/05/2019"
  private processSearchString(search: string): SearchParameters {
    const keywords: string[] = [];
    const tags: string[] = [];
    let type;
    let di;
    let df;

    // Matches variables | keywords | tags.
    const pattern = /--([^=]+)=([^\s]+)|#([^\s]+)|([^#\s]+)/g;
    let temp;

    // tslint:disable-next-line: no-conditional-assignment
    while ((temp = pattern.exec(search)) != null) {
      if (temp[3]) {
        tags.push(temp[3]);
      } else if (!temp[0].startsWith("--")) {
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

    const params = {
      df,
      di,
      k: keywords,
      tags,
      type
    };

    return params;
  }

  private redirectToResults(searchParams: SearchParameters) {
    this.props.history.push(`/search?${this.assembleUrlQuery(searchParams)}`);
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
}

export default withRouter(SearchSimpleForm);
