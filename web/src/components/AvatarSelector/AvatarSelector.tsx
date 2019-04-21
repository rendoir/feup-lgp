import React, { Component } from "react";

import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { fileToBase64 } from "../../utils/fileToBase64";
import { selectFiles } from "../../utils/selectFiles";
import { AvatarPlaceholder } from "../../utils/types";
import Avatar from "../Avatar/Avatar";
import Icon from "../Icon/Icon";
import styles from "./AvatarSelector.module.css";

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
  public static defaultProps = {
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

  public render() {
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

  public componentWillReceiveProps(nextProps: Props): void {
    if (!nextProps.avatar || typeof nextProps.avatar === "string") {
      this.setState({ avatar: nextProps.avatar });
    } else {
      fileToBase64(nextProps.avatar, avatar => {
        this.setState({ avatar });
      });
    }
  }

  private handleAvatarChangerClick = (): void => {
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

  private renderRemoveIcon() {
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
}

export default AvatarSelector;
