import classNames from "classnames";
import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  PureComponent
} from "react";
import { fileToBase64 } from "../../utils/fileToBase64";
import { dictionary, LanguageContext } from "../../utils/language";
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
  about: string;
  avatar?: File;
  local: string;
  dateStart: string;
  dateEnd: string;
  switcher: string;
  livestream: string;
  privacy: string;
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
  onTagChange: (tag: string) => any;
};

export type State = {
  avatar?: string;
  files: File[];
  tags: string[];
  tagsInput: string;
};

class CreateGroupInfoForm extends PureComponent<Props, State> {
  public static contextType = LanguageContext;

  public static defaultProps = {
    about: "",
    aboutMaxLength: 3000,
    dateEnd: "",
    dateStart: "",
    livestream: "",
    local: "",
    privacy: "public",
    switcher: "false",
    title: "",
    vertical: false
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      avatar: undefined,
      files: [],
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
            placeholder={dictionary.title[this.context]}
            label={dictionary.title[this.context]}
            value={title}
            htmlAutoFocus={true}
            required={true}
          />
          <InputNext
            className={styles.input}
            id={`${id}_about`}
            name={"about"}
            onChange={this.props.onChange}
            placeholder={dictionary.description_placeholder[this.context]}
            label={dictionary.description[this.context]}
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
    this.props.onChange(String(value), event);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const tags = this.state.tags;
      if (!tags.includes(this.state.tagsInput)) {
        tags.push(this.state.tagsInput);
      }
      this.setState({ tags, tagsInput: "" });
      this.props.onTagChange(this.state.tagsInput);
    }
  };

  private handleTagRemove = (tag: string) => {
    let tags = this.state.tags;

    tags = tags.filter(x => x !== tag);

    this.setState({ tags });
    this.props.onTagChange(tag);
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
        title: dictionary.visibility_public[this.context],
        value: "public"
      },
      {
        title: dictionary.visibility_followers[this.context],
        value: "followers"
      },
      {
        title: dictionary.visibility_private[this.context],
        value: "private"
      }
    ];

    if (!isPublicGroupEnabled) {
      return null;
    }

    return (
      <div className={styles.Wrapper}>
        <Select
          id={`${id}_privacy`}
          name={"privacy"}
          value={this.props.privacy}
          label={dictionary.visibility[this.context]}
          options={options}
          onChange={this.props.onChange}
        />
      </div>
    );
  }

  private renderConferenceFields() {
    const { id, local } = this.props;

    return (
      <div className={styles.shortnameWrapper}>
        <InputNext
          onChange={this.props.onChange}
          id={`${id}_conference_local`}
          value={local}
          name={"local"}
          placeholder={dictionary.conference_local[this.context]}
          label={dictionary.location[this.context]}
        />
        <div id={`${id}_conference_dates`}>
          <label htmlFor={`${id}_conference_dates`} className={styles.dates}>
            {dictionary.dates[this.context]}
          </label>
          <InputNext
            onChange={this.props.onChange}
            id={`${id}_conference_date_start`}
            value={this.props.dateStart}
            name={"dateStart"}
            label={dictionary.date_start[this.context]}
            type={"datetime-local"}
          />
          <InputNext
            onChange={this.props.onChange}
            id={`${id}_conference_date_end`}
            value={this.props.dateEnd}
            name={"dateEnd"}
            label={dictionary.date_end[this.context]}
            type={"datetime-local"}
          />
        </div>
        <div id={`${id}_conference_livestream`}>
          <label
            htmlFor={`${id}_conference_livestream`}
            className={styles.dates}
          >
            {dictionary.livestream[this.context]}
          </label>
          <Switcher
            id={`${id}_switcher`}
            name={"switcher"}
            label={dictionary.livestream[this.context]}
            onChange={this.handleLivestreamToggle}
            value={this.props.switcher === "true"}
            className={styles.switcher}
          />
          <InputNext
            onChange={this.handleChange}
            id={`${id}_liveStream`}
            value={this.props.livestream}
            name={"livestream"}
            label={dictionary.livestream_url[this.context]}
            type={"url"}
            placeholder={"https://www.youtube.com/embed/<id>"}
            disabled={!(this.props.switcher === "true")}
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
          label={dictionary.tags[this.context]}
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
        {this.state.tags.map((tag, idx) => (
          <Tag
            onRemove={this.handleTagRemove}
            key={idx}
            value={tag}
            id={String(idx)}
          />
        ))}
        <InputNext
          onChange={(_, e) =>
            this.props.onFileChange((e.target as HTMLInputElement).files)
          }
          id={`${id}_post_files`}
          type={"file"}
          label={dictionary.files[this.context]}
          multiple={true}
          name={"files"}
        />
      </div>
    );
  }
}

export default CreateGroupInfoForm;
