import React, { Component } from "react";

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
  afterInviteMessage: string;
  fetchingUninvitedSubs: boolean;
  fetchingUninvitedUsers: boolean;
  inviteUserInput: string;
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
    console.log("invite modal id: ", this.htmlId);
    this.state = {
      afterInviteMessage: "",
      fetchingUninvitedSubs: true,
      fetchingUninvitedUsers: true,
      inviteUserInput: "",
      uninvitedSubscribersAmount: 0,
      uninvitedUsers: [
        {
          first_name: "Rodrigo",
          home_town: "Gaia",
          id: 1,
          last_name: "Pinto",
          university: "",
          work: "surgeon",
          work_field: "Cardiology"
        },
        {
          first_name: "Joao",
          home_town: "Porto",
          id: 1,
          last_name: "Carlos",
          university: "FEUP",
          work: "",
          work_field: ""
        }
      ],
      waitingSubscribersInvitation: false,
      waitingUserInvitation: false
    };

    this.handleInviteSubscribers = this.handleInviteSubscribers.bind(this);
    this.handleInviteUser = this.handleInviteUser.bind(this);
    this.handlerInviteUserInputChange = this.handlerInviteUserInputChange.bind(
      this
    );
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
    this.setState({
      fetchingUninvitedSubs: false,
      uninvitedSubscribersAmount
    });
  }

  public async apiGetUninvitedUsers() {
    this.setState({ fetchingUninvitedUsers: true });

    const uninvitedUsers = await apiGetUninvitedUsersInfo(
      this.subjectId,
      this.subjectType
    );

    if (!uninvitedUsers || uninvitedUsers.length === 0) {
      this.setState({
        fetchingUninvitedUsers: false,
        uninvitedUsers: []
      });
      return;
    }

    this.setState({
      fetchingUninvitedUsers: false,
      uninvitedUsers
    });
  }

  public handlerInviteUserInputChange(e) {
    const noExtraWhiteSpace = e.target.value.replace(/\s+/g, " ");
    this.setState({ inviteUserInput: noExtraWhiteSpace });
  }

  public async handleInviteSubscribers() {
    this.setState({
      waitingSubscribersInvitation: true
    });

    const inviteSuccess = await apiInviteSubscribers(
      this.subjectId,
      this.subjectType
    );

    this.apiGetUninvitedUsers(); // Fetch uninvited users again, since subscribers may have been invited

    const uninvitedSubscribersLeft = inviteSuccess
      ? 0
      : this.state.uninvitedSubscribersAmount;

    this.setState({
      uninvitedSubscribersAmount: uninvitedSubscribersLeft,
      waitingSubscribersInvitation: false
    });
  }

  public async handleInviteUser() {
    const names = this.state.inviteUserInput.trim().split(" ");
    const firstName = names[0];
    const lastName = names[1];

    let userFound = false;

    this.state.uninvitedUsers.forEach(async user => {
      if (user.first_name !== firstName || user.last_name !== lastName) {
        return;
      }

      userFound = true;

      const inviteSuccess = await apiInviteUser(
        this.subjectId,
        user.id,
        this.subjectType
      );

      let afterInviteMessage = "User " + firstName + " " + lastName;
      if (inviteSuccess) {
        afterInviteMessage += " was successfully invited";
      } else {
        afterInviteMessage += " couldn't be invited. An error occurred.";
      }

      this.setState({ afterInviteMessage });

      // Since we invited a new user, refetch the ones who are not invited yet
      this.apiGetUninvitedUsers();
      this.apiGetUninvitedSubsAmount();
    });

    if (!userFound) {
      this.setState({
        afterInviteMessage:
          "No uninvited user called " +
          firstName +
          " " +
          lastName +
          " was found"
      });
    }
  }

  public getInviteUserForm() {
    if (this.state.fetchingUninvitedUsers) {
      return <div>Fetching uninvited users...</div>;
    } else if (this.state.uninvitedUsers.length === 0) {
      return <div>There are no uninvited users left</div>;
    }

    const searchUserInput = (
      <input
        key={0}
        id="invite_user_input"
        className="mr-sm-2"
        type="search"
        placeholder="Insert user's first and last name"
        aria-label="Search"
        value={this.state.inviteUserInput}
        onChange={this.handlerInviteUserInputChange}
      />
    );
    const searchButton = (
      <button
        key={1}
        className="my-2 my-sm-0"
        type="button"
        onClick={this.handleInviteUser}
      >
        Invite
      </button>
    );

    return [searchUserInput, searchButton];
  }

  public getInviteSubscribersButton() {
    if (this.state.fetchingUninvitedSubs) {
      return <div>Fetching uninvited subscribers..</div>;
    }

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

    return invSubscribersButton;
  }

  public render() {
    return (
      <div
        id={this.htmlId}
        className={`modal fade invite_modal`}
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
            <div className="modal-body">
              <div className="row d-flex justify-content-center">
                {this.getInviteSubscribersButton()}
              </div>
              <div className="row d-flex justify-content-center mt-5">
                {this.getInviteUserForm()}
              </div>
              <div className="row d-flex justify-content-center">
                {this.state.afterInviteMessage !== "" &&
                  this.state.afterInviteMessage}
              </div>
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
