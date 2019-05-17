import React, { Component } from "react";

import "./AdminFunctionsModal.css";

import { getApiURL } from "../../utils/apiURL";
import axiosInstance from "../../utils/axiosInstance";
import { dictionary, LanguageContext } from "../../utils/language";

interface IProps {
  onResponse: (success: boolean) => void;
}

interface IState {
  user_email: string;
}

class UnbanUserModal extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  public static OnUnbanUser(email: string, onResponse: any) {
    const body = {
      email
    };

    axiosInstance
      .post(getApiURL("/admin/unban"), body)
      .then(res => onResponse(true))
      .catch(() => onResponse(false));
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      user_email: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUnbanUser = this.handleUnbanUser.bind(this);
  }

  public render() {
    return (
      <div
        id="unban_user_modal"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
        data-backdrop="false"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                {dictionary.unban_user[this.context]}
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
              <h5>{dictionary.insert_admin_email[this.context]}</h5>
              <input
                name="admin_email"
                type="email"
                autoComplete="off"
                className="post_field"
                onChange={this.handleInputChange}
                placeholder={dictionary.insert_admin_email[this.context]}
                required={true}
              />
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
    );
  }

  public apiUnbanUser() {
    const body = {
      email: this.state.user_email
    };

    axiosInstance
      .post(getApiURL("/admin/unban"), body)
      .then(res => this.props.onResponse(true))
      .catch(() => this.props.onResponse(false));
  }

  private handleUnbanUser() {
    this.apiUnbanUser();
  }

  private handleInputChange(e: any) {
    this.setState({
      user_email: e.target.value
    });
  }

  private getActionButton() {
    return (
      <div>
        <button
          type="button"
          role="submit"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={this.handleUnbanUser}
        >
          {dictionary.submit[this.context]}
        </button>
      </div>
    );
  }
}

export default UnbanUserModal;
