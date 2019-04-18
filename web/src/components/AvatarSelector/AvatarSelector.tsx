import React, { Component } from "react";
import classNames from "classnames";
import { selectFiles } from "../../utils/selectFiles";
import { fileToBase64 } from "../../utils/fileToBase64";
import Avatar from "../Avatar/Avatar";
import Icon from "../Icon/Icon";
import styles from "./AvatarSelector.module.css";
import { AvatarPlaceholder } from "../../utils/types";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";

export type Props = {
  className?: string;
  title: string;
  placeholder: AvatarPlaceholder;
  size: number;
  avatar: string | File | undefined;
  onChange: (avatar: File) => void;
  onRemove?: () => void;
};

type State = {
  avatar: string | undefined;
};

class AvatarSelector extends Component<Props, State> {
  static defaultProps = {
    size: 148
  };

  constructor(props: Props) {
    super(props);

    if (!props.avatar || typeof props.avatar === "string") {
      this.state = {
        avatar: props.avatar
      };
    } else {
      this.state = {
        avatar: undefined
      };
      fileToBase64(props.avatar, avatar => {
        this.setState({ avatar });
      });
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (!nextProps.avatar || typeof nextProps.avatar === "string") {
      this.setState({ avatar: nextProps.avatar });
    } else {
      fileToBase64(nextProps.avatar, avatar => {
        this.setState({ avatar });
      });
    }
  }

  handleAvatarChangerClick = (): void => {
    selectFiles(
      files => {
        if (files.length) {
          this.props.onChange(files[0]);
        }
      },
      false,
      "image/*"
    );
  };

  renderRemoveIcon() {
    const { avatar } = this.props;

    if (avatar && this.props.onRemove) {
      return (
        <div className={styles.avatarRemove} onClick={this.props.onRemove}>
          <Icon icon={faTimes} className={styles.avatarRemoveIcon} size="sm" />
        </div>
      );
    }

    return null;
  }

  render() {
    const { title, placeholder, size } = this.props;
    const { avatar } = this.state;
    const className = classNames(styles.container, this.props.className);

    return (
      <div className={className} style={{ width: size, height: size }}>
        <Avatar
          className={styles.avatar}
          size={size}
          title={title}
          image={avatar}
          placeholder={placeholder}
          onClick={this.handleAvatarChangerClick}
        />
        <div
          onClick={this.handleAvatarChangerClick}
          className={styles.avatarChanger}
          id="avatar_selector_button"
        >
          <Icon
            icon={faCamera}
            className={styles.avatarChangerIcon}
            size="1x"
          />
        </div>
        {this.renderRemoveIcon()}
      </div>
    );
  }
}

export default AvatarSelector;
