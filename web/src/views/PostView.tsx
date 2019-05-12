import * as React from "react";

import Post from "../components/Post/Post";
import axiosInstance from "../utils/axiosInstance";

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
    axiosInstance
      .get(`/post/${id}`, {
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
            text={this.state.post.content}
            user_id={this.state.post.user_id}
            comments={this.state.comments}
            files={this.state.files}
            tags={this.state.tags}
            visibility={this.state.post.visibility}
          />
        </div>
      </div>
    );
  }
}

export default PostView;
