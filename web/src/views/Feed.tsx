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
        content_width={800}
        author={info.author}
        text={info.content}
        text_height={200}
        content_height={200}
        image={undefined}
        image_height={0}
        hasImage={true}
        video={undefined}
        video_height={0}
        hasVideo={false}
        comments={undefined}
      />
    ));

    return <div className="Feed">{posts}</div>;
  }
}

export default Feed;
