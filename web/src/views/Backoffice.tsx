import * as React from "react";

interface BackofficeUserCardProps {
  name: string;
  image: string;
  email: string;
  institution: string;
  profession: string;
  userType?: string; // This parameter can be ommited if it's a regular user
  banHandler?: any; // Regular and admin users require this handler
  unbanHandler?: any; // Banned users require this handler
  turnAdminHandler?: any; // Regular users require this handler
  expelAdminHandler?: any; // Admin users require this handler
}

interface BackofficeNotificationProps {
  id: number;
  username: string;
  notificationType: string; // Comment or publication
  content: string;
  contentId: number;
  banUserHandler: any;
  deleteContentHandler: any;
  ignoreHandler: any;
}

interface BackofficeState {
  usersAreaActive: boolean;
}

const BANNED_USER = "banned";
const ADMIN_USER = "admin";

class BackofficeUserCard extends React.Component<BackofficeUserCardProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public getButtons() {
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
      <div className="col-12 col-lg-2 justify-content-lg-center ml-3 ml-lg-0">
        {this.props.userType !== BANNED_USER && (
          <div className="row mb-3">{banButton}</div>
        )}
        <div className="row">{userTypeButton}</div>
      </div>
    );
  }

  public render() {
    return (
      <div className="card mb-2">
        <div className="card-header">{this.props.name}</div>
        <div className="card-body row col-md d-flex align-items-center pr-lg-2 pr-xl-4">
          <div className="col-12 col-lg-2 d-flex justify-content-center">
            <img
              className="img-fluid img-thumbnail rounded-circle"
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

class Backoffice extends React.Component<{}, BackofficeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      usersAreaActive: true
    };
    // Admin menu handlers
    this.handleUsersArea = this.handleUsersArea.bind(this);
    this.handleNotifArea = this.handleNotifArea.bind(this);
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

  public handleUsersArea() {
    this.setState({
      usersAreaActive: true
    });
  }

  public handleNotifArea() {
    this.setState({
      usersAreaActive: false
    });
  }

  public handleUserCardBan() {
    console.log("BAN USER CARD");
  }

  public handleUserCardUnban() {
    console.log("UN-BAN USER CARD");
  }

  public handleUserCardTurnAdmin() {
    console.log("TURN USER CARD");
  }

  public handleUserCardExpelAdmin() {
    console.log("EXPEL USER CARD");
  }

  public handleNotifUserBan() {
    console.log("BAN NOTIFICATION");
  }

  public handleNotifContentDelete() {
    console.log("DELETE CONTENT NOTIFICATION");
  }

  public handleNotifIgnore() {
    console.log("IGNORE NOTIFICATION");
  }

  public getUsersArea() {
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
          <form className="form-inline w-75 row col-sm-9 my-2 my-lg-0">
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
            name="Alberta Ferndandes Banned"
            image="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
            email="alberta.fcup55@fe.up.pt"
            institution="Faculty of Medicine of University of Porto"
            profession="Urology"
            userType={BANNED_USER}
            unbanHandler={this.handleUserCardUnban}
          />
          {/* Alberta admin */}
          <BackofficeUserCard
            name="Alberta Ferndandes Admin"
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

  public getNotifications() {
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

  public render() {
    return (
      <div id="backoffice_container" className="container mt-3 ml-0">
        <div className="row">
          {/* Admin menu */}
          <div className="col-12 col-md-3">
            <div className="dropdown">
              <h6 className="dropdown-header">Admin area</h6>
              <div className="dropdown-divider" />
              <a
                id="manage_users"
                className="dropdown-item"
                onClick={this.handleUsersArea}
              >
                Manage users
              </a>
              <a
                id="notifications"
                className="dropdown-item"
                onClick={this.handleNotifArea}
              >
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
