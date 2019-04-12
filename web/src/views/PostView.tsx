import * as React from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "@fortawesome/fontawesome-free/css/all.css";

import Post from "../components/Post/Post";

interface Props {}

interface State {
  post: Array<any>;
}

const postStyle = {
  margin: "2rem auto auto auto"
};

class PostView extends React.Component {
  constructor(props: Props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    this.apiGetPost();
  }

  public apiGetPost() {
    axios
      .get("https://localhost:8443/post?ID=1", {
        params: {},
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({ post: res.data });
      })
      .catch(() => console.log("Failed to get post info"));
  }

  public render() {
    return (
      <div
        className="d-flex justify-content-center align-items-center align-self-center"
        style={postStyle}
      >
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
            {
              author: "John Doe",
              text:
                "This is a super big comment just to test some stuff and has absolutely no content."
            },
            { author: "John Doe", text: "This is a comment." }
          ]}
        />
      </div>
    );
  }
}

export default PostView;
