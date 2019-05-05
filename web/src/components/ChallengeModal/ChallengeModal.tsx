// - Import react components
import axios from "axios";
import React, { Component } from "react";

// - Import styles
import "./ChallengeModal.module.css";

// - Import app components
import Button from "../Button/Button";
import Select from "../Select/Select";

const CREATE_MODE = "Create";
const EDIT_MODE = "Edit";

interface IProps {
  /* The following attributes are only required for challenge edition */
  conference_id: number;
  id: number;
  title?: string;
  text?: string;
}

interface IState {
  title: string;
  text: string;
}

class ChallengeModal extends Component<IProps, IState> {
  public mode: string;

  constructor(props: IProps) {
    super(props);

    this.mode = props.id ? EDIT_MODE : CREATE_MODE;

    this.state = {
      text: props.text || "",
      title: props.title || ""
    };

    // Challenge manipulation handlers
    this.handleChallengeCreation = this.handleChallengeCreation.bind(this);
    this.handleChallengeEdition = this.handleChallengeEdition.bind(this);
    this.handleChallengeCancel = this.handleChallengeCancel.bind(this);
  }

  public handleChallengeCreation() {
    // this.apiCreateChallenge();
  }

  public handleChallengeEdition() {
    // this.apiEditChallenge();
  }

  public handleChallengeCancel() {
    // Reset field values
    this.setState({
      text: this.props.text || "",
      title: this.props.title || ""
    });
  }

  public validChallenge() {
    return Boolean(this.state.title && this.state.text);
  }

  public getActionButton() {
    return (
      <button
        type="button"
        className="btn btn-primary"
        data-dismiss="modal"
        onClick={
          this.mode === CREATE_MODE
            ? this.handleChallengeCreation
            : this.handleChallengeEdition
        }
        disabled={!this.validChallenge()}
      >
        {this.mode === CREATE_MODE ? "Create new challenge" : "Save changes"}
      </button>
    );
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "challenge_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  public handleInputChange(event: any) {
    const field = event.target.name;
    const value = !event.target.value.replace(/\s/g, "").length
      ? ""
      : event.target.value; // Ignore input only containing white spaces

    const partialState: any = {};
    partialState[field] = value;
    this.setState(partialState);
  }

  public getChallengeForm() {
    return (
      <form className="was-validated">
        <div className="mb-3">
          <h5>Title</h5>
          <input
            name="title"
            type="text"
            autoComplete="off"
            className={this.getInputRequiredClass(this.state.title)}
            onChange={this.handleInputChange}
            placeholder="Insert title"
            value={this.state.title}
            required={true}
          />
          <div
            className="field_required_warning"
            style={this.getInputRequiredStyle(this.state.title)}
          >
            Title must be provided
          </div>
        </div>

        <div className="mb-3">
          <h5>Body</h5>
          <textarea
            name="text"
            className={this.getInputRequiredClass(this.state.text)}
            onChange={this.handleInputChange}
            placeholder="Insert body"
            value={this.state.text}
            required={true}
          />
          <div
            className="field_required_warning"
            style={this.getInputRequiredStyle(this.state.text)}
          >
            Body must be provided
          </div>
        </div>
      </form>
    );
  }

  public render() {
    const htmlId =
      this.mode === CREATE_MODE
        ? `challenge_modal_${CREATE_MODE}`
        : `challenge_modal_${EDIT_MODE}_${this.props.id}`;

    return (
      <div
        id={htmlId}
        className={`modal fade challenge_modal_${this.mode}`}
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
                {`${this.mode} Challenge`}
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
            <div className="modal-body">{this.getChallengeForm()}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={this.handleChallengeCancel}
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

export default ChallengeModal;
