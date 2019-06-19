import React from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { dictionary, LanguageContext } from '../../utils/language';

import Avatar from '../Avatar/Avatar';

type BackofficeUserCardProps = {
  id?: number;
  name: string;
  avatar?: string;
  avatar_mimeType?: string;
  email: string;
  institution: string;
  profession: string;
  userType?: string; // This parameter can be ommited if it's a regular user
  banHandler?: any; // Regular and admin users require this handler
  unbanHandler?: any; // Banned users require this handler
  turnAdminHandler?: any; // Regular users require this handler
  expelAdminHandler?: any; // Admin users require this handler
};

type BackofficeUserCardState = {
  avatar: string;
};

export class BackofficeUserCard extends React.Component<
  BackofficeUserCardProps,
  BackofficeUserCardState
> {
  public static contextType = LanguageContext;

  public static readonly BANNED_USER = 'banned';
  public static readonly ADMIN_USER = 'admin';

  constructor(props: any) {
    super(props);

    this.state = {
      avatar: ''
    };

    this.turnAdminHandler = this.turnAdminHandler.bind(this);
    this.expelAdminHandler = this.expelAdminHandler.bind(this);
    this.banUserHandler = this.banUserHandler.bind(this);
    this.unbanUserHandler = this.unbanUserHandler.bind(this);
  }

  public componentDidMount() {
    this.updateAvatarSrc();
  }

  public render() {
    return (
      <div className="card mb-2">
        <div className="card-header">{this.props.name}</div>
        <div className="card-body row col-md d-flex align-items-center pr-lg-2 pr-xl-4">
          <div className="col-12 col-lg-2 d-flex justify-content-center">
            <Avatar
              title={this.props.name}
              placeholder="empty"
              size={80}
              image={this.state.avatar}
            />
          </div>
          <div className="col-12 col-lg-8 mb-2 mb-lg-0">
            <p className="card-text">
              <strong>E-mail:</strong> {this.props.email}
            </p>
            <p className="card-text">
              <strong>{dictionary.workplace_institution[this.context]}:</strong>{' '}
              {this.props.institution}
            </p>
            <p className="card-text">
              <strong>{dictionary.profession_field[this.context]}:</strong>{' '}
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
        onClick={this.banUserHandler}
      >
        {dictionary.ban_action[this.context]}
      </button>
    );
    const unbanButton = (
      <button
        className="btn btn-primary btn-block"
        onClick={this.unbanUserHandler}
      >
        {dictionary.unban_action[this.context]}
      </button>
    );
    const turnAdminButton = (
      <button
        className="btn btn-info btn-block"
        onClick={this.turnAdminHandler}
      >
        {dictionary.turn_admin[this.context]}
      </button>
    );
    const expelAdminButton = (
      <button
        className="btn btn-primary btn-block"
        onClick={this.expelAdminHandler}
      >
        {dictionary.expel_admin[this.context]}
      </button>
    );

    let userTypeButton1;
    let userTypeButton2;

    switch (this.props.userType) {
      case BackofficeUserCard.BANNED_USER:
        userTypeButton1 = unbanButton;
        break;

      case BackofficeUserCard.ADMIN_USER:
        userTypeButton1 = banButton;
        userTypeButton2 = expelAdminButton;
        break;

      default:
        userTypeButton1 = banButton;
        userTypeButton2 = turnAdminButton;
        break;
    }

    return (
      <div className="col-12 col-lg-2 justify-content-lg-center ml-3 ml-lg-0">
        {this.props.userType !== BackofficeUserCard.BANNED_USER && (
          <div className="row mb-3">{userTypeButton2}</div>
        )}
        <div className="row">{userTypeButton1}</div>
      </div>
    );
  }

  private turnAdminHandler() {
    if (this.props.turnAdminHandler) {
      this.props.turnAdminHandler(this.props.email);
    }
  }

  private expelAdminHandler() {
    if (this.props.expelAdminHandler) {
      this.props.expelAdminHandler(this.props.email);
    }
  }

  private banUserHandler() {
    if (this.props.banHandler) {
      this.props.banHandler(this.props.email);
    }
  }

  private unbanUserHandler() {
    if (this.props.unbanHandler) {
      this.props.unbanHandler(this.props.email);
    }
  }

  private updateAvatarSrc() {
    if (this.props.avatar === undefined || this.props.avatar === null) {
      return;
    }

    axiosInstance
      .get(`/users/${this.props.id}/avatar/${this.props.avatar}`, {
        responseType: 'arraybuffer'
      })
      .then(res => {
        const src =
          'data:' +
          this.props.avatar_mimeType +
          ';base64, ' +
          new Buffer(res.data, 'binary').toString('base64');

        this.setState({ avatar: src });
        this.forceUpdate();
      });
  }
}
