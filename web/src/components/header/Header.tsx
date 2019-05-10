import {
  faClinicMedical,
  faPlus,
  faUserMd
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { MouseEvent, PureComponent } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import CreateNewModal from "../CreateNewModal/CreateNewModal";
import { Request, Step } from "../CreateNewModal/types";
import Icon from "../Icon/Icon";
import SearchSimpleForm from "../SearchSimpleForm/SearchSimpleForm";
import styles from "./Header.module.css";
import Select from "../Select/Select";
import { dictionary, LanguageContext } from "../../utils/language";

type Props = {
  title: string;
  searchBar: boolean;
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

class Header extends PureComponent<Props, State> {
  static contextType = LanguageContext;

  public static defaultProps = {
    logoRedirectToHome: false,
    searchBar: false
  };

  private tags: string[];

  constructor(props: Props) {
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
          {this.renderButtons()}
        </Navbar.Collapse>
      </Navbar>
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
        <Select
          className="my-auto mx-2"
          id="language_selector"
          value={this.context}
          options={[
            { value: "EN", title: "English" },
            { value: "PT", title: "Português" }
          ]}
          onChange={this.props.onLanguageChange}
        />
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
        <Nav.Link href={"/user/1"} className={styles.link}>
          <Icon icon={faUserMd} size={"lg"} className={styles.icon} />
          {dictionary.profile[this.context]}
        </Nav.Link>
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

  private handleClick = (event: MouseEvent): void => {
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

export default Header;
