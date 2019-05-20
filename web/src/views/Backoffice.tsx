import * as React from "react";

import { BackofficeNotification } from "../components/BackofficeNotification/BackofficeNotification";
import { BackofficeUserCard } from "../components/BackofficeUserCard/BackofficeUserCard";

import { apiGetReportNotificationsInfo } from "../utils/apiReport";
import { dictionary, LanguageContext } from "../utils/language";
import withAuth from "../utils/withAuth";

type BackofficeState = {
  fetchingNotifications: boolean;
  notifications: any[];
  notificationsAmount: number;
  usersAreaActive: boolean;
};

class Backoffice extends React.Component<{}, BackofficeState> {
  public static contextType = LanguageContext;

  constructor(props: any) {
    super(props);

    this.state = {
      fetchingNotifications: true,
      notifications: [],
      notificationsAmount: 0,
      usersAreaActive: false
    };

    // Admin menu handlers
    this.handleUsersArea = this.handleUsersArea.bind(this);
    this.handleNotifArea = this.handleNotifArea.bind(this);
    // User card button handlers
    this.handleUserCardBan = this.handleUserCardBan.bind(this);
    this.handleUserCardUnban = this.handleUserCardUnban.bind(this);
    this.handleUserCardTurnAdmin = this.handleUserCardTurnAdmin.bind(this);
    this.handleUserCardExpelAdmin = this.handleUserCardExpelAdmin.bind(this);
  }

  public componentDidMount(): void {
    this.apiGetNotifications();
  }

  public render() {
    return (
      <div id="backoffice_container" className="container mt-3 ml-0">
        <div className="row">
          {/* Admin menu */}
          <div className="col-12 col-md-3">
            <div className="dropdown">
              <h6 className="dropdown-header">
                {dictionary.admin_area[this.context]}
              </h6>
              <div className="dropdown-divider" />
              <a
                id="manage_users"
                className="dropdown-item"
                onClick={this.handleUsersArea}
              >
                {dictionary.manage_users[this.context]}
              </a>
              <a
                id="notifications"
                className="dropdown-item"
                onClick={this.handleNotifArea}
              >
                {dictionary.notifications[this.context]}{" "}
                <span className="badge badge-light">
                  {this.state.notificationsAmount}
                </span>
              </a>
            </div>
          </div>
          {this.state.usersAreaActive && this.getUsersArea()}
          {!this.state.usersAreaActive && this.getNotifications()}
        </div>
      </div>
    );
  }

  private async apiGetNotifications() {
    const notifications = await apiGetReportNotificationsInfo();
    const notificationsAmount = notifications ? notifications.length : 0;
    this.setState({
      fetchingNotifications: false,
      notifications,
      notificationsAmount
    });
  }

  private handleUsersArea() {
    this.setState({
      usersAreaActive: true
    });
  }

  private handleNotifArea() {
    this.setState({
      usersAreaActive: false
    });
  }

  private handleUserCardBan() {
    console.log("BAN USER CARD");
  }

  private handleUserCardUnban() {
    console.log("UN-BAN USER CARD");
  }

  private handleUserCardTurnAdmin() {
    console.log("TURN USER CARD");
  }

  private handleUserCardExpelAdmin() {
    console.log("EXPEL USER CARD");
  }

  private getUsersArea() {
    return (
      <div id="backoffice_users_area" className="col-12 col-md-9">
        {/* User search form */}
        <div className="row d-flex justify-content-center ml-sm-5">
          <div className="dropdown d-flex justify-content-center justify-content-sm-end col-sm-3">
            <button
              className="btn bg-secondary dropdown-toggle mt-2 mb-2 p-1 text-white"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {dictionary.search_type[this.context]}
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">
                {dictionary.all_users[this.context]}
              </a>
              <a className="dropdown-item" href="#">
                {dictionary.administrators[this.context]}
              </a>
              <a className="dropdown-item" href="#">
                {dictionary.banned_users[this.context]}
              </a>
            </div>
          </div>
          <form className="form-inline w-75 row col-sm-9 my-2 my-lg-0">
            <input
              className="form-control mr-1"
              type="text"
              placeholder={dictionary.search_user[this.context]}
            />
            <button
              className="form-control btn btn-secondary my-2 my-sm-0"
              type="submit"
            >
              <i className="fas fa-search" />
            </button>
          </form>
        </div>
        {/* User list*/}
        <div className="col">
          {/* Alberta normal */}
          <BackofficeUserCard
            name="Alberta Ferndandes Normal"
            image="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
            email="alberta.fcup55@fe.up.pt"
            institution="Faculty of Medicine of University of Porto"
            profession="Urology"
            banHandler={this.handleUserCardBan}
            turnAdminHandler={this.handleUserCardTurnAdmin}
          />
          {/* Alberta banned */}
          <BackofficeUserCard
            name="Alberta Ferndandes Banned"
            image="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
            email="alberta.fcup55@fe.up.pt"
            institution="Faculty of Medicine of University of Porto"
            profession="Urology"
            userType={BackofficeUserCard.BANNED_USER}
            unbanHandler={this.handleUserCardUnban}
          />
          {/* Alberta admin */}
          <BackofficeUserCard
            name="Alberta Ferndandes Admin"
            image="https://pbs.twimg.com/profile_images/938813312506064896/ciY68hiP_400x400.jpg"
            email="alberta.fcup55@fe.up.pt"
            institution="Faculty of Medicine of University of Porto"
            profession="Urology"
            userType={BackofficeUserCard.ADMIN_USER}
            banHandler={this.handleUserCardBan}
            expelAdminHandler={this.handleUserCardExpelAdmin}
          />
        </div>
      </div>
    );
  }

  private getNotifications() {
    if (this.state.fetchingNotifications) {
      return null;
    } else if (!this.state.notifications) {
      return <div>{dictionary.error_notifications[this.context]}</div>;
    } else if (this.state.notifications.length === 0) {
      return (
        <div id="no-notifications">
          {dictionary.no_notifications[this.context]}
        </div>
      );
    }

    const notificationList = this.state.notifications.map(notif => {
      return (
        <BackofficeNotification
          key={notif.content_id + notif.content_type}
          contentId={notif.content_id}
          content={notif.content_description}
          contentType={notif.content_type}
          reportedUserId={notif.reported_user_id}
          reporterUserFirstName={notif.reported_user_first_name}
          reporterUserLastName={notif.reported_user_last_name}
          reportsAmount={notif.reports_amount}
        />
      );
    });

    return (
      <div
        id="backoffice_notifications_area"
        className="col-12 col-md-9 mt-2 mt-md-0"
      >
        {notificationList}
      </div>
    );
  }
}

export default withAuth(Backoffice, true);
