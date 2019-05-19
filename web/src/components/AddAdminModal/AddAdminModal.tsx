import React, { Component } from "react";

import "./AddAdminModal.css";

import { getApiURL } from "../../utils/apiURL";
import axiosInstance from "../../utils/axiosInstance";
import { dictionary, LanguageContext } from "../../utils/language";

interface IProps {
  onResponse: (success: boolean) => void;
}

interface IState {
  admin_email: string;
}

class AddAdminModal extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  public static OnTurnAdmin(email: string, onResponse: any) {
    const body = {
      email
    };

    axiosInstance
      .post(getApiURL("/admin"), body)
      .then(res => onResponse(true))
      .catch(() => onResponse(false));
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      admin_email: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddAdmin = this.handleAddAdmin.bind(this);
  }

  public render() {
    return (
      <div
        id="add_admin_modal"
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
                {dictionary.add_admin[this.context]}
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

  public apiAddAdmin() {
    const body = {
      email: this.state.admin_email
    };

    axiosInstance
      .post(getApiURL("/admin"), body)
      .then(res => this.props.onResponse(true))
      .catch(() => this.props.onResponse(false));
  }

  private handleAddAdmin() {
    this.apiAddAdmin();
  }

  private handleInputChange(e: any) {
    this.setState({
      admin_email: e.target.value
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
          onClick={this.handleAddAdmin}
        >
          {dictionary.submit[this.context]}
        </button>
      </div>
    );
  }
}

export default AddAdminModal;
