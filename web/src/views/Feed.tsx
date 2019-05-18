import * as React from 'react';
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll';
import '../styles/Feed.css';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

type Props = {};

type State = {
  talks: any[];
  posts: any[];
  fetchingInfo: boolean;
  following: any[];
};

class Feed extends React.Component<Props, State> {
  public static contextType = LanguageContext;

  constructor(props: Props) {
    super(props);

    this.state = {
      fetchingInfo: true,
      following: [],
      posts: [],
      talks: []
    };
  }

  public componentDidMount() {
    this.apiGetFeed();
  }

  public apiGetFeed() {
    axiosInstance
      .get('/feed/get_stuff', {
        params: {}
      })
      .then(res => {
        this.setState({
          following: res.data.following,
          talks: res.data.talks
        });
      })
      .catch(() => console.log('Failed to get feed stuff'));
  }

  public renderUsers() {
    const users = this.state.following.map(name => (
      <a
        id="following-list"
        key={name.first_name}
        className="d-block my-2"
        href={'/user/' + name.id}
      >
        {name.first_name} {name.last_name}
      </a>
    ));
    if (this.state.following.length !== 0) {
      return <div>{users}</div>;
    } else {
      return <a id="no-follows">{dictionary.following[this.context]}</a>;
    }
  }

  public render() {
    const talks = this.state.talks.map(talk => (
      <a key={talk.id} className="d-block my-2" href={'/talk/' + talk.id}>
        {talk.title} {talk.dateStart}
      </a>
    ));

    return (
      <div id="Feed" className="container my-5">
        <div className="row">
          <div id="leftm">
            <h5>{dictionary.talks[this.context]}</h5>
            {talks}
          </div>
          <div id="rightm">
            <h5>{dictionary.followers[this.context]}</h5>
            {this.renderUsers()}
          </div>
          <div id="mainm">
            <InfiniteScroll />
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Feed);
