import {
  faClinicMedical,
  faPlus,
  faUserMd
} from "@fortawesome/free-solid-svg-icons";
import React, { MouseEvent, PureComponent } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { RouteComponentProps, withRouter } from "react-router";

import AuthHelperMethods from "../../utils/AuthHelperMethods";
import axiosInstance from "../../utils/axiosInstance";
import { dictionary, LanguageContext } from "../../utils/language";
import CreateNewModal from "../CreateNewModal/CreateNewModal";
import { Request, Step } from "../CreateNewModal/types";
import Icon from "../Icon/Icon";
import SearchSimpleForm from "../SearchSimpleForm/SearchSimpleForm";
import Select from "../Select/Select";
import styles from "./Header.module.css";

type Props = {
  title: string;
  onSearchClick?: (text: string, event: MouseEvent) => any;
  onProfileClick?: (event: MouseEvent) => any;
  onLanguageChange: (lang: string) => any;
};

type State = {
  search: string;
  isOpen: boolean;
  step: Step;
  request: {
    type: "post" | "conference";
    title: string;
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

class Header extends PureComponent<RouteComponentProps<{}> & Props, State> {
  public static contextType = LanguageContext;
  private auth = new AuthHelperMethods();
  private tags: string[];

  constructor(props) {
    super(props);

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
        switcher: "false",
        tags: [],
        title: "",
        type: "post"
      },
      search: "",
      step: "type"
    };

    this.tags = [];
  }

  public componentDidMount(): void {
    this.getPossibleTags();
  }

  public render() {
    return (
      <Navbar
        collapseOnSelect={true}
        className={styles.container}
        expand={"lg"}
        variant={"dark"}
        sticky={"top"}
      >
        {this.renderBrand()}
        <Navbar.Toggle aria-controls={"navbar-nav"} />
        <Navbar.Collapse id={"navbar-nav"}>
          {this.renderLinks()}
          <SearchSimpleForm />
          {this.renderLanguageSelector()}
          {this.renderButtons()}
        </Navbar.Collapse>
      </Navbar>
    );
  }

  private renderLanguageSelector() {
    return (
      <div className={styles.language_wrapper + " my-auto"}>
        <Select
          className="my-auto"
          id="language_selector"
          value={this.context}
          options={[
            { value: "EN", title: "English" },
            { value: "PT", title: "Português" }
          ]}
          onChange={this.props.onLanguageChange}
        />
      </div>
    );
  }

  private renderBrand() {
    const { title } = this.props;

    return (
      <Navbar.Brand href={"/"} className={styles.logo}>
        <Icon icon={faClinicMedical} size={"lg"} className={styles.icon} />
        {title}
      </Navbar.Brand>
    );
  }

  private renderLinks() {
    return (
      <Nav className={"mr-auto"}>
        <Nav.Link href={"/"} className={styles.link}>
          {dictionary.home[this.context]}
        </Nav.Link>
        <Nav.Link href={"/shop"} className={styles.link}>
          {dictionary.shop[this.context]}
        </Nav.Link>
      </Nav>
    );
  }

  private renderButtons() {
    return (
      <Nav>
        <Nav.Link href={"#"} onClick={this.handleClick} className={styles.link}>
          <Icon
            icon={faPlus}
            size={"lg"}
            inverse={true}
            theme={"primary"}
            className={"mr-1"}
          />
          {dictionary.new[this.context]}
        </Nav.Link>
        <NavDropdown
          alignRight={true}
          title={
            <div style={{ display: "inline-block" }} className={styles.link}>
              <Icon icon={faUserMd} size={"lg"} className={styles.icon} />{" "}
              {dictionary.user_dropdown[this.context]}
            </div>
          }
          id="header_user_dropdown"
        >
          <NavDropdown.Item href="/user/me">
            {dictionary.profile[this.context]}
          </NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">
            {dictionary.edit_profile[this.context]}
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={this.onClickLogout}>
            {dictionary.logout[this.context]}
          </NavDropdown.Item>
        </NavDropdown>
        {this.state.isOpen ? (
          <CreateNewModal
            pending={false}
            onSubmit={this.handleSubmit}
            maxGroupSize={5}
            request={this.state.request}
            onStepChange={step => this.setState({ step })}
            onClose={this.resetState}
            onRequestChange={request => this.setState({ request })}
            autoFocus={false}
            step={this.state.step}
            tags={this.tags}
          />
        ) : null}
      </Nav>
    );
  }

  private onClickLogout = (event: any) => {
    this.auth.logout();
    window.location.reload();
  };

  private handleClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.setState({ isOpen: true });
  };

  private handleSubmit = (request: Request) => {
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

      axiosInstance
        .post("/post/create", formData, {
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
      axiosInstance
        .post("/conference/create", {
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
    axiosInstance
      .get("/tags")
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
        switcher: "false",
        tags: [],
        title: "",
        type: "post"
      },
      search: "",
      step: "type"
    });
  };
}

export default withRouter(Header);
