import axios from "axios";
import * as React from "react";

import Post from "../components/Post/Post";

interface Props {
  match: {
    params: {
      id: number;
    };
  };
}

interface State {
  id: number;
  post: any[];
  comments: any[];
}

const postStyle = {
  margin: "2rem auto auto auto"
};

class PostView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      id: 1,
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

  public componentDidMount() {
    this.apiGetPost(this.props.match.params.id);
  }

  public apiGetPost(id: number) {
    axios
      .get("https://localhost:8443/post/" + id, {
        params: {},
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        this.setState({
          id: res.data.post[0].id,
          post: res.data.post,
          comments: res.data.comments
        });
      })
      .catch(() => console.log("Failed to get post info"));
  }

  public date() {
    if (this.state.post[0].date_updated != null) {
      return this.processDate(this.state.post[0].date_updated);
    } else {
      return this.processDate(this.state.post[0].date_created);
    }
  }

  public processDate(dateToProcess: string) {
    return dateToProcess.split("T")[0];
  }

  public render() {
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
