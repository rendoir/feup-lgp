import * as React from "react";
import InfiniteScroll from "../components/InfiniteScroll/InfiniteScroll";
import Post from "../components/Post/Post";
import "../styles/Feed.css";
import axiosInstance from "../utils/axiosInstance";
import { dictionary, LanguageContext } from "../utils/language";
import withAuth from "../utils/withAuth";

type Props = {};

type State = {
  conferences: any[];
  posts: any[];
  fetchingInfo: boolean;
  following: any[];
};

class Feed extends React.Component<Props, State> {
  public static contextType = LanguageContext;

  constructor(props: Props) {
    super(props);

    this.state = {
      conferences: [],
      fetchingInfo: true,
      following: [],
      posts: []
    };
  }

  public componentDidMount() {
    this.apiGetFeed();
  }

  public apiGetFeed() {
    axiosInstance
      .get("/feed/get_stuff", {
        params: {}
      })
      .then(res => {
        this.setState({
          conferences: res.data.conferences,
          following: res.data.following
        });
      })
      .catch(() => console.log("Failed to get feed stuff"));
  }

  public getPosts() {
    const postsDiv: any[] = [];

    for (const post of this.state.posts) {
      postsDiv.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          content={post.content}
          title={post.title}
          user_id={post.user_id}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
          comments={post.comments}
          tags={post.tags}
          files={post.files}
        />
      );
    }

    return postsDiv;
  }

  public renderUsers() {
    const users = this.state.following.map(name => (
      <a
        id="following-list"
        key={name.first_name}
        className="d-block my-2"
        href={"/user/" + name.id}
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
    const conferences = this.state.conferences.map(conf => (
      <a
        key={conf.title}
        className="d-block my-2"
        href={"/conference/" + conf.id}
      >
        {conf.title} {conf.dateStart}
      </a>
    ));

    return (
      <div id="Feed" className="container my-5">
        <div className="row">
          <div id="leftm">
            <h5>{dictionary.conferences[this.context]}</h5>
            {conferences}
          </div>
          <div id="rightm">
            <h5>{dictionary.followers[this.context]}</h5>
            {this.renderUsers()}
          </div>
          <div id="mainm">
            <InfiniteScroll />
            {/*{this.getPosts()}*/}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Feed);
