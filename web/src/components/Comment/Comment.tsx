// - Import react components

import Avatar from "../Avatar/Avatar";

import React, { Component } from "react";

// - Import app components
import ReportModal from "../PostModal/ReportModal";

// - Import style
import "@fortawesome/fontawesome-free/css/all.css";
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import styles from "./../Post/Post.module.scss";

// - Import utils
import { apiCheckCommentUserReport } from "../../utils/apiReport";
import AuthHelperMethods from "../../utils/AuthHelperMethods";
import axiosInstance from "../../utils/axiosInstance";
import { dictionary, LanguageContext } from "../../utils/language";

export type Props = {
  // comment: Comment //from model (substitutes title, text)
  postID: number;
  title: string | undefined;
  text: string | undefined;

  author: string | undefined;

  secondLevel: boolean;
};

export type State = {
  commentID: number;
  commentText: string | undefined;
  commentValue: string;
  comments: any[];
  hrefComment: string;
  isHovered: boolean;
  likers: any[];
  likes: number;
  redirect: boolean;
  userReport: boolean; // Tells if the logged user has reported this post
};

class Comment extends Component<Props, State> {
  public static contextType = LanguageContext;

  public static defaultProps = {};
  public id: string;

  private auth = new AuthHelperMethods();

  constructor(props: Props) {
    super(props);

    this.id = "comment_" + this.props.title;

    this.state = {
      commentID: 0,
      commentText: this.props.text,
      commentValue: "",
      comments: [],
      hrefComment: "",
      isHovered: false,
      likers: [],
      likes: 0,
      redirect: false,
      userReport: false
    };

    this.handleCommentDeletion = this.handleCommentDeletion.bind(this);
    this.apiEditComment = this.apiEditComment.bind(this);
    this.handleCommentReport = this.handleCommentReport.bind(this);
    this.handleReportCancel = this.handleReportCancel.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.changeCommentValue = this.changeCommentValue.bind(this);

    this.handleAddLike = this.handleAddLike.bind(this);
  }

  public render() {
    return (
      <div className={`${styles.post_comment} my-3`}>
        <div className={styles.comment_header}>
          <Avatar
            title={this.props.author}
            placeholder="empty"
            size={30}
            image="https://picsum.photos/200/200?image=52"
          />
          <div>
            <div className={styles.comment_text}>
              <p>
                <span className={styles.post_author}>{this.props.author}</span>
                {this.props.text}
                {this.getLikes()}
              </p>
            </div>
            <div className={styles.comment_social}>
              {this.getLikeButton()}
              {!this.props.secondLevel && (
                <button
                  className={styles.comment_action}
                  role="button"
                  data-toggle="collapse"
                  data-target={"#" + this.state.hrefComment + "_form"}
                >
                  {dictionary.reply_action[this.context]}
                </button>
              )}
              <a className={styles.post_date} href={"/post/" + this.id} />
              <div className={`${styles.post_options} btn-group`}>
                <button
                  className="w-100 h-100 ml-2"
                  role="button"
                  data-toggle="dropdown"
                >
                  <i className="fas fa-ellipsis-v" />
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                  {this.getDropdownButtons()}
                </div>
              </div>
              <div className={`${styles.post_comment_section} w-100`}>
                {this.actionRenderLevelComments()}
                <div className={`${styles.post_comment} w-100`}>
                  {this.renderLevelComments()}
                  <div
                    id={this.state.hrefComment + "_form"}
                    className="collapse"
                  >
                    <form
                      className={styles.post_add_comment}
                      onSubmit={this.handleAddComment}
                    >
                      <Avatar
                        title={this.props.author}
                        placeholder="empty"
                        size={30}
                        image="https://picsum.photos/200/200?image=52"
                      />
                      <textarea
                        className={`form-control ml-4 mr-3 ${this.getInputRequiredClass(
                          this.state.commentValue
                        )}`}
                        placeholder={
                          dictionary.insert_comment_placeholder[this.context]
                        }
                        value={this.state.commentValue}
                        onChange={this.changeCommentValue}
                        onKeyDown={this.onEnterPress}
                        required={true}
                      />
                      <button
                        className={`${styles.submit_comment} px-2 py-1`}
                        type="submit"
                        value={dictionary.submit[this.context]}
                        disabled={!this.validComment()}
                      >
                        <i className="fas fa-chevron-circle-right" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id={`edit_comment_modal_${this.props.title}`}
          className="modal fade"
          role="dialog"
          aria-labelledby="editCommentModal"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editCommentModal">
                  {dictionary.edit_comment[this.context]}
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </h5>
              </div>
              <div className="modal-body">
                <input
                  placeholder={
                    dictionary.insert_comment_placeholder[this.context]
                  }
                  className="form-control"
                  value={this.state.commentText}
                  onChange={event =>
                    this.setState({ commentText: event.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                  onClick={() =>
                    this.setState({ commentText: this.props.text })
                  }
                >
                  {dictionary.cancel[this.context]}
                </button>
                <div>
                  {this.handleRedirect()}
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={this.apiEditComment}
                  >
                    {dictionary.save[this.context]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id={`delete_comment_modal_${this.props.title}`}
          className="modal fade"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle" />
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{dictionary.confirm_delete[this.context]}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  {dictionary.cancel[this.context]}
                </button>
                {this.getActionButton()}
              </div>
            </div>
          </div>
        </div>

        <ReportModal
          commentId={Number(this.props.title)}
          reportCancelHandler={this.handleReportCancel}
        />
      </div>
    );
  }

  public componentDidMount() {
    this.setState({
      commentID: Number(this.props.title),
      hrefComment: "comment_section_" + this.props.title
    });
    this.apiGetCommentsOfComment(Number(this.props.title));
    this.apiGetWhoLikedComment(Number(this.props.title));
    this.apiGetCommentUserReport(Number(this.props.title));
  }

  public handleAddComment(event: any) {
    event.preventDefault();
    this.apiComments();
  }

  public handleCommentReport() {
    this.setState({ userReport: true });
  }

  public handleReportCancel() {
    this.setState({ userReport: false });
  }

  public onEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.apiComments();
    }
  };

  public getLikeButton() {
    const userLoggedIn = 2;
    const foundValue = this.state.likers.find(e => {
      if (e.id === userLoggedIn.toString()) {
        return e;
      } else {
        return null;
      }
    });
    if (foundValue != null) {
      return (
        <button className={styles.comment_action} onClick={this.handleAddLike}>
          {dictionary.dislike_action[this.context]}
        </button>
      );
    } else {
      return (
        <button className={styles.comment_action} onClick={this.handleAddLike}>
          {dictionary.like_action[this.context]}
        </button>
      );
    }
  }

  public apiComments() {
    const postUrl = `/post/${this.props.postID}/comment/${
      this.state.commentID
    }`;

    axiosInstance
      .post(postUrl, {
        comment: this.state.commentValue,
        headers: {}
      })
      .then(res => {
        console.log("Comment created - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
  }

  public changeCommentValue(event: any) {
    this.setState({ commentValue: event.target.value });
  }

  public handleAddLike(event: any) {
    event.preventDefault();

    const userLoggedIn = 2;
    const foundValue = this.state.likers.find(e => {
      if (e.id === userLoggedIn.toString()) {
        return e;
      } else {
        return null;
      }
    });

    if (foundValue != null) {
      this.apiDeleteLikeToComment();
    } else {
      this.apiAddLikeToComment();
    }
  }

  public userLiked() {
    const userLoggedIn = 2;
    const divStyle = { color: "black" };

    const foundValue = this.state.likers.find(e => {
      if (e.id === userLoggedIn.toString()) {
        return e;
      } else {
        return null;
      }
    });

    if (foundValue != null) {
      divStyle.color = "blue";
    }

    return <i className="fas fa-thumbs-up" style={divStyle} />;
  }

  public async apiGetCommentUserReport(commentId: number) {
    const userReport: boolean = await apiCheckCommentUserReport(commentId);
    this.setState({ userReport });
  }

  public apiGetCommentsOfComment(id: number) {
    const getUrl = `/post/${this.props.postID}/comment/${id}`;

    axiosInstance
      .get(getUrl)
      .then(res => {
        this.setState({
          comments: res.data
        });
      })
      .catch(() => console.log("Failed to create comment"));
  }

  public apiAddLikeToComment() {
    const postUrl = `/post/${this.props.postID}/comment/${
      this.state.commentID
    }/like`;

    axiosInstance
      .post(postUrl)
      .then(res => {
        console.log("Comment liked - reloading page...");
        this.apiGetWhoLikedComment(this.state.commentID);
      })
      .catch(() => console.log("Failed to add like to comment"));
  }

  public apiDeleteLikeToComment() {
    const postUrl = `/post/${this.props.postID}/comment/${
      this.state.commentID
    }/like`;

    axiosInstance
      .delete(postUrl)
      .then(res => {
        console.log("Comment disliked - reloading page...");
        this.apiGetWhoLikedComment(this.state.commentID);
      })
      .catch(() => console.log("Failed to delete like from a comment"));
  }

  public apiGetWhoLikedComment(id: number) {
    const getUrl = `/post/${this.props.postID}/comment/${id}/likes`;

    axiosInstance
      .get(getUrl)
      .then(res => {
        this.setState({
          likers: res.data,
          likes: res.data.length
        });
      })
      .catch(() => console.log("Failed to create comment"));
  }

  public apiEditComment() {
    const postUrl = `/post/${this.props.postID}/comment/${
      this.state.commentID
    }`;

    axiosInstance
      .put(postUrl, {
        comment: this.state.commentText,
        id: this.state.commentID
      })
      .then(res => {
        console.log(`Comment edited to ${res.data.newComment}`);
        if (window.location.pathname === "/post/" + this.id) {
          this.setState({
            redirect: true
          });
          this.handleRedirect();
        } else {
          window.location.reload();
        }
      })
      .catch(() => console.log("Failed to edit comment"));
  }

  public apiDeleteComment() {
    const postUrl = `/post/${this.props.postID}/comment/${
      this.state.commentID
    }`;
    axiosInstance
      .delete(postUrl, {
        data: {
          id: this.props.title
        }
      })
      .then(res => {
        console.log("Comment deleted");
        if (window.location.pathname === "/post/" + this.id) {
          this.setState({
            redirect: true
          });
          this.handleRedirect();
        } else {
          window.location.reload();
        }
      })
      .catch(() => console.log("Failed to delete comment"));
  }

  public handleCommentDeletion() {
    this.apiDeleteComment();
  }

  public renderRedirect() {
    if (this.state.redirect) {
      window.location.href = "/";
    }
  }

  public handleRedirect() {
    if (window.location.pathname === "/post/" + this.id) {
      this.renderRedirect();
    }
  }

  public getDropdownButtons() {
    const reportButton = (
      <button
        key={0}
        className={`dropdown-item ${styles.report_content}`}
        type="button"
        data-toggle="modal"
        data-target={`#report_comment_modal_${this.props.title}`}
        onClick={this.handleCommentReport}
        disabled={this.state.userReport}
      >
        {this.state.userReport
          ? dictionary.report_comment_issued[this.context]
          : dictionary.report_comment[this.context]}
      </button>
    );
    const editButton = (
      <button
        key={1}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        data-target={`#edit_comment_modal_${this.props.title}`}
        onClick={() => this.setState({ commentText: this.props.text })}
      >
        {dictionary.edit_comment[this.context]}
      </button>
    );
    const deleteButton = (
      <button
        key={2}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        data-target={`#delete_comment_modal_${this.props.title}`}
      >
        {dictionary.delete_comment[this.context]}
      </button>
    );
    const dropdownButtons = [reportButton, editButton, deleteButton];
    return dropdownButtons;
  }

  public getActionButton() {
    return (
      <div>
        {this.handleRedirect()}
        <button
          type="button"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={this.handleCommentDeletion}
        >
          {dictionary.yes[this.context]}
        </button>
      </div>
    );
  }

  public getLikers() {
    const likedUsersDiv = this.state.likers.map((liker, idx) => {
      return (
        <span key={"user" + idx + "liked-comment"} className="dropdown-item">
          {liker.first_name} {liker.last_name}
        </span>
      );
    });

    return (
      <span
        id={"comment_" + this.state.commentID + " show_likes"}
        className="dropdown-menu dropdown-menu-right"
      >
        {likedUsersDiv}
      </span>
    );
  }
  public getLikes() {
    const likesDiv: any[] = [];

    if (this.state.likes > 0) {
      likesDiv.push(
        <span
          key={this.state.hrefComment + "_span_like"}
          className={styles.comment_detail}
        >
          <a
            key={"comment_" + this.state.commentID + " show_likes_button"}
            role="button"
            data-toggle="dropdown"
            data-target={"#comment_" + this.state.commentID + " show_likes"}
          >
            {this.userLiked()}
          </a>{" "}
          {this.state.likes}
          {this.getLikers()}
        </span>
      );
    }
    return likesDiv;
  }

  public renderLevelComments() {
    const commentSection = this.state.comments.map((comment, idx) => {
      const key = "comment" + this.props.title + " " + idx;
      return (
        <Comment
          key={key}
          postID={comment.post}
          title={comment.id}
          author={comment.first_name + " " + comment.last_name}
          text={comment.comment}
          secondLevel={true}
        />
      );
    });

    return (
      <div id={this.state.hrefComment} className="w-100 collapse">
        {commentSection}
      </div>
    );
  }

  public actionRenderLevelComments() {
    const actionSeeRepliesDiv: any[] = [];

    if (this.state.comments.length > 0) {
      actionSeeRepliesDiv.push(
        <button
          key={this.state.hrefComment + "_button"}
          className={styles.comment_action}
          role="button"
          data-toggle="collapse"
          data-target={"#" + this.state.hrefComment}
        >
          {dictionary.see_replies[this.context]} {this.state.comments.length}{" "}
          {dictionary.replies[this.context]}
        </button>
      );
    }

    return actionSeeRepliesDiv;
  }

  public validComment() {
    return Boolean(this.state.commentValue);
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "post_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }
}

export default Comment;
