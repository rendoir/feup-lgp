import axios from "axios";
import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

import "./PostModal.css";

// - Import utils
import {
  apiGetUninvitedSubscribersAmount,
  apiInviteSubscribers,
  apiInviteUser
} from "../../utils/apiInvite";

interface IProps {
  /* Only pass one of the parameters according to the content type */
  postId?: number;
  conferenceId?: number;
}

interface IState {
  uninvitedSubscribersAmount: number;
  uninvitedUsers: any[];
}

class IviteModal extends Component<IProps, IState> {
  public htmlId: string;

  constructor(props: IProps) {
    super(props);

    this.htmlId = props.postId
      ? `invite_post_modal_${props.postId}`
      : `invite_conference_modal_${props.conferenceId}`;

    this.state = {
      uninvitedSubscribersAmount: 0,
      uninvitedUsers: [
        {
          id: 1,
          first_name: "Rodrigo",
          last_name: "Pinto",
          university: "FEUP",
          work: "surgeon",
          work_field: "cardiology"
        },
        {
          id: 2,
          first_name: "John",
          last_name: "Price",
          university: "Arkansas UNI",
          work: "surgeon",
          work_field: "cardiology"
        }
      ]
    };

    // Report manipulation handlers
    this.handleInviteSubscribers = this.handleInviteSubscribers.bind(this);
    // Field change handlers
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public componentDidMount() {
    // TODO
    // this.apiGetConference();
    this.apiGetUninvitedSubsAmount();
    this.apiGetUninvitedUsers();
  }

  public async apiGetUninvitedSubsAmount() {
    const subjectId = this.props.postId || this.props.conferenceId || -1;
    const subjectType = this.props.postId ? "post" : "conference";
    const uninvitedSubscribersAmount = await apiGetUninvitedSubscribersAmount(
      subjectId,
      subjectType
    );
    this.setState({ uninvitedSubscribersAmount });
  }

  public async apiGetUninvitedUsers() {
    const subjectId = this.props.postId || this.props.conferenceId || -1;
    const subjectType = this.props.postId ? "post" : "conference";
    const uninvitedSubscribersAmount = await apiGetUninvitedSubscribersAmount(
      subjectId,
      subjectType
    );
    this.setState({ uninvitedSubscribersAmount });
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
