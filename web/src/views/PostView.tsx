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
  post: any[];
  comments: any[];
  likers: any[];
  tags: any[];
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
      likers: [],
      post: [
        {
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
      ],
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
    postUrl += "/post";
    axios
      .get(`${postUrl}/${id}`, {
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        },
        params: {}
      })
      .then(res => {
        this.setState({
          comments: res.data.comments,
          fetchingInfo: false,
          id: res.data.post[0].id,
          likers: res.data.likers,
          post: res.data.post,
          tags: res.data.tags
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
            id={Number(this.state.post[0].id)}
            title={this.state.post[0].title}
            author={
              this.state.post[0].first_name + " " + this.state.post[0].last_name
            }
            date={this.date()}
            likes={this.state.post[0].likes}
            text={this.state.post[0].content}
            videos={this.state.post[0].content_video}
            images={this.state.post[0].content_image}
            comments={this.state.comments}
            likers={this.state.likers}
            tags={this.state.tags}
            visibility={this.state.post[0].visibility}
          />
        </div>
      </div>
    );
  }
}

export default PostView;
