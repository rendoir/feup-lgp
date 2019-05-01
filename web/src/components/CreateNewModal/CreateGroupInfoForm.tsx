import classNames from "classnames";
import React, { ChangeEvent, PureComponent } from "react";
import { fileToBase64 } from "../../utils/fileToBase64";
import AvatarSelector from "../AvatarSelector/AvatarSelector";
import InputNext, { HTMLAbstractInputElement } from "../InputNext/InputNext";
import Switcher from "../Switcher/Switcher";
import styles from "./CreateNewModal.module.css";

export type Props = {
  id: string;
  type: "group" | "channel";
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
  onChange: (
    value: string,
    event: ChangeEvent<HTMLAbstractInputElement>
  ) => void;
  onAvatarRemove: () => void;
  onAvatarChange: (avatar: File) => void;
};

export type State = {
  avatar?: string;
  isPublic: boolean;
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
      isPublic: Boolean(props.shortname)
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
        {this.renderAvatar()}
        <form id={id} autoComplete={"off"} className={styles.form}>
          <InputNext
            className={styles.input}
            id={`${id}_title`}
            name={"title"}
            onChange={this.props.onChange}
            placeholder={`CreateNewModal.${type}.info.title.placeholder`}
            label={`CreateNewModal.${type}.info.title.label`}
            value={title}
            htmlAutoFocus={true}
          />
          <InputNext
            className={styles.input}
            id={`${id}_about`}
            name={"about"}
            onChange={this.props.onChange}
            placeholder={`CreateNewModal.${type}.info.description.placeholder`}
            label={`CreateNewModal.${type}.info.description.label`}
            type={"textarea"}
            value={about || ""}
            maxLength={aboutMaxLength}
          />
          {this.renderShortname()}
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

  private renderShortname() {
    const { type, shortname, id, isPublicGroupEnabled } = this.props;

    if (!isPublicGroupEnabled) {
      return null;
    }

    return (
      <div className={styles.shortnameWrapper}>
        <Switcher
          id={`${id}_public_switcher`}
          name={`${id}_public_switcher`}
          value={this.state.isPublic}
          onChange={this.handlePublicToggle}
          label={`CreateNewModal.${type}.public`}
          className={styles.switcher}
        />
        <InputNext
          id={`${id}_shortname`}
          name={"shortname"}
          value={shortname || ""}
          prefix={this.props.shortnamePrefix}
          disabled={!this.state.isPublic}
          label={`CreateNewModal.${type}.info.shortname`}
          ref={this.setShortnameInput}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default CreateGroupInfoForm;
