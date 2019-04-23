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
  fetchingPostInfo: boolean;
  fetchingPostUserInteractions: boolean;
  userRate: number;
  userSubscription: boolean;
}

const postStyle = {
  margin: "2rem auto auto auto"
};

class PostView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      comments: [],
      fetchingPostInfo: true,
      fetchingPostUserInteractions: true,
      id: 1,
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
      userRate: 1,
      userSubscription: false
    };
  }

  public componentDidMount() {
    this.apiGetPost(this.props.match.params.id);
    this.apiGetPostUserInteractions(this.props.match.params.id);
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
          fetchingPostInfo: false,
          id: res.data.post[0].id,
          post: res.data.post
        });
      })
      .catch(() => console.log("Failed to get post info"));
  }

  public apiGetPostUserInteractions(id: number) {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post";
    axios
      .post(`${postUrl}/user_interactions`, {
        postId: id,
        userId: 1 // HARD CODED ATE CENSEGUIR OBTER ID DO USER LOGADO
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          fetchingPostUserInteractions: false,
          userRate: res.data.rate,
          userSubscription: res.data.susbscription
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
    if (
      this.state.fetchingPostInfo ||
      this.state.fetchingPostUserInteractions
    ) {
      return null;
    }

    return (
      <div
        className="d-flex justify-content-center align-items-center align-self-center"
        style={postStyle}
      >
        <Post
          id={Number(this.state.post[0].id)}
          title={this.state.post[0].title}
          author={
            this.state.post[0].first_name + " " + this.state.post[0].last_name
          }
          date={this.date()}
          text={this.state.post[0].content}
          videos={this.state.post[0].content_video}
          images={this.state.post[0].content_image}
          comments={this.state.comments}
          userRate={this.state.userRate}
          userSubscription={this.state.userSubscription}
        />
      </div>
    );
  }
}

export default PostView;
