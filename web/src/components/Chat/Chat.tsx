import * as React from "react";
import Avatar from "../Avatar/Avatar";
import stylesComments from "./../Post/Post.module.scss";
import styles from "./Chat.module.css";

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
    this.user = "Myself"; // TODO

    this.state = {
      messageList: []
    };

    // TODO DELETE THIS
    setInterval(() => {
      this._onNewMessage({
        date: "12:05 05/03/2019",
        text:
          "This is an actual super hyper mega big message just to test if the css looks good when a message is this big.",
        user: Math.random() < 0.5 ? "Myself" : "User"
      });
    }, 1000);
  }

  public _onNewMessage(message: Message) {
    // console.log(message);
    this.setState({
      messageList: [...this.state.messageList, message]
    });
  }

  public scrollToBottom = () => {
    this.messagesEnd.parentNode.scroll({
      behavior: "smooth",
      left: 0,
      top: this.messagesEnd.offsetTop
    });
  };

  public componentDidMount() {
    this.scrollToBottom();
  }

  public componentDidUpdate() {
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

  public getMessages() {
    return this.state.messageList.map(msg => (
      <div
        key={msg.date + msg.user}
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
