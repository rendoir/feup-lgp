import * as React from "react";
import openSocket from "socket.io-client";

import { getApiUrl } from "../../services/requests";
import Avatar from "../Avatar/Avatar";
import stylesComments from "./../Post/Post.module.scss";
import styles from "./Chat.module.css";

type Message = {
  id: number;
  user: string;
  text: string;
  date: string;
};

type Props = {};

type State = {
  chatMessage: string;
  messageList: Message[];
};

class Chat extends React.Component<Props, State> {
  public user: string;
  public i: number; // TODO DELETE
  public messagesEnd: any;

  private readonly userId = 1;
  // Following JWT is specific for user_id: 1
  private readonly userJwt = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnTmV0IiwiaWF0IjoxNTU2OTIxNTg5LCJleHAiOjE1ODg0NTc2MDMsImF1ZCI6ImdOZXQiLCJzdWIiOiIxIiwiR2l2ZW5OYW1lIjoiSm9obm55IiwiU3VybmFtZSI6IlJvY2tldCIsIkVtYWlsIjoianJvY2tldEBleGFtcGxlLmNvbSIsInVzZXJfaWQiOiIxIn0.fxc35BDUIpap2TJn0DYDQCUxiH12P0-jxYh2TxdbgXk`;

  private socketIo: SocketIOClient.Socket;

  constructor(props: Props) {
    super(props);
    this.user = "Myself"; // TODO
    this.i = 0; // TODO DELETE

    this.state = {
      chatMessage: "",
      messageList: []
    };

    this.socketIo = openSocket(getApiUrl());
    this.socketIo.on("message", message => {
      const msg: Message = {
        date: "12:05 05/03/2019",
        id: this.i++,
        text: message,
        user: this.user
      };
      this._onNewMessage(msg);
    });

    // TODO DELETE THIS
    // setInterval(() => {
    //   this._onNewMessage({
    //     date: "12:05 05/03/2019",
    //     id: this.i++,
    //     text:
    //       "This is an actual super hyper mega big message just to test if the css looks good when a message is this big.",
    //     user: Math.random() < 0.5 ? "Myself" : "User"
    //   });
    // }, 1000);

    this.onLiveChatSubmit = this.onLiveChatSubmit.bind(this);
    this.onChangeLiveChatMessage = this.onChangeLiveChatMessage.bind(this);
  }

  public _onNewMessage(message: Message) {
    console.log(message);
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

        <form className={styles.chat_footer} onSubmit={this.onLiveChatSubmit}>
          <input
            type="text"
            placeholder="Insert your message here..."
            onChange={this.onChangeLiveChatMessage}
          />
          <button type="submit">
            <i className="fas fa-paper-plane" />
          </button>
        </form>
      </div>
    );
  }

  private async onLiveChatSubmit(event: any) {
    event.preventDefault();
    this.socketIo.emit("message", this.state.chatMessage);
  }

  private onChangeLiveChatMessage(event: any) {
    this.setState({
      chatMessage: event.target.value
    });
  }

  private getMessages() {
    return this.state.messageList.map(msg => (
      <div
        key={msg.id}
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
