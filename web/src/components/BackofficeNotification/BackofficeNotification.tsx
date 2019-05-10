import * as React from "react";
import { LanguageContext, dictionary } from "../../utils/language";

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
  static contextType = LanguageContext;

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="container border mb-2 admin_notif">
        <div className="row d-flex justify-content-between mx-1">
          <div className="mt-2" style={{ textTransform: "capitalize" }}>
            <b>
              {dictionary[this.props.notificationType][this.context]}{" "}
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
          <a href={`/user/${this.props.username}`}>{this.props.username}</a>{" "}
          {dictionary[this.props.notificationType][this.context]}:{" "}
          <a href="#">"{this.props.content}"</a>
        </p>

        <div className="col-12 mb-3 mt-2 dropdown d-flex justify-content-end">
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
    );
  }
}
