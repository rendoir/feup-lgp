import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { MouseEvent } from "react";
import CreateNewModal from "../CreateNewModal/CreateNewModal";
import { Request, Step } from "../CreateNewModal/types";
import Icon from "../Icon/Icon";
import "./Header.css";

import PostModal from "../PostModal/PostModal";
import SearchSimpleForm from "../SearchSimpleForm/SearchSimpleForm";

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
    files: {
      docs: File[];
      videos: File[];
      images: File[];
    };
    tags: string[];
    dateStart: string;
    dateEnd: string;
    local: string;
    livestream: string;
    switcher: string;
  };
};

export default class Header extends React.Component<{}, State> {
  public tags: string[];
  constructor() {
    super({});

    this.state = {
      isOpen: false,
      request: {
        about: "",
        avatar: undefined,
        dateEnd: "",
        dateStart: "",
        files: {
          docs: [],
          images: [],
          videos: []
        },
        livestream: "",
        local: "",
        privacy: "public",
        shortname: "",
        switcher: "false",
        tags: [],
        title: "",
        type: "post"
      },
      step: "type"
    };

    this.tags = [];
  }

  public componentDidMount(): void {
    this.getPossibleTags();
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
                <a className="nav-link" href="/user/1">
                  Profile <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="/shop">
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
                  tags={this.tags}
                />
              ) : null}
            </div>
            <PostModal id={0} title="" text="" tags={[]} />
            <a className="nav-link" href="/notifications">
              <span className="text-white h3 pl-3">
                <i className="fas fa-bell" />
              </span>
            </a>
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
      const formData = new FormData();
      request.files.images.forEach((file, idx) =>
        formData.append("images[" + idx + "]", file)
      );
      request.files.videos.forEach((file, idx) =>
        formData.append("videos[" + idx + "]", file)
      );
      request.files.docs.forEach((file, idx) =>
        formData.append("docs[" + idx + "]", file)
      );
      request.tags.forEach((tag, i) => formData.append("tags[" + i + "]", tag));

      formData.append("author", "1");
      formData.append("text", request.about);
      formData.append("title", request.title);
      formData.append("visibility", request.privacy);

      url += "/post/create";
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
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
          author: 1,
          avatar: request.avatar,
          dateEnd: request.dateEnd,
          dateStart: request.dateStart,
          livestream: request.switcher === "true" ? request.livestream : null,
          local: request.local,
          privacy: request.privacy,
          title: request.title
        })
        .then(res => {
          console.log(`Conference with id = ${res.data.id} created`);
          window.location.href = "/conference/" + res.data.id;
          this.resetState();
        })
        .catch(error => console.log("Failed to create conference. " + error));
    }
  };

  private getPossibleTags = (): void => {
    let url = `${location.protocol}//${location.hostname}`;
    url +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    url += `/tags`;

    axios
      .get(url)
      .then(res => {
        res.data.forEach(tag => {
          this.tags.push(tag.name);
        });
      })
      .catch(() => console.log("Failed to get tags"));
  };

  private resetState = () => {
    this.setState({
      isOpen: false,
      request: {
        about: "",
        avatar: undefined,
        dateEnd: "",
        dateStart: "",
        files: {
          docs: [],
          images: [],
          videos: []
        },
        livestream: "",
        local: "",
        privacy: "public",
        shortname: "",
        switcher: "false",
        tags: [],
        title: "",
        type: "post"
      },
      step: "type"
    });
  };
}
