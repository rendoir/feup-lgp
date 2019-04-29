import * as React from "react";

import Post from "../components/Post/Post";
import UserCard from "../components/UserCard/UserCard";

type Props = {
  location: any;
};
type State = {
  authorPosts: any[];
  posts: any[];
  postsAreaActive: boolean;
  postsAuthorAreaActive: boolean;
  users: any[];
  usersAreaActive: boolean;
};

export default class SearchResults extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.props.location.state;
    this.handlePostsArea = this.handlePostsArea.bind(this);
    this.handlePostsAuthorArea = this.handlePostsAuthorArea.bind(this);
    this.handleUsersArea = this.handleUsersArea.bind(this);
  }

  public render() {
    return (
      <div id="search-res-comp" className="container mt-3 ml-0">
        <div className="row">
          {/* Search menu */}
          <div className="col-12 col-md-3">
            <div className="dropdown">
              <h6 className="dropdown-header">Search results</h6>
              <div className="dropdown-divider" />
              <a className="dropdown-item" onClick={this.handlePostsArea}>
                Posts by Content
              </a>
              <a className="dropdown-item" onClick={this.handlePostsAuthorArea}>
                Posts by Author
              </a>
              <a className="dropdown-item" onClick={this.handleUsersArea}>
                Users
              </a>
            </div>
          </div>
          {this.state.postsAreaActive && this.getPostsArea()}
          {this.state.postsAuthorAreaActive && this.getPostsAuthorArea()}
          {this.state.usersAreaActive && this.getUsersArea()}
        </div>
      </div>
    );
  }

  private handlePostsArea() {
    this.setState({
      postsAreaActive: true,
      postsAuthorAreaActive: false,
      usersAreaActive: false
    });
  }

  private handlePostsAuthorArea() {
    this.setState({
      postsAreaActive: false,
      postsAuthorAreaActive: true,
      usersAreaActive: false
    });
  }

  private handleUsersArea() {
    this.setState({
      postsAreaActive: false,
      postsAuthorAreaActive: false,
      usersAreaActive: true
    });
  }

  private getPostsArea() {
    return (
      <div id="search-res-posts-area" className="col-12 col-md-9">
        {this.getPosts()}
      </div>
    );
  }

  private getPostsAuthorArea() {
    return (
      <div id="search-res-posts-author-area" className="col-12 col-md-9">
        {this.getPostsByAuthor()}
      </div>
    );
  }

  private getUsersArea() {
    return (
      <div id="search-res-users-area" className="col-12 col-md-9">
        {this.getUsers()}
      </div>
    );
  }

  private getPosts() {
    const postElements = [];
    for (const post of this.state.posts) {
      console.log(post);
      postElements.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          likes={post.likes}
          likers={post.likers || []}
          comments={post.comments || []}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
        />
      );
    }
    return postElements;
  }

  private getPostsByAuthor() {
    const postElements = [];
    for (const post of this.state.authorPosts) {
      postElements.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          likes={post.likes}
          likers={post.likers || []}
          comments={post.comments || []}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
        />
      );
    }
    return postElements;
  }

  private getUsers() {
    const userElements = [];
    for (const user of this.state.users) {
      userElements.push(<UserCard key={user.id} {...user} />);
    }
    return userElements;
  }
}
