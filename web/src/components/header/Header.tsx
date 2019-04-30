import * as React from "react";
import "./Header.css";

import PostModal from "../PostModal/PostModal";
import SearchSimpleForm from "../SearchSimpleForm/SearchSimpleForm";

export default class Header extends React.Component {
  public render() {
    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="/">
            {" "}
            <i className="fas fa-clinic-medical fa-lg" />{" "}
            <span className="notranslate">gNet</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="#">
                  Profile <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="shop">
                  Shop <span className="sr-only">(current)</span>
                </a>
              </li>
            </ul>
            <SearchSimpleForm />
            <a
              className="nav-link"
              data-toggle="modal"
              role="button"
              data-target="#post_modal_Create"
            >
              <span className="text-white h3 pl-3">
                <i className="fas fa-plus-square" />
              </span>
            </a>
            <PostModal id={0} title="" text="" />
            <a className="nav-link" href="#">
              <span className="text-white h3 pl-3">
                <i className="fas fa-user-md" />
              </span>
            </a>
          </div>
        </nav>
      </header>
    );
  }
}
