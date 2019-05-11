import React, { Component } from "react";

// - Import utils
import { apiUserJoinConference } from "../../utils/apiConference";
import { apiInviteNotified } from "../../utils/apiInvite";
import { apiSubscription } from "../../utils/apiSubscription";

interface IProps {
  id: number;
  subjectId: number;
  subjectType: string; // 'post' or 'conference'
  subjectTitle: string;
}

interface IState {
  joinFailed: boolean;
  userNotified: boolean;
}

class InviteNotification extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      joinFailed: false,
      userNotified: false
    };

    this.handleAcceptInvite = this.handleAcceptInvite.bind(this);
    this.handleRejectInvite = this.handleRejectInvite.bind(this);
  }

  public async handleAcceptInvite() {
    let joinSuccess: boolean = true;

    // Joining posts is yet to be implemented
    if (this.props.subjectType === "conference") {
      console.log("JOINOU CONFERENCIA");
      joinSuccess = await apiUserJoinConference(this.props.subjectId);
    } else if (this.props.subjectType === "post") {
      try {
        console.log("JOINOU POST");
        const loggedUserId = 1;
        await apiSubscription(
          "post",
          "subscribe",
          loggedUserId,
          this.props.subjectId
        );
      } catch (error) {
        console.log("Failed to subscribe post through invite");
        joinSuccess = false;
      }
    }

    if (!joinSuccess) {
      this.setState({ joinFailed: true });
      return;
    }

    this.apiSeenInvite();
  }

  public handleRejectInvite() {
    this.apiSeenInvite();
  }

  public render() {
    if (this.state.userNotified) {
      return null;
    }

    return (
      <li className="list-group-item">
        <div className="checkbox">{this.getMessage()}</div>
        <div className="pull-right action-buttons">
          <span
            className="far fa-check-square fa-2x"
            onClick={this.handleAcceptInvite}
            style={{ cursor: "pointer" }}
          >
            <p className="tooltipText">
              {this.props.subjectType === "conference" ? "Join" : "Subscribe"}
            </p>
          </span>
          <span
            className="far fa-minus-square fa-2x"
            onClick={this.handleRejectInvite}
            style={{ cursor: "pointer" }}
          >
            <p>Refuse</p>
          </span>
        </div>
      </li>
    );
  }

  public apiSeenInvite() {
    apiInviteNotified(this.props.id);

    this.setState({ userNotified: true });
  }

  private getMessage() {
    if (this.state.joinFailed) {
      return <div>Error accepting invite. Try again later.</div>;
    }

    return (
      <label htmlFor="checkbox">
        You have been invited to {this.props.subjectType}: '
        <a href={`/${this.props.subjectType}/${this.props.subjectId}`}>
          {this.props.subjectTitle}
        </a>
        '.
      </label>
    );
  }
}

export default InviteNotification;
