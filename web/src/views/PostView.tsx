import * as React from "react";
import axios from "axios";

import Post from "../components/Post/Post";

interface Props {}

interface State {
  post: Array<any>;
  comments: Array<any>;
}

const postStyle = {
  margin: "2rem auto auto auto"
};

class PostView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      post: [
        {
          author: "1",
          content_text: "",
          content_document: null,
          content_image: null,
          content_video: null,
          date_created: "",
          date_updated: "",
          id: "",
          title: ""
        }
      ],
      comments: []
    };
  }

  componentDidMount() {
    this.apiGetPost();
  }

  public apiGetPost() {
    axios
      .get("https://localhost:8443/post/1", {
        params: {},
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        this.setState({ post: res.data.post, comments: res.data.comments });
      })
      .catch(() => console.log("Failed to get post info"));
  }

  public date() {
    if (this.state.post[0].date_updated != null)
      return this.processDate(this.state.post[0].date_updated);
    else return this.processDate(this.state.post[0].date_created);
  }

  public processDate(dateToProcess: string) {
    return dateToProcess.split("T")[0];
  }

  public render() {
    console.log(this.state.comments);
    return (
      <div
        className="d-flex justify-content-center align-items-center align-self-center"
        style={postStyle}
      >
        <Post
          id={Number(this.state.post[0].id)}
          title={this.state.post[0].title}
          content_width={screen.width / 1.2}
          author={
            this.state.post[0].first_name + " " + this.state.post[0].last_name
          }
          date={this.date()}
          text={this.state.post[0].content_text}
          videos={this.state.post[0].content_video}
          images={this.state.post[0].content_image}
          comments={this.state.comments}
        />
      </div>
    );
  }
}

export default PostView;
