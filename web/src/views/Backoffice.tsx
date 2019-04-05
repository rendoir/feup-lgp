import * as React from "react";

interface BackofficeState {
  usersAreaActive: boolean;
}

interface BackofficeUserCardProps {
  name: string;
  image: string;
  email: string;
  institution: string;
  profession: string;
  userType: string;
  banHandler: any;
  unbanHandler: any;
  turnAdminHandler: any;
  expelAdminHandler: any;
}

const BANNED_USER = "banned";
const ADMIN_USER = "admin";

class BackofficeUserCard extends React.Component<BackofficeUserCardProps, {}> {
  constructor(props: any) {
    super(props);
  }

  getButtons() {
    //generalizar class name
    const banButton = (
      <div className="row mb-3">
        <button
          className="btn btn-danger btn-block"
          onClick={this.props.banHandler}
        >
          Ban
        </button>
      </div>
    );

    const unbanButton = (
      <div className="row">
        <button
          className="btn btn-primary btn-block"
          onClick={this.props.unbanHandler}
        >
          Unban
        </button>
      </div>
    );

    const turnAdminButton = (
      <div className="row">
        <button
          className="btn btn-info btn-block"
          onClick={this.props.turnAdminHandler}
        >
          Turn admin
        </button>
      </div>
    );

    const expelAdminButton = (
      <div className="row">
        <button
          className="btn btn-primary btn-block"
          onClick={this.props.expelAdminHandler}
        >
          Expel admin
        </button>
      </div>
    );
    let buttons = [];
    if (this.props.userType === BANNED_USER) {
      buttons.push(unbanButton);
    } else {
      buttons.push(banButton);
      if (this.props.userType === ADMIN_USER) buttons.push(expelAdminButton);
      else buttons.push(turnAdminButton);
    }

    return (
      <div className="col-12 col-lg-2 justify-content-lg-center">{buttons}</div>
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
          />

          {/* Alberta banned */}
          <div className="card mb-2">
            <div className="card-header">Alberta Ferndandes Banned</div>
            <div className="card-body row col-md d-flex align-items-center">
              <div className="col-12 col-lg-2">
                <img
                  className="img-fluid img-thumbnail rounded-circle d-flex justify-content-center"
                  src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
                  alt="card image"
                />
              </div>
              <div className="col-12 col-lg-8 mb-2 mb-lg-0">
                <p className="card-text">
                  <strong>Email:</strong> alberta.fcup55@fe.up.pt
                </p>
                <p className="card-text">
                  <strong>Institution/College:</strong> Faculty of Medicine of
                  University of Porto
                </p>
                <p className="card-text">
                  <strong>Profession/Course:</strong> Urology
                </p>
              </div>
              <div className="col-12 col-lg-2 justify-content-lg-center">
                <div className="row mb-3">
                  <button className="btn btn-primary btn-block">Unban</button>
                </div>
              </div>
            </div>
          </div>

          {/* Alberta admin */}
          <div className="card mb-2">
            <div className="card-header">Alberta Ferndandes Admin</div>
            <div className="card-body row col-md d-flex align-items-center">
              <div className="col-12 col-lg-2">
                <img
                  className="img-fluid img-thumbnail rounded-circle d-flex justify-content-center"
                  src="https://pbs.twimg.com/profile_images/938813312506064896/ciY68hiP_400x400.jpg"
                  alt="card image"
                />
              </div>
              <div className="col-12 col-lg-8 mb-2 mb-lg-0">
                <p className="card-text">
                  <strong>Email:</strong> alberta.fcup55@fe.up.pt
                </p>
                <p className="card-text">
                  <strong>Institution/College:</strong> Faculty of Medicine of
                  University of Porto
                </p>
                <p className="card-text">
                  <strong>Profession/Course:</strong> Urology
                </p>
              </div>
              <div className="col-12 col-lg-2 justify-content-lg-center">
                <div className="row mb-3">
                  <button className="btn btn-danger btn-block">Ban</button>
                </div>
                <div className="row">
                  <button className="btn btn-primary btn-block">
                    Expel admin
                  </button>
                </div>
              </div>
            </div>
          </div>
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
