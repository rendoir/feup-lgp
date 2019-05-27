import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import openSocket from 'socket.io-client';

import { getApiURL } from '../../utils/apiURL';

import { dictionary, LanguageContext } from '../../utils/language';

import Avatar from '../Avatar/Avatar';
import stylesComments from './../Post/Post.module.scss';
import styles from './Chat.module.css';

type Message = {
  id: number;
  user: string;
  text: string;
  date: string;
};

type State = {
  chatMessage: string;
  messageList: Message[];
};

class Chat extends React.Component<RouteComponentProps<any>, State> {
  public static contextType = LanguageContext;

  private user: string;
  private i: number; // TODO DELETE
  private messagesEnd: any;

  private socketIo: SocketIOClient.Socket;
  private ioNamespace: number;

  constructor(props: RouteComponentProps<any>) {
    super(props);
    this.user = 'Myself'; // TODO: Should be login name
    this.i = 0; // TODO DELETE
    this.ioNamespace = this.props.match.params.id;

    this.state = {
      chatMessage: '',
      messageList: []
    };

    this.socketIo = openSocket(getApiURL(''));
    this.socketIo.emit('groupConnect', this.ioNamespace); // guarantee namespace exists in backend
    setTimeout(() => {
      // leave enough time for backend to have created namespace
      const localSocketIo = openSocket(getApiURL(`/${this.ioNamespace}`));
      localSocketIo.on('message', (msg: Message) => {
        this._onNewMessage(msg);
      });
    }, 1500);

    this.onLiveChatSubmit = this.onLiveChatSubmit.bind(this);
    this.onChangeLiveChatMessage = this.onChangeLiveChatMessage.bind(this);
  }

  public _onNewMessage(message: Message) {
    console.log(message);
    message.id = this.i++;
    this.setState({
      messageList: [...this.state.messageList, message]
    });
  }

  public scrollToBottom = () => {
    this.messagesEnd.parentNode.scroll({
      behavior: 'smooth',
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
        <div className={styles.chat_header}>
          {dictionary.talk_chat[this.context]}
        </div>

        <div className={styles.chat_body}>
          <div className={stylesComments.post_comment + ' w-100'}>
            {this.getMessages()}
          </div>
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </div>

        <form className={styles.chat_footer} onSubmit={this.onLiveChatSubmit}>
          <input
            type="text"
            placeholder={dictionary.chat_message_placeholder[this.context]}
            onChange={this.onChangeLiveChatMessage}
            value={this.state.chatMessage}
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
    const msg = {
      date: '12:05 05/03/2019',
      text: this.state.chatMessage,
      user: this.user
    };
    console.log(this.socketIo);
    this.socketIo.emit('message', {
      msg,
      namespace: this.ioNamespace
    });
    this.setState({
      chatMessage: ''
    });
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
          ' w-75 mx-3 my-3 ' +
          (this.user === msg.user ? styles.right : '')
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
                ' ' +
                (this.user === msg.user ? styles.glintt_bg : '')
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
                ' my-1 ' +
                (this.user === msg.user ? 'ml-auto float-right mr-2' : 'ml-3')
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

export default withRouter(Chat);
