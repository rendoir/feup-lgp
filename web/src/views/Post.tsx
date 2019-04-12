import * as React from "react";
import styles from "../components/Post/Post.module.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "@fortawesome/fontawesome-free/css/all.css";
import Avatar from "../components/Post/Post";

class Post extends React.Component {
  public render() {
    return (
      <div
        className={`${styles.post} mb-4`}
        style={{ width: screen.width, height: 500 }}
      >
        <div className={styles.post_header}>
          <img
            src="https://picsum.photos/200/200?image=52"
            width="30"
            height="30"
          />

          <p className={styles.post_author}> Someone </p>
          <p className={styles.post_date}>20-02-2019</p>
          <div className="btn-group">
            <a className="" role="button" type="button" data-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <button className="dropdown-item" type="button">
                Edit Post
              </button>
              <button className="dropdown-item" type="button">
                Delete Post
              </button>
              <button className="dropdown-item" type="button">
                etc
              </button>
            </div>
          </div>
        </div>
        <div className={styles.post_content}>
          <p>
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.{" "}
          </p>
        </div>
        <div className={styles.post_stats}>
          <span>35 likes</span>
          <span>14 comments</span>
        </div>
        <div className={styles.post_actions}>
          <button>
            <i className="fas fa-thumbs-up" />
            <span>Like</span>
          </button>
          <button>
            <i className="far fa-comment-alt" />
            <span>Comment</span>
          </button>
          <button>
            <i className="fas fa-share-square" />
            <span>Share</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Post;
