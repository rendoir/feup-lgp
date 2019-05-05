import classNames from "classnames";
import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  PureComponent
} from "react";
import { fileToBase64 } from "../../utils/fileToBase64";
import AvatarSelector from "../AvatarSelector/AvatarSelector";
import InputNext, { HTMLAbstractInputElement } from "../InputNext/InputNext";
import Select from "../Select/Select";
import Switcher from "../Switcher/Switcher";
import Tag from "../Tags/Tag";
import styles from "./CreateNewModal.module.css";

export type Props = {
  id: string;
  type: "post" | "conference";
  title: string;
  shortname?: string;
  shortnamePrefix?: string;
  about?: string;
  avatar?: File;
  tags?: string[];
  className?: string;
  vertical: boolean;
  isPublicGroupEnabled: boolean;
  aboutMaxLength?: number;
  onSubmit: (event: Event) => void;
  onChange: (value: string, event: ChangeEvent) => void;
  onAvatarRemove: () => void;
  onAvatarChange: (avatar: File) => void;
  onFileChange: (files: FileList | null) => void;
};

export type State = {
  avatar?: string;
  isPublic: boolean;
  privacy: string;
  files: File[];
  local: string;
  dateStart: string;
  dateEnd: string;
  tags: string[];
  tagsInput: string;
  switcher: boolean;
  livestream: string;
};

class CreateGroupInfoForm extends PureComponent<Props, State> {
  public static defaultProps = {
    aboutMaxLength: 3000,
    vertical: false
  };

  private shortnameInput?: InputNext;
  private tags: string[];

  constructor(props: Props) {
    super(props);
    this.tags = [];

    this.state = {
      avatar: undefined,
      dateEnd: "",
      dateStart: "",
      files: [],
      isPublic: Boolean(props.shortname),
      livestream: "",
      local: "",
      privacy: "public",
      switcher: false,
      tags: [],
      tagsInput: ""
    };
  }

  public render() {
    const { id, type, about, aboutMaxLength, title, vertical } = this.props;
    const className = classNames(
      styles.info,
      {
        [styles.vertical]: vertical
      },
      this.props.className
    );

    return (
      <div className={className}>
        {type === "conference" ? this.renderAvatar() : null}
        <form id={id} autoComplete={"off"} className={styles.form}>
          <InputNext
            className={styles.input}
            id={`${id}_title`}
            name={"title"}
            onChange={this.props.onChange}
            placeholder={`${type} title`}
            label={`Title`}
            value={title}
            htmlAutoFocus={true}
            required={true}
          />
          <InputNext
            className={styles.input}
            id={`${id}_about`}
            name={"about"}
            onChange={this.props.onChange}
            placeholder={`Write a short description of this ${type}`}
            label={`Description`}
            type={"textarea"}
            rows={5}
            value={about || ""}
            maxLength={aboutMaxLength}
            required={true}
          />
          {this.renderPrivacy()}
          {type === "post" ? this.renderPostFields() : null}
          {type === "conference" ? this.renderConferenceFields() : null}
        </form>
      </div>
    );
  }

  public componentDidMount(): void {
    if (this.props.avatar) {
      fileToBase64(this.props.avatar, (avatar: string) =>
        this.setState({ avatar })
      );
    }
  }

  public componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (nextProps.avatar) {
      fileToBase64(nextProps.avatar, avatar => this.setState({ avatar }));
    } else {
      this.setState({ avatar: nextProps.avatar });
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    if (this.shortnameInput) {
      if (prevState.isPublic !== this.state.isPublic && this.state.isPublic) {
        this.shortnameInput.focus();
      }
    }
  }

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    this.props.onSubmit(event);
  };

  private handleChange = (value: string, event: ChangeEvent) => {
    // @ts-ignore
    this.setState({
      [(event.target as HTMLAbstractInputElement).name]: value
    });
    this.props.onChange(value, event);
  };

  private handleLivestreamToggle = (value: boolean, event: ChangeEvent) => {
    this.setState({ switcher: value });
    this.props.onChange(String(value), event);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const tags = this.state.tags;
      if (!tags.includes(this.state.tagsInput)) {
        tags.push(this.state.tagsInput);
      }
      this.setState({ tags, tagsInput: "" });
    }
  };

  private handleRemove = (tag: string): void => {
    const tags = this.state.tags;

    for (let i = 0; i < tags.length; i++) {
      if (tags[i] === tag) {
        tags.splice(i, 1);
        this.setState({ tags });
        break;
      }
    }
  };

  private renderAvatar() {
    const { title } = this.props;
    const { avatar } = this.state;

    return (
      <div className={styles.avatarBlock}>
        <AvatarSelector
          title={title}
          placeholder={"empty"}
          avatar={avatar}
          size={140}
          onRemove={this.props.onAvatarRemove}
          onChange={this.props.onAvatarChange}
        />
      </div>
    );
  }

  private renderPrivacy() {
    const { id, isPublicGroupEnabled } = this.props;
    const options = [
      {
        title: "Public",
        value: "public"
      },
      {
        title: "Followers",
        value: "followers"
      },
      {
        title: "Private",
        value: "private"
      }
    ];

    if (!isPublicGroupEnabled) {
      return null;
    }

    return (
      <div className={styles.shortnameWrapper}>
        <Select
          id={`${id}_privacy`}
          name={"privacy"}
          value={this.state.privacy}
          label={"Privacy"}
          options={options}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  private renderConferenceFields() {
    const { id } = this.props;

    return (
      <div className={styles.shortnameWrapper}>
        <InputNext
          onChange={this.handleChange}
          id={`${id}_conference_local`}
          value={this.state.local}
          name={"local"}
          placeholder={"Conference local"}
          label={"Local"}
        />
        <div id={`${id}_conference_dates`}>
          <label htmlFor={`${id}_conference_dates`} className={styles.dates}>
            Dates
          </label>
          <InputNext
            onChange={this.handleChange}
            id={`${id}_conference_date_start`}
            value={this.state.dateStart}
            name={"dateStart"}
            label={"Start"}
            type={"datetime-local"}
          />
          <InputNext
            onChange={this.handleChange}
            id={`${id}_conference_date_end`}
            value={this.state.dateEnd}
            name={"dateEnd"}
            label={"End"}
            type={"datetime-local"}
          />
        </div>
        <div id={`${id}_conference_livestream`}>
          <label
            htmlFor={`${id}_conference_livestream`}
            className={styles.dates}
          >
            Livestream
          </label>
          <Switcher
            id={`${id}_switcher`}
            name={"switcher"}
            label={"LIVESTREAM"}
            onChange={this.handleLivestreamToggle}
            value={this.state.switcher}
            className={styles.switcher}
          />
          <InputNext
            onChange={this.handleChange}
            id={`${id}_liveStream`}
            value={this.state.livestream}
            name={"livestream"}
            label={"Livestream URL"}
            type={"url"}
            placeholder={"https://www.example.com"}
            disabled={!this.state.switcher}
          />
        </div>
      </div>
    );
  }

  private renderPostFields() {
    const { id } = this.props;

    return (
      <div>
        <InputNext
          onChange={this.handleChange}
          id={`${id}_post_tags`}
          type={"text"}
          value={this.state.tagsInput}
          label={"Tags"}
          name={"tagsInput"}
          list={"possible_tags"}
          onKeyUp={this.handleKeyUp}
        />
        <datalist id={"possible_tags"}>
          {this.props.tags
            ? this.props.tags.map((tag, key) => (
                <option key={"tag_" + key} value={tag} />
              ))
            : null}
        </datalist>
        <div>
          {this.state.tags.map((tag, idx) => {
            return (
              <Tag
                onRemove={this.handleRemove}
                key={idx}
                value={tag}
                id={String(idx)}
              />
            );
          })}
        </div>
        <InputNext
          onChange={(_, e) =>
            this.props.onFileChange((e.target as HTMLInputElement).files)
          }
          id={`${id}_post_files`}
          type={"file"}
          label={"Files"}
          multiple={true}
          name={"files"}
        />
      </div>
    );
  }
}

export default CreateGroupInfoForm;
