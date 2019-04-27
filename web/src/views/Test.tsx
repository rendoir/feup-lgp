import axios from "axios";
import * as React from "react";
import Post from "../components/Post/Post";
import "../styles/Test.css";

type Props = {};

type State = {};

class Feed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public componentDidMount() {
    //this.apiGetFeed();
  }

  /*public apiGetFeed() {
    let feedUrl = `${location.protocol}//${location.hostname}`;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      feedUrl += `:${process.env.REACT_APP_API_PORT}/feed`;
    } else {
      feedUrl += "/api/feed";
    }
    axios
      .get(feedUrl, {
        params: {}
      })
      .then(res => {
        // console.log(res.data);
        this.setState({ posts: res.data });
      })
      .catch(() => console.log("Failed to get feed"));
  }*/

  public render() {
    let imgurl = `${location.protocol}//${location.hostname}`;
    imgurl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    imgurl += "/uploads/24.SparkGlow.png";

    return (
      <div id="Test" className="container my-5">
        <img src={imgurl} />

        <Post
          id={1}
          title="Title"
          author="Author"
          children={[]}
          comments={[]}
          images={[
            "https://via.placeholder.com/800x400",
            "https://via.placeholder.com/400x800"
          ]}
          videos={["https://www.youtube.com/embed/cmpRLQZkTb8"]}
          date={"25-03-2014"}
          text="My text"
          files={[
            { name: "File1", type: "Type1", src: "Src1", size: 1 },
            { name: "File2", type: "Type2", src: "Src2", size: 25 }
          ]}
        />

        <Post
          id={2}
          title="Title2"
          author="Author2"
          children={[]}
          comments={[]}
          images={[
            "https://via.placeholder.com/700x300",
            "https://via.placeholder.com/300x700"
          ]}
          videos={undefined}
          date={"25-03-2014"}
          text="My text2"
        />

        <Post
          id={3}
          title="Title3"
          author="Author3"
          children={[]}
          comments={[]}
          images={["https://via.placeholder.com/500x500"]}
          videos={undefined}
          date={"25-03-2014"}
          text="My text3"
        />
      </div>
    );
  }
}

export default Feed;
