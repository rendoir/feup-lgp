import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { MouseEvent } from "react";
import * as React from "react";
import CreateNewModal from "../CreateNewModal/CreateNewModal";
import { Request, Step } from "../CreateNewModal/types";
import Icon from "../Icon/Icon";
import "./Header.css";

import PostModal from "../PostModal/PostModal";

type State = {
  isOpen: boolean;
  step: Step;
  request: {
    type: "post" | "conference";
    title: string;
    shortname: string;
    about: string;
    avatar?: File;
    privacy: string;
    video: string;
    image: string;
    dateStart: string;
    dateEnd: string;
    local: string;
  };
};

export default class Header extends React.Component<{}, State> {
  constructor() {
    super({});

    this.state = {
      isOpen: false,
      request: {
        about: "",
        avatar: undefined,
        dateEnd: "",
        dateStart: "",
        image: "",
        local: "",
        privacy: "public",
        shortname: "",
        title: "",
        type: "post",
        video: ""
      },
      step: "type"
    };
  }

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
            <div className="dropdown mx-2">
              <button
                id="dropdownCategories-btn"
                className="btn btn-primary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Search type
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#">
                  <i className="fas fa-book-medical " /> Documents
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fas fa-user " /> Users
                </a>
                <a className="dropdown-item" href="#">
                  <i className=" fas fa-align-justify " /> Posts
                </a>
              </div>
            </div>
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
            <div>
              <a href={"#"} onClick={this.handleClick}>
                <Icon
                  icon={faPlus}
                  size={"2x"}
                  inverse={true}
                  theme={"primary"}
                />
              </a>
              {this.state.isOpen ? (
                <CreateNewModal
                  pending={false}
                  onSubmit={this.handleSubmit}
                  onStepChange={step => this.setState({ step })}
                  maxGroupSize={5}
                  request={this.state.request}
                  onRequestChange={request => this.setState({ request })}
                  onClose={this.resetState}
                  autoFocus={false}
                  step={this.state.step}
                />
              ) : null}
            </div>
            <PostModal
              id={0}
              title=""
              text=""
              images={undefined}
              videos={undefined}
            />
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

  private handleClick = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ isOpen: true });
  };

  private handleSubmit = (request: Request) => {
    let url = `${location.protocol}//${location.hostname}`;
    url +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";

    if (request.type === "post") {
      url += "/post/create";
      axios
        .post(url, {
          author: 1, // This is the logged in user
          text: request.about,
          title: request.title,
          visibility: request.privacy
        })
        .then(res => {
          console.log("Post created - reloading page...");
          window.location.href = "/post/" + res.data.id;
          this.resetState();
        })
        .catch(() => console.log("Failed to create post"));
    } else {
      url += "/conference/create";
      axios
        .post(url, {
          about: request.about,
          avatar: request.avatar,
          dateEnd: request.dateEnd,
          dateStart: request.dateStart,
          local: request.local,
          privacy: request.privacy,
          title: request.title
        })
        .then(res => {
          console.log(`Conference with id = ${res.data.id} created`);
          this.resetState();
        })
        .catch(error => console.log("Failed to create conference. " + error));
    }
  };

  private resetState = () => {
    this.setState({
      isOpen: false,
      request: {
        about: "",
        avatar: undefined,
        dateEnd: "",
        dateStart: "",
        image: "",
        local: "",
        privacy: "public",
        shortname: "",
        title: "",
        type: "post",
        video: ""
      },
      step: "type"
    });
  };
}
