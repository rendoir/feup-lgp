import * as React from "react";
import InfiniteScroll from "../components/InfiniteScroll/InfiniteScroll";
import Post from "../components/Post/Post";
import "../styles/Feed.css";
import axiosInstance from "../utils/axiosInstance";
import { dictionary, LanguageContext } from "../utils/language";
import withAuth from "../utils/withAuth";

type Props = {};

type State = {
  posts: any[];
  fetchingInfo: boolean;
};

class Feed extends React.Component<Props, State> {
  public static contextType = LanguageContext;

  constructor(props: Props) {
    super(props);

    this.state = {
      fetchingInfo: true,
      posts: []
    };
  }

  // public componentDidMount() {
  //   this.apiGetFeed();
  // }

  public apiGetFeed() {
    axiosInstance
      .get("/feed", {
        params: {}
      })
      .then(res => {
        const postsComing = res.data;

        postsComing.posts.map(
          (post: any, idx: any) => (
            (post.comments = postsComing.comments[idx]),
            (post.tags = postsComing.tags[idx]),
            (post.files = postsComing.files[idx])
          )
        );

        this.setState({ fetchingInfo: false, posts: postsComing.posts });
      })
      .catch(() => console.log("Failed to get feed"));
  }

  public getPosts() {
    const postsDiv: any[] = [];

    for (const post of this.state.posts) {
      postsDiv.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          content={post.content}
          title={post.title}
          user_id={post.user_id}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
          comments={post.comments}
          tags={post.tags}
          files={post.files}
        />
      );
    }

    return postsDiv;
  }

  public render() {
    // if (this.state.fetchingInfo) {
    //   return null;
    // }

    const hardCodedTalks = [
      "Talk 1",
      "Talk 45465",
      "Talk 45",
      "Talk 46848",
      "Big Talk name to test css properly, omg this name is not over yet"
    ];
    const talks = hardCodedTalks.map(title => (
      <a key={title} className="talk-link d-block my-2">
        {title}
      </a>
    ));

    return (
      <div id="Feed" className="container my-5">
        <div className="row">
          <div className="left col-lg-3 mr-5">
            <h5>{dictionary.talks[this.context]}</h5>
            {talks}
          </div>
          <div className="middle col-lg-8">
            <InfiniteScroll />
            {/*{this.getPosts()}*/}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Feed);
