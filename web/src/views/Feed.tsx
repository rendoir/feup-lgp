import * as React from "react";
import axios from "axios";

class Feed extends React.Component {
  componentDidMount() {
    this.apiGetFeed();
  }

  public apiGetFeed() {
    axios
      .get("https://localhost:8443/feed/", {
        params: {},
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => console.log(res.data))
      .catch(() => console.log("Failed to get feed"));
  }

  public render() {
    return <div className="Feed">Hello feed</div>;
  }
}

export default Feed;
