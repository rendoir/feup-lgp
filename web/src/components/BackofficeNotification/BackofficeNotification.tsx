import React, { Component } from 'react';

import {
  apiDeleteContent,
  apiGetReportReasons,
  apiIgnoreReports
} from '../../utils/apiReport';
import axiosInstance from '../../utils/axiosInstance';
import { dictionary, LanguageContext } from '../../utils/language';

interface IProps {
  contentId: number;
  content: string;
  contentType: string;
  reportedUserId: number;
  reportedUserEmail: string;
  reporterUserFirstName: string;
  reporterUserLastName: string;
  reportsAmount: number;
}

interface IState {
  adminReviewed: boolean;
  fetchingReasons: boolean;
  operationFailed: boolean;
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
      this.props.contentType === 'comment'
        ? '#'
        : `/${this.props.contentType}/${this.props.contentId}`;

    this.state = {
      adminReviewed: false,
      fetchingReasons: true,
      operationFailed: false,
      reportReasons: []
    };

    this.handleUserBan = this.handleUserBan.bind(this);
    this.handleContentDelete = this.handleContentDelete.bind(this);
    this.handleReportIgnore = this.handleReportIgnore.bind(this);
  }

  public componentDidMount(): void {
    this.apiGetReasons();
  }

  public handleUserBan() {
    const body = {
      email: this.props.reportedUserEmail
    };

    axiosInstance
      .post('/admin/ban', body)
      .then(res => this.apiReportSeen())
      .catch(() => this.setState({ operationFailed: true }));
  }

  public async handleContentDelete() {
    const deleteSuccess = await apiDeleteContent(
      this.props.contentId,
      this.props.contentType
    );

    if (!deleteSuccess) {
      this.setState({ operationFailed: true });
      return;
    }

    this.apiReportSeen();
  }

  public handleReportIgnore() {
    this.apiReportSeen();
  }

  public render() {
    if (this.state.adminReviewed) {
      return null;
    } else if (this.state.operationFailed) {
      return <div>{dictionary.error_occurred[this.context]}</div>;
    }

    return (
      <div className="container border mb-2 admin_notif">
        <div className="row d-flex justify-content-between mx-1">
          <div className="mt-2" style={{ textTransform: 'capitalize' }}>
            <b>
              {dictionary[this.props.contentType][this.context]}{' '}
              {dictionary.report[this.context]}
            </b>
          </div>
          <button
            className="close align-self-end"
            onClick={this.handleReportIgnore}
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
          </a>{' '}
          {dictionary[this.props.contentType][this.context]}:{' '}
          {/* Reported content link */}
          <a href={this.contentURL}>"{this.props.content}"</a>
        </p>

        <div className="row mb-3 d-flex justify-content-between">
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
              {`${dictionary.see_all_reports[this.context]} (${
                this.props.reportsAmount
              })`}
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
                onClick={this.handleUserBan}
              >
                {dictionary.ban_user[this.context]}
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={this.handleContentDelete}
              >
                {dictionary.delete_content[this.context]}
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={this.handleReportIgnore}
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
      return (
        <div className="card card-body pt-0 pb-0 mb-2" key={reason.reporter}>
          <p className="card-text">{reason.description}</p>
          <small>
            <a href={`/user/${reason.reporter}`} className="card-link">
              {`${reason.first_name} ${reason.last_name} `}
            </a>
            {this.getElapsedTime(reason.elapsed_time)}
          </small>
        </div>
      );
    });

    return <div>{reasonList}</div>;
  }

  private getElapsedTime(timeInterval) {
    if (!timeInterval.minutes) {
      return dictionary.now[this.context];
    }

    let elapsedTime = timeInterval.days
      ? timeInterval.days + ` ${dictionary.days[this.context]}`
      : '';
    elapsedTime +=
      timeInterval.hours && timeInterval.hours > 0
        ? ' ' + timeInterval.hours + ` ${dictionary.hours[this.context]}`
        : '';
    elapsedTime +=
      timeInterval.minutes && timeInterval.minutes > 0
        ? ' ' + timeInterval.minutes + ` ${dictionary.minutes[this.context]}`
        : '';
    return elapsedTime + ` ${dictionary.ago[this.context]}`;
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

  private apiReportSeen() {
    apiIgnoreReports(this.props.contentId, this.props.contentType);
    this.setState({ adminReviewed: true });
  }
}
