import * as React from "react";
import axios from "axios";
import Post from "../components/Post/Post";

interface Props {}

interface State {
  posts: Array<any>;
}

class Feed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  componentDidMount() {
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
        //console.log(res.data);
        this.setState({ posts: res.data });
      })
      .catch(() => console.log("Failed to get feed"));
  }

  public render() {
    let posts = this.state.posts.map(info => (
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

    return (
      <div id="Feed" className="container">
        {posts}
        <div className="row">
          <div className="col-sm">One of three columns</div>
          <div className="col-sm">One of three columns</div>
          <div className="col-sm">One of three columns</div>
        </div>
      </div>
    );
  }
}

export default Feed;
