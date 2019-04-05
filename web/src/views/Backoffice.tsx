import * as React from "react";
import Button from "../components/Button/Button";

interface BackofficeState {
  usersAreaActive: boolean;
}

interface BackofficeUserCardProps {
  name: string;
  image: string;
  email: string;
  institution: string;
  profession: string;
  userType?: string; //This parameter can be ommited if it's a regular user
  banHandler?: any; //Regular and admin users require this handler
  unbanHandler?: any; //Banned users require this handler
  turnAdminHandler?: any; //Regular users require this handler
  expelAdminHandler?: any; //Admin users require this handler
}

interface BackofficeNotificationProps {
  id: number;
  username: string;
  notificationType: string; //Comment or publication
  content: string;
  contentId: number;
  banUserHandler: any;
  deleteContentHandler: any;
  ignoreHandler: any;
}

const BANNED_USER = "banned";
const ADMIN_USER = "admin";

class BackofficeUserCard extends React.Component<BackofficeUserCardProps, {}> {
  constructor(props: any) {
    super(props);
  }

  getButtons() {
    const banButton = (
      <button
        className="btn btn-danger btn-block"
        onClick={this.props.banHandler}
      >
        Ban
      </button>
    );
    const unbanButton = (
      <button
        className="btn btn-primary btn-block"
        onClick={this.props.unbanHandler}
      >
        Unban
      </button>
    );
    const turnAdminButton = (
      <button
        className="btn btn-info btn-block"
        onClick={this.props.turnAdminHandler}
      >
        Turn admin
      </button>
    );
    const expelAdminButton = (
      <button
        className="btn btn-primary btn-block"
        onClick={this.props.expelAdminHandler}
      >
        Expel admin
      </button>
    );

    let userTypeButton;
    switch (this.props.userType) {
      case BANNED_USER:
        userTypeButton = unbanButton;
        break;

      case ADMIN_USER:
        userTypeButton = expelAdminButton;
        break;

      default:
        userTypeButton = turnAdminButton;
        break;
    }

    return (
      <div className="col-12 col-lg-2 justify-content-lg-center">
        {this.props.userType !== BANNED_USER && (
          <div className="row mb-3">{banButton}</div>
        )}
        <div className="row">{userTypeButton}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="card mb-2">
        <div className="card-header">{this.props.name}</div>
        <div className="card-body row col-md d-flex align-items-center">
          <div className="col-12 col-lg-2">
            <img
              className="img-fluid img-thumbnail rounded-circle d-flex justify-content-center"
              src={this.props.image}
              alt="card image"
            />
          </div>
          <div className="col-12 col-lg-8 mb-2 mb-lg-0">
            <p className="card-text">
              <strong>Email:</strong> {this.props.email}
            </p>
            <p className="card-text">
              <strong>Institution/College:</strong> {this.props.institution}
            </p>
            <p className="card-text">
              <strong>Profession/Course:</strong> {this.props.profession}
            </p>
          </div>
          {this.getButtons()}
        </div>
      </div>
    );
  }
}

const PUBLICATION_NOTIFICATION = "publication";
const COMMENT_NOTIFICATION = "comment";

class BackofficeNotification extends React.Component<
  BackofficeNotificationProps,
  {}
> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="container border mb-2">
        <div className="row d-flex justify-content-between mx-1">
          <div className="mt-2">
            <b>Comment Report</b>
          </div>
          <button className="close align-self-end">
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="dropdown-divider p" />

        <p className="report_message">
          <a href="#">Alberta Ferndes</a> comment:{" "}
          <a href="#">"You are all useless"</a> has been reported.
        </p>

        <div className="col-12 mb-3 dropdown d-flex justify-content-end">
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
            <a className="dropdown-item" href="#">
              Ban user
            </a>
            <a className="dropdown-item" href="#">
              Delete content
            </a>
            <a className="dropdown-item" href="#">
              Ignore
            </a>
          </div>
        </div>
      </div>
    );
  }
}

class Backoffice extends React.Component<{}, BackofficeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      usersAreaActive: true
    };

    //User card button handlers
    this.handleUserCardBan = this.handleUserCardBan.bind(this);
    this.handleUserCardUnban = this.handleUserCardUnban.bind(this);
    this.handleUserCardTurnAdmin = this.handleUserCardTurnAdmin.bind(this);
    this.handleUserCardExpelAdmin = this.handleUserCardExpelAdmin.bind(this);

    //Notification button handlers
    this.handleNotificationUserBan = this.handleNotificationUserBan.bind(this);
    this.handleNotificationContentDelete = this.handleNotificationContentDelete.bind(
      this
    );
    this.handleNotificationIgnore = this.handleNotificationIgnore.bind(this);
  }

  handleUserCardBan() {
    console.log("BAN USER CARD");
  }

  handleUserCardUnban() {
    console.log("UN-BAN USER CARD");
  }

  handleUserCardTurnAdmin() {
    console.log("TURN USER CARD");
  }

  handleUserCardExpelAdmin() {
    console.log("EXPEL USER CARD");
  }

  handleNotificationUserBan() {
    console.log("BAN NOTIFICATION");
  }

  handleNotificationContentDelete() {
    console.log("DELETE CONTENT NOTIFICATION");
  }

  handleNotificationIgnore() {
    console.log("IGNORE NOTIFICATION");
  }

  getUsersArea() {
    return (
      <div id="backoffice_users_area" className="col-12 col-sm-9">
        {/* User search form */}
        <div className="row d-flex justify-content-center">
          <div className="dropdown mr-4 col-xs-12">
            <button
              className="btn bg-secondary dropdown-toggle mt-2 mb-2 p-1 text-white"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Search type
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">
                All users
              </a>
              <a className="dropdown-item" href="#">
                Admins
              </a>
              <a className="dropdown-item" href="#">
                Banned users
              </a>
            </div>
          </div>
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-1"
              type="text"
              placeholder="Search user"
            />
            <button
              className="form-control btn btn-secondary my-2 my-sm-0 fas fa-search"
              type="submit"
            />
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
            name="Alberta Ferndandes Normal"
            image="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
            email="alberta.fcup55@fe.up.pt"
            institution="Faculty of Medicine of University of Porto"
            profession="Urology"
            userType={BANNED_USER}
            unbanHandler={this.handleUserCardUnban}
          />

          {/* Alberta admin */}
          <BackofficeUserCard
            name="Alberta Ferndandes Normal"
            image="https://pbs.twimg.com/profile_images/938813312506064896/ciY68hiP_400x400.jpg"
            email="alberta.fcup55@fe.up.pt"
            institution="Faculty of Medicine of University of Porto"
            profession="Urology"
            userType={ADMIN_USER}
            banHandler={this.handleUserCardBan}
            expelAdminHandler={this.handleUserCardExpelAdmin}
          />
        </div>
      </div>
    );
  }

  getNotifications() {
    return (
      <div
        id="backoffice_notifications_area"
        className="col-12 col-md-9 mt-2 mt-md-0"
      >
        {/* Notification list */}
        {/* Comment report notification (one line) */}
        <div className="container border mb-2">
          <div className="row d-flex justify-content-between mx-1">
            <div className="mt-2">
              <b>Comment Report</b>
            </div>
            <button className="close align-self-end">
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="dropdown-divider p" />

          <p className="report_message">
            <a href="#">Alberta Ferndes</a> comment:{" "}
            <a href="#">"You are all useless"</a> has been reported.
          </p>

          <div className="col-12 mb-3 dropdown d-flex justify-content-end">
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
              <a className="dropdown-item" href="#">
                Ban user
              </a>
              <a className="dropdown-item" href="#">
                Delete content
              </a>
              <a className="dropdown-item" href="#">
                Ignore
              </a>
            </div>
          </div>
        </div>

        {/* Comment report notification (Multiple lines) */}
        <div className="container border mb-2">
          <div className="row d-flex justify-content-between mx-1">
            <div className="mt-2">
              <b>Comment Report</b>
            </div>
            <button className="close align-self-end">
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="dropdown-divider p" />

          <p className="report_message">
            <a href="#">Alberta Ferndes</a> comment:{" "}
            <a href="#">
              "Very big comment that takes more than one line, look so many
              characters, surely it has more than one row"
            </a>{" "}
            has been reported.
          </p>

          <div className="col-12 mb-3 dropdown d-flex justify-content-end">
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
              <a className="dropdown-item" href="#">
                Ban user
              </a>
              <a className="dropdown-item" href="#">
                Delete content
              </a>
              <a className="dropdown-item" href="#">
                Ignore
              </a>
            </div>
          </div>
        </div>

        {/* Publication report notification (one line) */}
        <div className="container border mb-2">
          <div className="row d-flex justify-content-between mx-1">
            <div className="mt-2">
              <b>Publication Report</b>
            </div>
            <button className="close align-self-end">
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="dropdown-divider p" />

          <p className="report_message">
            <a href="#">Alberta Ferndes</a> publication:{" "}
            <a href="#">"The benefits of anti-vaxx on newborns"</a> has been
            reported.
          </p>

          <div className="col-12 mb-3 dropdown d-flex justify-content-end">
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
              <a className="dropdown-item" href="#">
                Ban user
              </a>
              <a className="dropdown-item" href="#">
                Delete content
              </a>
              <a className="dropdown-item" href="#">
                Ignore
              </a>
            </div>
          </div>
        </div>

        {/* Publication report notification (multiple line) */}
        <div className="container border mb-2">
          <div className="row d-flex justify-content-between mx-1">
            <div className="mt-2">
              <b>Publication Report</b>
            </div>
            <button className="close align-self-end">
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="dropdown-divider p" />

          <p className="report_message">
            <a href="#">Alberta Ferndes</a> publication:{" "}
            <a href="#">
              "Very big publication title that takes multiple lines, with
              useless text just to get to the third row, look how useless these
              characters that are being typed are, now we got there"
            </a>{" "}
            has been reported.
          </p>

          <div className="col-12 mb-3 dropdown d-flex justify-content-end">
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
              <a className="dropdown-item" href="#">
                Ban user
              </a>
              <a className="dropdown-item" href="#">
                Delete content
              </a>
              <a className="dropdown-item" href="#">
                Ignore
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div id="backoffice_container" className="container mt-3 ml-0">
        <div className="row">
          {/* Admin menu */}
          <div className="col-12 col-sm-3">
            <div className="dropdown">
              <h6 className="dropdown-header">Admin area</h6>
              <div className="dropdown-divider" />
              <a id="manage_users" className="dropdown-item" href="#">
                Manage users
              </a>
              <a id="notifications" className="dropdown-item" href="#">
                Notifications <span className="badge badge-light">4</span>
              </a>
            </div>
          </div>

          {this.state.usersAreaActive && this.getUsersArea()}
          {!this.state.usersAreaActive && this.getNotifications()}
        </div>
      </div>
    );
  }
}

export default Backoffice;
