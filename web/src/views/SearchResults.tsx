import * as React from "react";

import Post from "../components/Post/Post";

type Props = {
  location: any;
};
type State = {
  authorPosts: any[];
  posts: any[];
  users: any[];
};

export default class SearchResults extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.props.location.state;
    console.log(this.state);
  }

  public render() {
    return (
      <div id="search-res-comp" className="container my-5">
        <div className="middle">{this.getPosts()}</div>
      </div>
    );
  }

  private getPosts() {
    const postDivs = [];
    for (const post of this.state.posts) {
      console.log(post);
      postDivs.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          likes={post.likes}
          likers={post.likers}
          comments={post.comments || []}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
        />
      );
    }
    return postDivs;
  }
}
