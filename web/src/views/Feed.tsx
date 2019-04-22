import axios from "axios";
import * as React from "react";
import Post from "../components/Post/Post";
import "../styles/Feed.css";

interface Props {}

interface State {
  posts: any[];
}

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
    axios
      .get("https://localhost:8443/feed/", {
        params: {},
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        // console.log(res.data);
        this.setState({ posts: res.data });
      })
      .catch(() => console.log("Failed to get feed"));
  }

  public render() {
    const posts = this.state.posts.map((info, idx) => (
      <Post
        key={info.id}
        id={info.id}
        author={info.first_name + " " + info.last_name}
        text={info.content}
        images={undefined}
        videos={undefined}
        comments={[]}
        title=""
        date=""
        content_width={screen.width}
      />
    ));

    let hardCodedConferences = [
      "Conference 1",
      "Conference 45465",
      "Conference 45",
      "Conference 46848",
      "Big Conference name to test css properly, omg this name is not over yet"
    ];
    let conferences = hardCodedConferences.map(title => (
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
