import React, { Component } from 'react';
// - Import utils
import { apiReportComment, apiReportPost } from '../../utils/apiReport';
import AuthHelperMethods from '../../utils/AuthHelperMethods';
import { dictionary, LanguageContext } from '../../utils/language';

import './PostModal.css';

interface IProps {
  /* Only pass one of the parameters according to the content type */
  postId?: number;
  commentId?: number;
  reportCancelHandler: any;
}

interface IState {
  reportReason: string;
}

class ReportModal extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  public htmlId: string;
  public reportDescription: any = React.createRef();

  private auth = new AuthHelperMethods();

  constructor(props: IProps) {
    super(props);

    this.htmlId = props.postId
      ? `report_post_modal_${props.postId}`
      : `report_comment_modal_${props.commentId}`;

    this.state = { reportReason: '' };

    // Report manipulation handlers
    this.handleReportCreation = this.handleReportCreation.bind(this);
    // Field change handlers
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public handleReportCreation() {
    if (this.props.postId) {
      apiReportPost(this.props.postId, this.state.reportReason);
    } else if (this.props.commentId) {
      apiReportComment(this.props.commentId, this.state.reportReason);
    }
  }

  public handleInputChange(event: any) {
    const value = !event.target.value.replace(/\s/g, '').length
      ? ''
      : event.target.value; // Ignore input only containing white spaces

    this.setState({ reportReason: value });
  }

  public validReport() {
    return Boolean(this.state.reportReason);
  }

  public getInputRequiredClass(content: string) {
    return content === '' ? 'empty_required_field' : 'post_field';
  }

  public getInputRequiredStyle(content: string) {
    return content !== '' ? { display: 'none' } : {};
  }

  public getReportForm() {
    return (
      <form className="was-validated">
        <div className="mb-3">
          <h5>{dictionary.report_reason[this.context]}</h5>
          <textarea
            name="text"
            className={this.getInputRequiredClass(this.state.reportReason)}
            onChange={this.handleInputChange}
            placeholder={dictionary.report_reason[this.context]}
            value={this.state.reportReason}
            required={true}
          />
          <div
            className="field_required_warning"
            style={this.getInputRequiredStyle(this.state.reportReason)}
          >
            {dictionary.report_reason_required[this.context]}
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
        {dictionary.report_submit[this.context]}
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
                {dictionary.content_report[this.context]}
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

export default ReportModal;
