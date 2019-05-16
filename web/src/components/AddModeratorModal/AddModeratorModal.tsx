import React, { Component } from "react";

import axiosInstance from "../../utils/axiosInstance";
import { dictionary, LanguageContext } from "../../utils/language";

interface IProps {}

interface IState {}

class AddModeratorModal extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  constructor(props: IProps) {
    super(props);

    this.state = {};

    this.handleAddModerator = this.handleAddModerator.bind(this);
  }

  public apiAddModerator() {
    axiosInstance
      .post("/users/moderator/")
      .then(res => {
        console.log("Moderator added");
      })
      .catch(() => console.log("Failed to add moderator"));
  }

  public handleAddModerator() {
    this.apiAddModerator();
  }

  public getActionButton() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={this.handleAddModerator}
        >
          {dictionary.yes[this.context]}
        </button>
      </div>
    );
  }

  public render() {
    return (
      <div
        id="add_moderator_modal"
        className="modal fade"
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
                CENAS
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
              <p>{dictionary.confirm_delete_post[this.context]}</p>
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
}

export default AddModeratorModal;
