import axios from "axios";
import * as React from "react";

import Post from "../components/Post/Post";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

interface IState {
  id: number;
  post: any;
  comments: any[];
  fetchingInfo: boolean;
}

const postStyle = {
  margin: "2rem auto auto auto"
};

class PostView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      comments: [],
      fetchingInfo: true,
      id: 1,
      post: {
        author: "1",
        content: "",
        content_document: null,
        content_image: null,
        content_video: null,
        date_created: "",
        date_updated: "",
        id: "",
        title: ""
      }
    };
  }

  public componentDidMount() {
    this.apiGetPost(this.props.match.params.id);
  }

  public apiGetPost(id: number) {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += `/post/${id}`;
    axios
      .get(postUrl, {
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        this.setState({
          comments: res.data.comments,
          fetchingInfo: false,
          id: res.data.post.id,
          post: res.data.post
        });
      })
      .catch(() => console.log("Failed to get post info"));
  }

  public date() {
    if (this.state.post.date_updated != null) {
      return this.processDate(this.state.post.date_updated);
    } else {
      return this.processDate(this.state.post.date_created);
    }
  }

  public processDate(dateToProcess: string) {
    return dateToProcess.split("T")[0];
  }

  public render() {
    if (this.state.fetchingInfo) {
      return null;
    }

    return (
      <div
        className="d-flex justify-content-center align-items-center align-self-center"
        style={postStyle}
      >
        <div className="middle col-lg-10">
          <Post
            id={Number(this.state.post.id)}
            title={this.state.post.title}
            author={
              this.state.post.first_name + " " + this.state.post.last_name
            }
            date={this.date()}
            text={this.state.post.content}
            videos={this.state.post.content_video}
            images={this.state.post.content_image}
            comments={this.state.comments}
            visibility={this.state.post.visibility}
          />
        </div>
      </div>
    );
  }
}

export default PostView;
