import * as React from 'react';

import AddAdminModal from '../components/AdminFunctionsModal/AddAdminModal';
import BanUserModal from '../components/AdminFunctionsModal/BanUserModal';
import RemoveAdminModal from '../components/AdminFunctionsModal/RemoveAdminModal';
import UnbanUserModal from '../components/AdminFunctionsModal/UnbanUserModal';
import { BackofficeNotification } from '../components/BackofficeNotification/BackofficeNotification';
import { ProductExchangeNotification } from '../components/BackofficeNotification/ProductExchangeNotification';
import { BackofficeUserCard } from '../components/BackofficeUserCard/BackofficeUserCard';

import { apiGetReportNotificationsInfo } from '../utils/apiReport';
import AuthHelperMethods from '../utils/AuthHelperMethods';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

type BackofficeState = {
  fetchingNotifications: boolean;
  notifications: any[];
  notificationsAmount: number;
  fetchingProductExchangeNotifications: boolean;
  productExchangeNotifications: any[];
  addAdminSuccess: boolean;
  banUserSuccess: boolean;
  removeAdminSuccess: boolean;
  search: string;
  showBanUserAlert: boolean;
  showExpelAdminAlert: boolean;
  showTurnAdminAlert: boolean;
  showUnbanUserAlert: boolean;
  unbanUserSuccess: boolean;
  usersAreaActive: boolean;
  notifAreaActive: boolean;
  shopAreaActive: boolean;
  usersSearchResult: any[];
  usersTypeSearch: string;
};

class Backoffice extends React.Component<{}, BackofficeState> {
  public static contextType = LanguageContext;

  constructor(props: any) {
    super(props);

    this.state = {
      addAdminSuccess: false,
      banUserSuccess: false,
      fetchingNotifications: true,
      fetchingProductExchangeNotifications: true,
      notifAreaActive: true,
      notifications: [],
      notificationsAmount: 0,
      productExchangeNotifications: [],
      removeAdminSuccess: false,
      search: '',
      shopAreaActive: false,
      showBanUserAlert: false,
      showExpelAdminAlert: false,
      showTurnAdminAlert: false,
      showUnbanUserAlert: false,
      unbanUserSuccess: false,
      usersAreaActive: false,
      usersSearchResult: [],
      usersTypeSearch: 'all'
    };

    // Admin menu handlers
    this.handleUsersArea = this.handleUsersArea.bind(this);
    this.handleNotifArea = this.handleNotifArea.bind(this);
    this.handleShopArea = this.handleShopArea.bind(this);
    this.onAddAdminResponse = this.onAddAdminResponse.bind(this);
    this.onBanUserResponse = this.onBanUserResponse.bind(this);
    this.onRemoveAdminResponse = this.onRemoveAdminResponse.bind(this);
    this.onUnbanUserResponse = this.onUnbanUserResponse.bind(this);
    // User card button handlers
    this.handleUserCardBan = this.handleUserCardBan.bind(this);
    this.handleUserCardUnban = this.handleUserCardUnban.bind(this);
    this.handleUserCardTurnAdmin = this.handleUserCardTurnAdmin.bind(this);
    this.handleUserCardExpelAdmin = this.handleUserCardExpelAdmin.bind(this);
    // Search users button handlers
    this.submitUserSearch = this.submitUserSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSetAll = this.handleSetAll.bind(this);
    this.handleSetAdmin = this.handleSetAdmin.bind(this);
    this.handleSetUser = this.handleSetUser.bind(this);
  }

  public componentDidMount() {
    this.apiSubmitSearch();
    this.apiGetProductExchangeNotifications();
    this.apiGetNotifications();
  }

  public render() {
    return (
      <div id="backoffice_container" className="container mt-3 ml-0">
        {this.getTurnAdminAlert()}
        {this.getBanUserAlert()}
        {this.getExpelAdminAlert()}
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
                {dictionary.notifications[this.context]}{' '}
                <span className="badge badge-light">
                  {this.state.notificationsAmount}
                </span>
              </a>
              <a
                id="manage_shop"
                className="dropdown-item"
                onClick={this.handleShopArea}
              >
                {dictionary.manage_products[this.context]}
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
                id="remove_admin"
                className="dropdown-item"
                data-toggle="modal"
                data-target="#remove_admin_modal"
              >
                {dictionary.expel_admin[this.context]}
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
          {this.state.notifAreaActive && this.getNotifications()}
          {this.state.shopAreaActive && this.getShopBuyers()}
          {this.getAddAdminModal()}
          {this.getBanUserModal()}
          {this.getRemoveAdminModal()}
          {this.getUnbanUserModal()}
        </div>
      </div>
    );
  }

  private apiGetProductExchangeNotifications() {
    const url = `admin/product_exchange_notifications`;
    axiosInstance
      .get(url)
      .then(result => {
        this.setState({
          fetchingProductExchangeNotifications: false,
          productExchangeNotifications: result.data
        });
      })
      .catch(error => console.log(error));
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
      notifAreaActive: false,
      shopAreaActive: false,
      usersAreaActive: true
    });
  }

  private handleNotifArea() {
    this.setState({
      notifAreaActive: true,
      shopAreaActive: false,
      usersAreaActive: false
    });
  }

  private handleShopArea() {
    this.setState({
      notifAreaActive: false,
      shopAreaActive: true,
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

  private handleUserCardExpelAdmin(email: string) {
    RemoveAdminModal.OnExpelAdmin(email, this.onRemoveAdminResponse);
  }

  private getAddAdminModal() {
    return <AddAdminModal onResponse={this.onAddAdminResponse} />;
  }

  private getRemoveAdminModal() {
    return <RemoveAdminModal onResponse={this.onRemoveAdminResponse} />;
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
    setTimeout('window.location.reload()', 2000);
  }

  private onRemoveAdminResponse(success: boolean) {
    this.setState({
      removeAdminSuccess: success,
      showExpelAdminAlert: true
    });
    setTimeout('window.location.reload()', 2000);
  }

  private onBanUserResponse(success: boolean) {
    this.setState({
      banUserSuccess: success,
      showBanUserAlert: true
    });
    setTimeout('window.location.reload()', 2000);
  }

  private onUnbanUserResponse(success: boolean) {
    this.setState({
      showUnbanUserAlert: true,
      unbanUserSuccess: success
    });
    setTimeout('window.location.reload()', 2000);
  }

  private getTurnAdminAlert() {
    const alertMessage = this.state.addAdminSuccess
      ? dictionary.success_add_admin[this.context]
      : dictionary.error_add_admin[this.context];
    const alertType = this.state.addAdminSuccess
      ? 'alert-success'
      : 'alert-danger';

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

  private getExpelAdminAlert() {
    const alertMessage = this.state.removeAdminSuccess
      ? dictionary.success_remove_admin[this.context]
      : dictionary.error_remove_admin[this.context];
    const alertType = this.state.removeAdminSuccess
      ? 'alert-success'
      : 'alert-danger';

    if (!this.state.showExpelAdminAlert) {
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
          onClick={() => this.setState({ showExpelAdminAlert: false })}
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
      ? 'alert-success'
      : 'alert-danger';

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
      ? 'alert-success'
      : 'alert-danger';

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
              <a
                className="dropdown-item"
                type="buttton"
                onClick={this.handleSetAll}
              >
                {dictionary.all_users[this.context]}
              </a>
              <a
                className="dropdown-item"
                type="buttton"
                onClick={this.handleSetAdmin}
              >
                {dictionary.administrators[this.context]}
              </a>
              <a
                className="dropdown-item"
                type="buttton"
                onClick={this.handleSetUser}
              >
                {dictionary.banned_users[this.context]}
              </a>
            </div>
          </div>
          <form
            className="form-inline w-75 row col-sm-9 my-2 my-lg-0"
            onSubmit={this.submitUserSearch}
          >
            <input
              id="search-user-input"
              className="form-control mr-1"
              type="text"
              name="search"
              onChange={this.handleInputChange}
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
        {this.getUsersList()}
      </div>
    );
  }

  private handleSetAll(e) {
    e.preventDefault();
    this.setState({ usersTypeSearch: 'all' });
  }

  private handleSetAdmin(e) {
    e.preventDefault();
    this.setState({ usersTypeSearch: 'admin' });
  }

  private handleSetUser(e) {
    e.preventDefault();
    this.setState({ usersTypeSearch: 'banned' });
  }

  private getUsersList() {
    const users: any[] = [];

    for (const user of this.state.usersSearchResult) {
      console.log(new AuthHelperMethods().getUserPayload().id);
      if (new AuthHelperMethods().getUserPayload().id !== user.id) {
        if (this.state.usersTypeSearch === 'all') {
          users.push(
            console.log(user.email + ' ' + user.permissions),
            <BackofficeUserCard
              key={'user_search_result_' + user.id}
              name={user.first_name + ' ' + user.last_name}
              image="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
              email={user.email}
              institution={user.work}
              userType={user.permissions}
              profession={user.work_field}
              banHandler={this.handleUserCardBan}
              unbanHandler={this.handleUserCardUnban}
              turnAdminHandler={this.handleUserCardTurnAdmin}
              expelAdminHandler={this.handleUserCardExpelAdmin}
            />
          );
        } else if (
          this.state.usersTypeSearch === 'admin' &&
          user.permissions === 'admin'
        ) {
          users.push(
            <BackofficeUserCard
              key={'user_search_result_' + user.id}
              name={user.first_name + ' ' + user.last_name}
              image="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
              email={user.email}
              institution={user.work}
              userType={user.permissions}
              profession={user.work_field}
              banHandler={this.handleUserCardBan}
              unbanHandler={this.handleUserCardUnban}
              turnAdminHandler={this.handleUserCardTurnAdmin}
              expelAdminHandler={this.handleUserCardExpelAdmin}
            />
          );
        } else if (
          this.state.usersTypeSearch === 'banned' &&
          user.permissions === 'banned'
        ) {
          users.push(
            <BackofficeUserCard
              key={'user_search_result_' + user.id}
              name={user.first_name + ' ' + user.last_name}
              image="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
              email={user.email}
              institution={user.work}
              userType={user.permissions}
              profession={user.work_field}
              banHandler={this.handleUserCardBan}
              unbanHandler={this.handleUserCardUnban}
              turnAdminHandler={this.handleUserCardTurnAdmin}
              expelAdminHandler={this.handleUserCardExpelAdmin}
            />
          );
        }
      }
    }

    return <div className="col">{users}</div>;
  }

  private getShopBuyers() {
    return (
      <div
        id="backoffice_notifications_area"
        className="col-12 col-md-9 mt-2 mt-md-0"
      >
        {this.getProductExchangeNotifications()}
      </div>
    );
  }

  private getNotifications() {
    return (
      <div
        id="backoffice_notifications_area"
        className="col-12 col-md-9 mt-2 mt-md-0"
      >
        {this.getReportNotifications()}
      </div>
    );
  }

  private getReportNotifications() {
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
          reportedUserEmail={notif.reported_user_email}
          reporterUserFirstName={notif.reported_user_first_name}
          reporterUserLastName={notif.reported_user_last_name}
          reportsAmount={notif.reports_amount}
        />
      );
    });

    return notificationList;
  }

  private getProductExchangeNotifications() {
    if (
      this.state.fetchingProductExchangeNotifications ||
      !this.state.productExchangeNotifications ||
      this.state.productExchangeNotifications.length === 0
    ) {
      return null;
    }

    const productExchangeNotificationList = this.state.productExchangeNotifications.map(
      exchangeNotif => {
        return (
          <ProductExchangeNotification
            key={exchangeNotif.exchange_id}
            exchangeId={exchangeNotif.exchange_id}
            productId={exchangeNotif.product_id}
            productName={exchangeNotif.product_name}
            buyerId={exchangeNotif.buyer_id}
            buyerFirstName={exchangeNotif.buyer_first_name}
            buyerLastName={exchangeNotif.buyer_last_name}
          />
        );
      }
    );

    return productExchangeNotificationList;
  }

  private handleInputChange(event: any) {
    const field = event.target.name;
    const value = !event.target.value.replace(/\s/g, '').length
      ? ''
      : event.target.value; // Ignore input only containing white spaces

    const partialState: any = {};
    partialState[field] = value;
    this.setState(partialState);
  }

  private submitUserSearch(event: any) {
    event.preventDefault();
    this.apiSubmitSearch();
  }

  private apiSubmitSearch() {
    axiosInstance
      .get('/search', {
        params: {
          df: [],
          di: [],
          k: '["' + this.state.search.split(' ') + '"]',
          t: '3',
          tags: []
        }
      })
      .then(res => {
        const r = res.data;
        this.setState({
          usersSearchResult: r.users
        });
      });
  }
}

export default withAuth(Backoffice, true);
