import axios from "axios";
import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

import "./PostModal.css";

// - Import utils
import {
  apiGetUninvitedSubscribersAmount,
  apiGetUninvitedUsersInfo,
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
  waitingSubscribersInvitation: boolean;
  waitingUserInvitation: boolean;
}

class InviteModal extends Component<IProps, IState> {
  public htmlId: string;
  public subjectId: number;
  public subjectType: string;
  constructor(props: IProps) {
    super(props);

    this.subjectId = this.props.postId || this.props.conferenceId || -1;
    this.subjectType = this.props.postId ? "post" : "conference";
    this.htmlId = `invite_${this.subjectType}_modal_${this.subjectId}`;

    this.state = {
      uninvitedSubscribersAmount: 0,
      uninvitedUsers: [
        {
          first_name: "Rodrigo",
          id: 1,
          last_name: "Pinto",
          university: "FEUP",
          work: "surgeon",
          work_field: "cardiology"
        },
        {
          first_name: "John",
          id: 2,
          last_name: "Price",
          university: "Arkansas UNI",
          work: "surgeon",
          work_field: "cardiology"
        }
      ],
      waitingSubscribersInvitation: false,
      waitingUserInvitation: false
    };

    this.handleInviteSubscribers = this.handleInviteSubscribers.bind(this);
    this.handleInviteUser = this.handleInviteUser.bind(this);
  }

  public componentDidMount() {
    this.apiGetUninvitedSubsAmount();
    this.apiGetUninvitedUsers();
  }

  public async apiGetUninvitedSubsAmount() {
    const uninvitedSubscribersAmount = await apiGetUninvitedSubscribersAmount(
      this.subjectId,
      this.subjectType
    );
    this.setState({ uninvitedSubscribersAmount });
  }

  public async apiGetUninvitedUsers() {
    const uninvitedUsers = await apiGetUninvitedUsersInfo(
      this.subjectId,
      this.subjectType
    );
    this.setState({ uninvitedUsers });
  }

  public async handleInviteSubscribers() {
    this.setState({
      waitingSubscribersInvitation: true
    });
    console.log("INVITE SUBSCRIBERS");
    const inviteSuccess = await apiInviteSubscribers(
      this.subjectId,
      this.subjectType
    );

    const uninvitedSubscribersLeft = inviteSuccess
      ? 0
      : this.state.uninvitedSubscribersAmount;
    this.setState({
      uninvitedSubscribersAmount: uninvitedSubscribersLeft,
      waitingSubscribersInvitation: false
    });
  }

  public async handleInviteUser() {
    console.log("INVITE USER");
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "post_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  /*public getReportForm() {
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
  }*/

  public getInviteUserForm() {
    let invSubscribersText =
      this.state.uninvitedSubscribersAmount > 0
        ? "Invite all subscribers"
        : "All subscribers have been invited";
    let invSubscribersDisclosure = "";
    if (this.state.waitingSubscribersInvitation) {
      invSubscribersText = "Inviting subscribers...";
    } else if (this.state.uninvitedSubscribersAmount > 0) {
      invSubscribersDisclosure =
        "(" + this.state.uninvitedSubscribersAmount + " without invitation)";
    } else if (this.state.uninvitedSubscribersAmount < 0) {
      invSubscribersText =
        "Error fetching uninvited subscribers. Try again later.";
    }

    const invSubscribersButton = (
      <button
        type="button"
        onClick={this.handleInviteSubscribers}
        disabled={this.state.uninvitedSubscribersAmount <= 0}
      >
        {`${invSubscribersText} ${invSubscribersDisclosure}`}
      </button>
    );

    return <div>{invSubscribersButton}</div>;
  }

  public getInviteSubscribersButton() {
    let invSubscribersText =
      this.state.uninvitedSubscribersAmount > 0
        ? "Invite all subscribers"
        : "All subscribers have been invited";
    let invSubscribersDisclosure = "";
    if (this.state.waitingSubscribersInvitation) {
      invSubscribersText = "Inviting subscribers...";
    } else if (this.state.uninvitedSubscribersAmount > 0) {
      invSubscribersDisclosure =
        "(" + this.state.uninvitedSubscribersAmount + " without invitation)";
    } else if (this.state.uninvitedSubscribersAmount < 0) {
      invSubscribersText =
        "Error fetching uninvited subscribers. Try again later.";
    }

    const invSubscribersButton = (
      <button
        className="invite_subscribers"
        type="button"
        onClick={this.handleInviteSubscribers}
        disabled={this.state.uninvitedSubscribersAmount <= 0}
      >
        {`${invSubscribersText} ${invSubscribersDisclosure}`}
      </button>
    );

    return <div>{invSubscribersButton}</div>;
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
                {`Invite users to your ${this.subjectType}`}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body d-flex justify-content-center">
              {this.getInviteSubscribersButton()}
            </div>
            <div className="modal-footer">
              <button
                id="invite_modal_done"
                className="btn btn-danger"
                type="button"
                data-dismiss="modal"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InviteModal;
