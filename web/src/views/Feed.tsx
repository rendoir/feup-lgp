import axios from "axios";
import * as React from "react";
import Post from "../components/Post/Post";
import "../styles/Feed.css";

type Props = {};

type State = {
  posts: any[];
  fetchingInfo: boolean;
};

class Feed extends React.Component<Props, State> {
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
            (post.likers = postsComing.likers[idx]),
            (post.tags = postsComing.tags[idx])
          )
        );

        this.setState({ fetchingInfo: false, posts: postsComing.posts });
      })
      .catch(() => console.log("Failed to get feed"));
  }

  public getPosts() {
    const postsDiv = [];

    for (const post of this.state.posts) {
      postsDiv.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          likes={post.likes}
          images={undefined}
          videos={undefined}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
          comments={post.comments}
          likers={post.likers}
          tags={post.tags}
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

    return (
      <div id="Feed" className="container my-5">
        <div className="row">
          <div className="left col-lg-3 mr-5">
            <h5>Conferences</h5>
            {conferences}
          </div>
          <div className="middle col-lg-8">{this.getPosts()}</div>
        </div>
      </div>
    );
  }
}

export default Feed;
