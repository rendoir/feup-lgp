import * as React from "react";
import Avatar from "../Avatar/Avatar";
import styles from "./Chat.module.css";
import stylesComments from "./../Post/Post.module.scss";

type Message = {
  img: string;
  user: string;
  text: string;
  date: string;
};

type Props = {};

type State = {
  messageList: Message[];
};

class Chat extends React.Component<Props, State> {
  public user: number;

  constructor(props: Props) {
    super(props);
    this.user = 1;

    this.state = {
      messageList: []
    };

    setInterval(() => {
      this._onNewMessage({
        img: "",
        user: "User",
        date: "",
        text:
          "DSADHSADJKHSADKAHSDJK SAHKDJSAHFJDHKFAJGSDHFGDSKFJGS ADHFGDSHFGSDHKFGDS HFGDSAKHFGSAHKJFGS DHJFGKHDSGFHS AGDFHJASGDFHGSAD FHJSADGFHSJ"
      });
    }, 250);
  }

  _onNewMessage(message: any) {
    console.log(message);
    this.setState({
      messageList: [...this.state.messageList, message]
    });
  }

  public render() {
    return (
      <div className={styles.chat}>
        <div className={styles.chat_header}>Conference Chat</div>

        <div className={styles.chat_body}>
          <div className={stylesComments.post_comment + " w-100"}>
            {this.getMessages()}
          </div>
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
      <div className={stylesComments.post_comment + " my-3"}>
        <div className={stylesComments.comment_header}>
          <Avatar
            title={msg.user}
            placeholder="empty"
            size={30}
            image="https://picsum.photos/200/200?image=52"
          />
          <div>
            <div className={stylesComments.comment_text}>
              <p>
                <span className={stylesComments.post_author}>{msg.user}</span>
                {msg.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    ));
  }
}

export default Chat;
