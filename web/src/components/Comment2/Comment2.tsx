import {
  faEdit,
  faReply,
  faThumbsUp,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React, { PureComponent, ReactNode } from "react";
import { Icon } from "../../components";
import { AvatarPlaceholder } from "../../utils/types";
import Avatar from "../Avatar/Avatar";
import styles from "./Comment2.module.css";

export type Props = {
  avatar: Avatar;
  id: number;
  userId: string;
  message: string;
  placeholder: AvatarPlaceholder;
  date: string;
  className?: string;
  onChange?: (message: string) => any;
  onDelete?: () => any;
  edited: boolean;
};

class Comment2 extends PureComponent<Props> {
  private static defaultProps = {
    edited: false,
    placeholder: "empty"
  };

  public renderAvatar(): ReactNode {
    const { avatar } = this.props;

    return <div className={styles.avatar}>{avatar}</div>;
  }

  public renderMessage(): ReactNode {
    const { avatar, message, userId, edited } = this.props;

    return (
      <div className={styles.wrapper}>
        <div>
          <a href={`/user/${userId}`} className={styles.title}>
            {avatar.props.title || "unknown"}
          </a>
        </div>
        <div>
          <p className={styles.message}>{message}</p>
          <div className={styles.edited}>{edited ? "(edited)" : null}</div>
        </div>
      </div>
    );
  }

  public renderFooter(): ReactNode {
    return (
      <div className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.link}>
            <Icon icon={faThumbsUp} />
            Like
          </a>
          |
          <a href="#" className={styles.link}>
            <Icon icon={faReply} />
            Reply
          </a>
          |
          <a href="#" className={styles.link}>
            <Icon icon={faEdit} />
            Edit
          </a>
          |
          <a href="#" className={styles.link}>
            <Icon icon={faTrash} />
            Delete
          </a>
        </div>
        <div className={styles.footerLinks}>
          <Icon icon={faThumbsUp} theme="primary" />
          145
        </div>
      </div>
    );
  }

  public render() {
    const { id } = this.props;
    const className = classNames(styles.container, this.props.className);

    return (
      <div id={`comment_${id}`} className={className}>
        {this.renderAvatar()}
        <div>
          {this.renderMessage()}
          {this.renderFooter()}
        </div>
      </div>
    );
  }
}

export default Comment2;
