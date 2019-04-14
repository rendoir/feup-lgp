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
      posts: ['post1', 'post2']
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
        title=""
        content_width={screen.width / 1.2}
        author="John Doe"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        text_height={96}
        video="https://www.youtube.com/embed/Y6U728AZnV0"
        video_height={315}
        hasVideo={true}
        image=""
        image_height={0}
        hasImage={false}
        comments={[
          { author: "John Doe", text: "xpto" },
          { author: "John Doe", text: "xpto" }
        ]}
      />
    ));

    return <div className="Feed">{posts}</div>;
  }
}

export default Feed;
