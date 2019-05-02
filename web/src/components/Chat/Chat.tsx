import * as React from "react";
import Avatar from "../Avatar/Avatar";
import styles from "./Chat.module.css";
import stylesComments from "./../Post/Post.module.scss";

type Message = {
  user: string;
  text: string;
  date: string;
};

type Props = {};

type State = {
  messageList: Message[];
};

class Chat extends React.Component<Props, State> {
  public user: string;
  public messagesEnd: any;

  constructor(props: Props) {
    super(props);
    this.user = "Myself";

    this.state = {
      messageList: []
    };

    setInterval(() => {
      this._onNewMessage({
        user: Math.random() < 0.5 ? "Myself" : "User",
        date: "12:05 05/03/2019",
        text:
          "This is an actual super hyper mega big message just to test if the css looks good when a message is this big."
      });
    }, 1000);
  }

  _onNewMessage(message: Message) {
    this.setState({
      messageList: [...this.state.messageList, message]
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.parentNode.scroll({
      top: this.messagesEnd.offsetTop,
      left: 0,
      behavior: "smooth"
    });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  public render() {
    return (
      <div className={styles.chat}>
        <div className={styles.chat_header}>Conference Chat</div>

        <div className={styles.chat_body}>
          <div className={stylesComments.post_comment + " w-100"}>
            {this.getMessages()}
          </div>
          <div
            style={{ float: "left", clear: "both" }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </div>

        <div className={styles.chat_footer}>
          <input type="text" placeholder="Insert your message here..." />
          <button>
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>
    );
  }

  getMessages() {
    return this.state.messageList.map(msg => (
      <div
        className={
          stylesComments.post_comment +
          " w-75 mx-3 my-3 " +
          (this.user === msg.user ? styles.right : "")
        }
      >
        <div className={stylesComments.comment_header}>
          {this.user !== msg.user ? (
            <Avatar
              title={msg.user}
              placeholder="empty"
              size={30}
              image="https://picsum.photos/200/200?image=52"
            />
          ) : null}

          <div>
            <div
              className={
                stylesComments.comment_text +
                " " +
                (this.user === msg.user ? styles.glintt_bg : "")
              }
            >
              <p>
                {this.user !== msg.user ? (
                  <span className={stylesComments.post_author}>{msg.user}</span>
                ) : null}
                {msg.text}
              </p>
            </div>
            <div
              className={
                styles.date +
                " my-1 " +
                (this.user === msg.user ? "ml-auto float-right mr-2" : "ml-3")
              }
            >
              {msg.date}
            </div>
          </div>
        </div>
      </div>
    ));
  }
}

export default Chat;
