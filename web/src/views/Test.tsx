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
    return (
      <div id="Test" className="container my-5">
        {/*<div className="outside">
            <img className="object-fit-cover" src="https://via.placeholder.com/800x400"></img>
        </div>*/}

        <Post
          id={1}
          title="Title"
          author="Author"
          children={[]}
          comments={[]}
          images={[
            "https://via.placeholder.com/800x400",
            "https://via.placeholder.com/600x500"
          ]}
          videos={["https://www.youtube.com/embed/cmpRLQZkTb8"]}
          date={"25-03-2014"}
          text="My text"
        />
      </div>
    );
  }
}

export default Feed;
