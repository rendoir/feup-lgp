import {
  faEdit,
  faReply,
  faThumbsUp,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React, { MouseEvent, PureComponent, ReactNode } from "react";
import { Avatar, Icon, InputNext } from "../../components";
import { AvatarPlaceholder } from "../../utils/types";
import styles from "./Comment2.module.css";
import { dictionary, LanguageContext } from "../../utils/language";

export type Props = {
  avatar: Avatar;
  id: number;
  userId: string;
  message: string;
  placeholder: AvatarPlaceholder;
  date: string;
  className?: string;
  onChange?: (message: string) => any;
  edited: boolean;
  reply: boolean;
  replies?: Comment2[];
  liked: boolean;
  likes: number;
  withInput: boolean;
  withReplyInput: boolean;
};

type State = {
  likes: number;
  liked: boolean;
  message: string;
};

class Comment2 extends PureComponent<Props, State> {
  static contextType = LanguageContext;

  private static defaultProps = {
    edited: false,
    liked: false,
    likes: 0,
    message: "",
    placeholder: "empty",
    reply: false,
    withInput: true,
    withReplyInput: false
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      liked: this.props.liked,
      likes: this.props.likes,
      message: ""
    };

    this.handleLike = this.handleLike.bind(this);
  }

  public handleLike(event: MouseEvent): void {
    event.preventDefault();

    this.setState(state => {
      return {
        liked: !state.liked,
        likes: state.liked ? state.likes - 1 : state.likes + 1
      };
    });
  }

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
    const { reply } = this.props;

    return (
      <div className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.link} onClick={this.handleLike}>
            <Icon icon={faThumbsUp} />
            {dictionary.like_action[this.context]}
          </a>
          {reply ? null : (
            <a href="#" className={styles.link}>
              <Icon icon={faReply} />
              {dictionary.reply_action[this.context]}
            </a>
          )}
          <a href="#" className={styles.link}>
            <Icon icon={faEdit} />
            {dictionary.edit_action[this.context]}
          </a>
          <a href="#" className={styles.link}>
            <Icon icon={faTrash} />
            {dictionary.delete_action[this.context]}
          </a>
        </div>
        <div className={styles.footerLinks}>
          <Icon icon={faThumbsUp} theme="primary" />
          {this.state.likes}
        </div>
      </div>
    );
  }

  public renderReplies(): ReactNode {
    const { replies } = this.props;

    if (!replies) {
      return null;
    }

    return <div className={styles.replies}>{replies}</div>;
  }

  public renderInput(): ReactNode {
    const { withInput, reply } = this.props;

    if (!withInput || reply) {
      return null;
    }

    return (
      <div className={styles.inputWrapper}>
        {this.renderAvatar()}
        <div className={styles.input}>
          <InputNext
            onChange={message => this.setState({ message })}
            value={this.state.message}
            id={"1"}
            placeholder={dictionary.insert_comment_placeholder[this.context]}
          />
        </div>
      </div>
    );
  }

  public render() {
    const { id } = this.props;
    const className = classNames(styles.container, this.props.className);

    return (
      <div className={styles.comments}>
        <div id={`comment_${id}`} className={className}>
          {this.renderAvatar()}
          <div>
            {this.renderMessage()}
            {this.renderFooter()}
            {this.renderReplies()}
          </div>
        </div>
        {this.renderInput()}
      </div>
    );
  }
}

export default Comment2;
