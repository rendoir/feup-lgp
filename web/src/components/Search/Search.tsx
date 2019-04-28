import * as React from "react";

import "./Search.scss";

export default class Search extends React.Component {
  public render() {
    return (
      <form className="form-inline my-2 my-lg-0">
        <input
          id="search-input"
          className="form-control mr-sm-2"
          type="text"
          placeholder="Search"
        />
        <button className="btn btn-secondary my-2 my-sm-0" type="submit">
          <i className="fas fa-search" />
        </button>
      </form>
    );
  }
}
