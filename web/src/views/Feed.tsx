import axios from "axios";
import * as React from "react";
import Post from "../components/Post/Post";
import "../styles/Feed.css";
import { dictionary, LanguageContext } from "../utils/language";

type Props = {};

type State = {
  posts: any[];
  fetchingInfo: boolean;
};

class Feed extends React.Component<Props, State> {
  public static contextType = LanguageContext;

  constructor(props: Props) {
    super(props);

    this.state = {
      fetchingInfo: true,
      posts: []
    };
  }

  public componentDidMount() {
    this.apiGetFeed();
  }

  public apiGetFeed() {
    let feedUrl = `${location.protocol}//${location.hostname}`;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      feedUrl += `:${process.env.REACT_APP_API_PORT}/feed`;
    } else {
      feedUrl += "/api/feed";
    }
    axios
      .get(feedUrl, {
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        },
        params: {}
      })
      .then(res => {
        const postsComing = res.data;

        postsComing.posts.map(
          (post: any, idx: any) => (
            (post.comments = postsComing.comments[idx]),
            (post.tags = postsComing.tags[idx]),
            (post.files = postsComing.files[idx])
          )
        );

        this.setState({ fetchingInfo: false, posts: postsComing.posts });
      })
      .catch(() => console.log("Failed to get feed"));
  }

  public getPosts() {
    const postsDiv: any[] = [];

    for (const post of this.state.posts) {
      postsDiv.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
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

  public render() {
    if (this.state.fetchingInfo) {
      return null;
    }

    const hardCodedConferences = [
      "Conference 1",
      "Conference 45465",
      "Conference 45",
      "Conference 46848",
      "Big Conference name to test css properly, omg this name is not over yet"
    ];

    const conferences = hardCodedConferences.map(title => (
      <a key={title} className="conference-link d-block my-2">
        {title}
      </a>
    ));

    const hardCodedNews = [
      "Too much dietary fat in the brain may impact mental health",
      "Fibromyalgia: Is insulin resistance 'the missing link?'",
      "Eat walnuts to lower blood pressure, new study suggests",
      "Depression: Exercise may reduce symptoms but not in women"
    ];

    const news = hardCodedNews.map(title => (
      <a key={title} className="conference-link d-block my-2">
        {title}
      </a>
    ));

    return (
      <div id="Feed" className="container mt-5">
        <div className="row">
          <div className="left col-2 column-in-center">
            <h5>{dictionary.conferences[this.context]}</h5>
            {conferences}
          </div>
          <div className="middle col-lg-7 column-in-center">
            {this.getPosts()}
          </div>
          <div className="right col-2 column-in-center">
            <h5>{dictionary.news[this.context]}</h5>
            {news}
          </div>
        </div>
      </div>
    );
  }
}

export default Feed;
