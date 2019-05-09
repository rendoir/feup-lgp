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
  files: any[];
  likers: any[];
  tags: any[];
  fetchingInfo: boolean;
}

class PostView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      comments: [],
      fetchingInfo: true,
      files: [],
      id: 1,
      likers: [],
      post: {
        author: "1",
        content: "",
        date_created: "",
        date_updated: "",
        id: "",
        title: ""
      },
      tags: []
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
          files: res.data.files,
          id: res.data.post.id,
          likers: res.data.likers,
          post: res.data.post,
          tags: res.data.tags
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
      <div className="container my-5">
        <div className="w-75 mx-auto">
          <Post
            id={Number(this.state.post.id)}
            title={this.state.post.title}
            author={
              this.state.post.first_name + " " + this.state.post.last_name
            }
            date={this.date()}
            likes={this.state.post.likes}
            content={this.state.post.content}
            user_id={this.state.post.user_id}
            comments={this.state.comments}
            files={this.state.files}
            likers={this.state.likers}
            tags={this.state.tags}
            visibility={this.state.post.visibility}
          />
        </div>
      </div>
    );
  }
}

export default PostView;
