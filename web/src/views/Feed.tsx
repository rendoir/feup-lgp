import axios from "axios";
import * as React from "react";
import Post from "../components/Post/Post";
import "../styles/Feed.css";

type Props = {};

type State = {
  posts: any[];
};

class Feed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
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
        // console.log(res.data);
        this.setState({ posts: res.data });
      })
      .catch(() => console.log("Failed to get feed"));
  }

  public render() {
    const posts = this.state.posts.map(info => (
      <Post
        key={info.id}
        author={info.first_name + " " + info.last_name}
        text={info.content}
        image={undefined}
        hasImage={true}
        video={undefined}
        hasVideo={false}
        comments={undefined}
      />
    ));

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
          <div className="middle col-lg-8">{posts}</div>
        </div>
      </div>
    );
  }
}

export default Feed;
