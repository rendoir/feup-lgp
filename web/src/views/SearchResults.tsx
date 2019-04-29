import * as React from "react";

import Post from "../components/Post/Post";

type Props = {
  posts: any[];
};

export default class SearchResults extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
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
    for (const post of this.props.posts) {
      postDivs.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          likes={post.likes}
          likers={post.likers}
          images={undefined}
          videos={undefined}
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
