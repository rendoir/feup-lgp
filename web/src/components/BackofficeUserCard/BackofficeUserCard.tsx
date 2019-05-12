import React from "react";
import { dictionary, LanguageContext } from "../../utils/language";

type BackofficeUserCardProps = {
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
};

export class BackofficeUserCard extends React.Component<
  BackofficeUserCardProps,
  {}
> {
  public static contextType = LanguageContext;

  public static readonly BANNED_USER = "banned";
  public static readonly ADMIN_USER = "admin";

  constructor(props: any) {
    super(props);
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
              <strong>E-mail:</strong> {this.props.email}
            </p>
            <p className="card-text">
              <strong>{dictionary.workplace_institution[this.context]}:</strong>{" "}
              {this.props.institution}
            </p>
            <p className="card-text">
              <strong>{dictionary.profession_field[this.context]}:</strong>{" "}
              {this.props.profession}
            </p>
          </div>
          {this.getButtons()}
        </div>
      </div>
    );
  }

  private getButtons() {
    const banButton = (
      <button
        className="btn btn-danger btn-block"
        onClick={this.props.banHandler}
      >
        {dictionary.ban_action[this.context]}
      </button>
    );
    const unbanButton = (
      <button
        className="btn btn-primary btn-block"
        onClick={this.props.unbanHandler}
      >
        {dictionary.unban_action[this.context]}
      </button>
    );
    const turnAdminButton = (
      <button
        className="btn btn-info btn-block"
        onClick={this.props.turnAdminHandler}
      >
        {dictionary.turn_admin[this.context]}
      </button>
    );
    const expelAdminButton = (
      <button
        className="btn btn-primary btn-block"
        onClick={this.props.expelAdminHandler}
      >
        {dictionary.expel_admin[this.context]}
      </button>
    );

    let userTypeButton;
    switch (this.props.userType) {
      case BackofficeUserCard.BANNED_USER:
        userTypeButton = unbanButton;
        break;

      case BackofficeUserCard.ADMIN_USER:
        userTypeButton = expelAdminButton;
        break;

      default:
        userTypeButton = turnAdminButton;
        break;
    }

    return (
      <div className="col-12 col-lg-2 justify-content-lg-center ml-3 ml-lg-0">
        {this.props.userType !== BackofficeUserCard.BANNED_USER && (
          <div className="row mb-3">{banButton}</div>
        )}
        <div className="row">{userTypeButton}</div>
      </div>
    );
  }
}
