import React, { Component } from "react";

import { apiGetReportReasons } from "../../utils/apiReport";
import { dictionary, LanguageContext } from "../../utils/language";

interface IProps {
  contentId: number;
  content: string;
  contentType: string;
  reportedUserId: number;
  reporterUserFirstName: string;
  reporterUserLastName: string;
  reportsAmount: number;
  banUserHandler: any;
  deleteContentHandler: any;
  ignoreHandler: any;
}

interface IState {
  fetchingReasons: boolean;
  reportReasons: any;
}

export class BackofficeNotification extends Component<IProps, IState> {
  public static contextType = LanguageContext;
  private contentURL;
  private reportReasonsExpansionId = `reasons_${this.props.contentType}_${
    this.props.contentId
  }`;

  constructor(props: any) {
    super(props);

    this.contentURL =
      this.props.contentType === "comment"
        ? "#"
        : `/${this.props.contentType}/${this.props.contentId}`;

    this.state = {
      fetchingReasons: true,
      reportReasons: []
    };
  }

  public componentDidMount(): void {
    this.apiGetReasons();
  }

  public render() {
    return (
      <div className="container border mb-2 admin_notif">
        <div className="row d-flex justify-content-between mx-1">
          <div className="mt-2" style={{ textTransform: "capitalize" }}>
            <b>
              {dictionary[this.props.contentType][this.context]}{" "}
              {dictionary.report[this.context]}
            </b>
          </div>
          <button
            className="close align-self-end"
            onClick={this.props.ignoreHandler}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="dropdown-divider p" />

        <p className="report_message">
          {/* User profile link */}
          <a href={`/user/${this.props.reportedUserId}`}>
            {`${this.props.reporterUserFirstName} ${
              this.props.reporterUserLastName
            }`}
          </a>{" "}
          {dictionary[this.props.contentType][this.context]}:{" "}
          {/* Reported content link */}
          <a href={this.contentURL}>"{this.props.content}"</a>
        </p>

        <div className="row mb-3 d-flex justify-content-between border">
          {/* Expand all report reasons */}
          <div className="col mt-1">
            <a
              className="see_all_reports"
              data-toggle="collapse"
              href={`#${this.reportReasonsExpansionId}`}
              role="button"
              aria-expanded="false"
              aria-controls={this.reportReasonsExpansionId}
            >
              See all {this.props.reportsAmount} reports
            </a>
          </div>

          {/* Report actions dropdown */}
          <div className="col dropdown d-flex justify-content-end">
            <button
              className="btn bg-danger dropdown-toggle p-1 text-white"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {dictionary.take_action[this.context]}
            </button>
            <div className="dropdown-menu">
              <a
                className="dropdown-item"
                href="#"
                onClick={this.props.banUserHandler}
              >
                {dictionary.ban_user[this.context]}
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={this.props.deleteContentHandler}
              >
                {dictionary.delete_content[this.context]}
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={this.props.ignoreHandler}
              >
                {dictionary.ignore[this.context]}
              </a>
            </div>
          </div>
        </div>
        {/* Report reasons */}
        <div className="collapse" id={this.reportReasonsExpansionId}>
          {this.getReportReasons()}
        </div>
      </div>
    );
  }

  private getReportReasons() {
    if (this.state.fetchingReasons) {
      return <div>Fetching</div>;
    } else if (
      !this.state.reportReasons ||
      this.state.reportReasons.length === 0
    ) {
      return <div>{dictionary.error_notifications[this.context]}</div>;
    }

    const reasonList = this.state.reportReasons.map(reason => {
      console.log(reason);
      return (
        <div className="card card-body" key={reason.reporter}>
          <a href={`/user/${reason.reporter}`} className="card-link">
            Card link
          </a>
        </div>
      );
    });

    return <div>{reasonList}</div>;
  }

  private async apiGetReasons() {
    const reportReasons = await apiGetReportReasons(
      this.props.contentId,
      this.props.contentType
    );
    this.setState({
      fetchingReasons: false,
      reportReasons
    });
  }
}
