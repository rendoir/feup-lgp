import classNames from "classnames";
import React, { ChangeEvent, PureComponent } from "react";
import { fileToBase64 } from "../../utils/fileToBase64";
import AvatarSelector from "../AvatarSelector/AvatarSelector";
import InputNext, { HTMLAbstractInputElement } from "../InputNext/InputNext";
import Select from "../Select/Select";
import styles from "./CreateNewModal.module.css";

export type Props = {
  id: string;
  type: "post" | "conference";
  title: string;
  shortname?: string;
  shortnamePrefix?: string;
  about?: string;
  avatar?: File;
  className?: string;
  vertical: boolean;
  isPublicGroupEnabled: boolean;
  aboutMaxLength?: number;
  onSubmit: (event: Event) => void;
  onChange: (value: string, event: ChangeEvent) => void;
  onAvatarRemove: () => void;
  onAvatarChange: (avatar: File) => void;
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
};

class CreateGroupInfoForm extends PureComponent<Props, State> {
  public static defaultProps = {
    aboutMaxLength: 3000,
    vertical: false
  };

  private shortnameInput?: InputNext;

  constructor(props: Props) {
    super(props);

    this.state = {
      avatar: undefined,
      dateEnd: "",
      dateStart: "",
      files: [],
      isPublic: Boolean(props.shortname),
      local: "",
      privacy: "public",
      tags: []
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
            value={about || ""}
            maxLength={aboutMaxLength}
            required={true}
          />
          {this.renderPrivacy()}
          {type === "post" ? this.renderFiles() : null}
          {type === "conference" ? this.renderLocalAndDate() : null}
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

  private setShortnameInput = (shortnameInput?: InputNext | null): void => {
    if (shortnameInput) {
      this.shortnameInput = shortnameInput;
    }
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    this.props.onSubmit(event);
  };

  private handlePublicToggle = (isPublic: boolean): void => {
    this.setState({ isPublic });
  };

  private handleChange = (value: string, event: ChangeEvent) => {
    // @ts-ignore
    this.setState({
      [(event.target as HTMLAbstractInputElement).name]: value
    });
    this.props.onChange(value, event);
  };

  private handleTagsChange = (tags: string[], newtags: string[]) => {
    this.setState({ tags: newtags });
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

  private renderLocalAndDate() {
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
      </div>
    );
  }

  private renderFiles() {
    const { id } = this.props;

    return (
      <div>
        <InputNext
          label={"Files"}
          type={"file"}
          multiple={true}
          onChange={this.handleChange}
          id={`${id}_post_video`}
          name={"video"}
          value={""}
        />
      </div>
    );
  }
}

export default CreateGroupInfoForm;
