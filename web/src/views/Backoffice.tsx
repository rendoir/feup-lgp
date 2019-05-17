import * as React from "react";
import AddAdminModal from "../components/AdminFunctionsModal/AddAdminModal";
import BanUserModal from "../components/AdminFunctionsModal/BanUserModal";
import UnbanUserModal from "../components/AdminFunctionsModal/UnbanUserModal";
import { BackofficeNotification } from "../components/BackofficeNotification/BackofficeNotification";
import { BackofficeUserCard } from "../components/BackofficeUserCard/BackofficeUserCard";
import { dictionary, LanguageContext } from "../utils/language";
import withAuth from "../utils/withAuth";

type BackofficeState = {
  addAdminSuccess: boolean;
  banUserSuccess: boolean;
  showBanUserAlert: boolean;
  showTurnAdminAlert: boolean;
  showUnbanUserAlert: boolean;
  unbanUserSuccess: boolean;
  usersAreaActive: boolean;
};

const PUBLICATION_NOTIFICATION = "publication";
const COMMENT_NOTIFICATION = "comment";

class Backoffice extends React.Component<{}, BackofficeState> {
  public static contextType = LanguageContext;

  constructor(props: any) {
    super(props);
    this.state = {
      addAdminSuccess: false,
      banUserSuccess: false,
      showBanUserAlert: false,
      showTurnAdminAlert: false,
      showUnbanUserAlert: false,
      unbanUserSuccess: false,
      usersAreaActive: true
    };
    // Admin menu handlers
    this.handleUsersArea = this.handleUsersArea.bind(this);
    this.handleNotifArea = this.handleNotifArea.bind(this);
    this.onAddAdminResponse = this.onAddAdminResponse.bind(this);
    this.onBanUserResponse = this.onBanUserResponse.bind(this);
    this.onUnbanUserResponse = this.onUnbanUserResponse.bind(this);
    // User card button handlers
    this.handleUserCardBan = this.handleUserCardBan.bind(this);
    this.handleUserCardUnban = this.handleUserCardUnban.bind(this);
    this.handleUserCardTurnAdmin = this.handleUserCardTurnAdmin.bind(this);
    this.handleUserCardExpelAdmin = this.handleUserCardExpelAdmin.bind(this);
    // Notification button handlers
    this.handleNotifUserBan = this.handleNotifUserBan.bind(this);
    this.handleNotifContentDelete = this.handleNotifContentDelete.bind(this);
    this.handleNotifIgnore = this.handleNotifIgnore.bind(this);
  }

  public render() {
    return (
      <div id="backoffice_container" className="container mt-3 ml-0">
        {this.getTurnAdminAlert()}
        {this.getBanUserAlert()}
        {this.getUnbanUserAlert()}
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
                <span className="badge badge-light">4</span>
              </a>
              <a
                id="add_admin"
                className="dropdown-item"
                data-toggle="modal"
                data-target="#add_admin_modal"
              >
                {dictionary.add_admin[this.context]}
              </a>
              <a
                id="ban_user"
                className="dropdown-item"
                data-toggle="modal"
                data-target="#ban_user_modal"
              >
                {dictionary.ban_user[this.context]}
              </a>
              <a
                id="unban_user"
                className="dropdown-item"
                data-toggle="modal"
                data-target="#unban_user_modal"
              >
                {dictionary.unban_user[this.context]}
              </a>
            </div>
          </div>
          {this.state.usersAreaActive && this.getUsersArea()}
          {!this.state.usersAreaActive && this.getNotifications()}
          {this.getAddAdminModal()}
          {this.getBanUserModal()}
          {this.getUnbanUserModal()}
        </div>
      </div>
    );
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

  private handleUserCardBan(email: string) {
    BanUserModal.OnBanUser(email, this.onBanUserResponse);
  }

  private handleUserCardUnban(email: string) {
    UnbanUserModal.OnUnbanUser(email, this.onUnbanUserResponse);
  }

  private handleUserCardTurnAdmin(email: string) {
    AddAdminModal.OnTurnAdmin(email, this.onAddAdminResponse);
  }

  private handleUserCardExpelAdmin() {
    console.log("EXPEL USER CARD");
  }

  private handleNotifUserBan() {
    console.log("BAN NOTIFICATION");
  }

  private handleNotifContentDelete() {
    console.log("DELETE CONTENT NOTIFICATION");
  }

  private handleNotifIgnore() {
    console.log("IGNORE NOTIFICATION");
  }

  private getAddAdminModal() {
    return <AddAdminModal onResponse={this.onAddAdminResponse} />;
  }

  private getBanUserModal() {
    return <BanUserModal onResponse={this.onBanUserResponse} />;
  }

  private getUnbanUserModal() {
    return <UnbanUserModal onResponse={this.onUnbanUserResponse} />;
  }

  private onAddAdminResponse(success: boolean) {
    this.setState({
      addAdminSuccess: success,
      showTurnAdminAlert: true
    });
  }

  private onBanUserResponse(success: boolean) {
    this.setState({
      banUserSuccess: success,
      showBanUserAlert: true
    });
  }

  private onUnbanUserResponse(success: boolean) {
    this.setState({
      showUnbanUserAlert: true,
      unbanUserSuccess: success
    });
  }

  private getTurnAdminAlert() {
    const alertMessage = this.state.addAdminSuccess
      ? dictionary.success_add_admin[this.context]
      : dictionary.error_add_admin[this.context];
    const alertType = this.state.addAdminSuccess
      ? "alert-success"
      : "alert-danger";

    if (!this.state.showTurnAdminAlert) {
      return null;
    }

    return (
      <div
        className={`alert ${alertType} alert-dismissible fade show`}
        role="alert"
      >
        {alertMessage}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={() => this.setState({ showTurnAdminAlert: false })}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

  private getBanUserAlert() {
    const alertMessage = this.state.banUserSuccess
      ? dictionary.success_ban_user[this.context]
      : dictionary.error_ban_user[this.context];
    const alertType = this.state.banUserSuccess
      ? "alert-success"
      : "alert-danger";

    if (!this.state.showBanUserAlert) {
      return null;
    }

    return (
      <div
        className={`alert ${alertType} alert-dismissible fade show`}
        role="alert"
      >
        {alertMessage}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={() => this.setState({ showBanUserAlert: false })}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

  private getUnbanUserAlert() {
    const alertMessage = this.state.unbanUserSuccess
      ? dictionary.success_unban_user[this.context]
      : dictionary.error_unban_user[this.context];
    const alertType = this.state.unbanUserSuccess
      ? "alert-success"
      : "alert-danger";

    if (!this.state.showUnbanUserAlert) {
      return null;
    }

    return (
      <div
        className={`alert ${alertType} alert-dismissible fade show`}
        role="alert"
      >
        {alertMessage}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={() => this.setState({ showUnbanUserAlert: false })}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
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
    return (
      <div
        id="backoffice_notifications_area"
        className="col-12 col-md-9 mt-2 mt-md-0"
      >
        {/* Notification list */}
        {/* Comment report notification (one line) */}
        <BackofficeNotification
          id={1}
          username="Alberta Fernandes"
          notificationType={COMMENT_NOTIFICATION}
          content="You are all useless"
          contentId={1}
          banUserHandler={this.handleNotifUserBan}
          deleteContentHandler={this.handleNotifContentDelete}
          ignoreHandler={this.handleNotifIgnore}
        />
        {/* Comment report notification (Multiple lines) */}
        <BackofficeNotification
          id={2}
          username="Alberta Fernandes"
          notificationType={COMMENT_NOTIFICATION}
          content="Very big comment that takes more than one line, look so many characters, surely it has more than one row"
          contentId={2}
          banUserHandler={this.handleNotifUserBan}
          deleteContentHandler={this.handleNotifContentDelete}
          ignoreHandler={this.handleNotifIgnore}
        />
        {/* Publication report notification (one line) */}
        <BackofficeNotification
          id={3}
          username="Alberta Fernandes"
          notificationType={PUBLICATION_NOTIFICATION}
          content="The benefits of anti-vaxx on newborns"
          contentId={3}
          banUserHandler={this.handleNotifUserBan}
          deleteContentHandler={this.handleNotifContentDelete}
          ignoreHandler={this.handleNotifIgnore}
        />
        {/* Publication report notification (multiple line) */}
        <BackofficeNotification
          id={4}
          username="Alberta Fernandes"
          notificationType={PUBLICATION_NOTIFICATION}
          content="Very big publication title that takes multiple lines, with
          useless text just to get to the third row, look how useless these
          characters that are being typed are, now we got there"
          contentId={4}
          banUserHandler={this.handleNotifUserBan}
          deleteContentHandler={this.handleNotifContentDelete}
          ignoreHandler={this.handleNotifIgnore}
        />
      </div>
    );
  }
}

export default withAuth(Backoffice, true);
