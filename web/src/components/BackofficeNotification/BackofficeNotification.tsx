import * as React from "react";

type BackofficeNotificationProps = {
  id: number;
  username: string;
  notificationType: string; // Comment or publication
  content: string;
  contentId: number;
  banUserHandler: any;
  deleteContentHandler: any;
  ignoreHandler: any;
};

export class BackofficeNotification extends React.Component<
  BackofficeNotificationProps,
  {}
> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="container border mb-2 admin_notif">
        <div className="row d-flex justify-content-between mx-1">
          <div className="mt-2" style={{ textTransform: "capitalize" }}>
            <b>{this.props.notificationType} Report</b>
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
          <a href={`/user/${this.props.username}`}>{this.props.username}</a>'s{" "}
          {this.props.notificationType}: <a href="#">"{this.props.content}"</a>{" "}
          has been reported.
        </p>

        <div className="col-12 mb-3 mt-2 dropdown d-flex justify-content-end">
          <button
            className="btn bg-danger dropdown-toggle p-1 text-white"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Take action
          </button>
          <div className="dropdown-menu">
            <a
              className="dropdown-item"
              href="#"
              onClick={this.props.banUserHandler}
            >
              Ban user
            </a>
            <a
              className="dropdown-item"
              href="#"
              onClick={this.props.deleteContentHandler}
            >
              Delete content
            </a>
            <a
              className="dropdown-item"
              href="#"
              onClick={this.props.ignoreHandler}
            >
              Ignore
            </a>
          </div>
        </div>
      </div>
    );
  }
}
