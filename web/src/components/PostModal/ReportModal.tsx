import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

import createSequence from "../../utils/createSequence";

import "./PostModal.css";

// - Import utils
import { apiReportComment, apiReportPost } from "../../utils/apiReport";

interface IProps {
  /* Only pass one of the parameters according to the content type */
  postId?: number;
  commentId?: number;
  reportCancelHandler: any;
}

interface IState {
  reportReason: string;
}

const cookies = new Cookies();

class ReportModal extends Component<IProps, IState> {
  public htmlId: string;
  public loggedUserId: number;
  public reportDescription: any = React.createRef();

  constructor(props: IProps) {
    super(props);

    this.htmlId = props.postId
      ? `report_post_modal_${props.postId}`
      : `report_comment_modal_${props.commentId}`;
    this.loggedUserId = 1; // cookies.get("user_id"); - change when login fetches user id properly

    this.state = { reportReason: "" };

    // Report manipulation handlers
    this.handleReportCreation = this.handleReportCreation.bind(this);
    // Field change handlers
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public handleReportCreation() {
    if (this.props.postId) {
      apiReportPost(
        this.props.postId,
        this.loggedUserId,
        this.state.reportReason
      );
    } else if (this.props.commentId) {
      apiReportComment(
        this.props.commentId,
        this.loggedUserId,
        this.state.reportReason
      );
    }
  }

  public handleInputChange(event: any) {
    const value = !event.target.value.replace(/\s/g, "").length
      ? ""
      : event.target.value; // Ignore input only containing white spaces

    this.setState({ reportReason: value });
  }

  public validReport() {
    return Boolean(this.state.reportReason);
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "post_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  public getReportForm() {
    return (
      <form className="was-validated">
        <div className="mb-3">
          <h5>Report reason</h5>
          <textarea
            name="text"
            className={this.getInputRequiredClass(this.state.reportReason)}
            onChange={this.handleInputChange}
            placeholder="Insert report reason"
            value={this.state.reportReason}
            required={true}
          />
          <div
            className="field_required_warning"
            style={this.getInputRequiredStyle(this.state.reportReason)}
          >
            Reason must be provided
          </div>
        </div>
      </form>
    );
  }

  public getActionButton() {
    return (
      <button
        type="button"
        className="btn btn-primary"
        data-dismiss="modal"
        onClick={this.handleReportCreation}
        disabled={!this.validReport()}
      >
        Submit report
      </button>
    );
  }

  public render() {
    return (
      <div
        id={this.htmlId}
        className={`modal fade report_modal`}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
        data-backdrop="false"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Content Report
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.props.reportCancelHandler}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{this.getReportForm()}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={this.props.reportCancelHandler}
              >
                Cancel
              </button>
              {this.getActionButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportModal;
