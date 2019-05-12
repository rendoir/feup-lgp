import React, { Component } from "react";
import Cookies from "universal-cookie";

import "../styles/Notifications.css";

// - Import utils
import InviteNotification from "../components/InviteNotification/InviteNotification";
import { apiGetNotifications } from "../utils/apiInvite";
import { dictionary, LanguageContext } from "../utils/language";

interface IState {
  fetchingNotifications: boolean;
  notifications: any[];
}

const cookies = new Cookies();

class Notifications extends Component<{}, IState> {
  public static contextType = LanguageContext;

  constructor(props: any) {
    super(props);
    this.state = {
      fetchingNotifications: true,
      notifications: []
    };
  }

  public componentDidMount() {
    this.apiGetNotifs();
  }

  public async apiGetNotifs() {
    const notifications = await apiGetNotifications();

    this.setState({
      fetchingNotifications: false,
      notifications
    });
  }

  public getNotifications() {
    if (this.state.fetchingNotifications) {
      return null;
    } else if (!this.state.notifications) {
      return <div>{dictionary.error_notifications[this.context]}</div>;
    } else if (this.state.notifications.length === 0) {
      return <div>{dictionary.no_notifications[this.context]}</div>;
    }

    const notificationList = this.state.notifications.map(notif => {
      return (
        <InviteNotification
          key={notif.id}
          id={notif.id}
          subjectId={notif.invite_subject_id}
          subjectType={notif.invite_type}
          subjectTitle={notif.title}
        />
      );
    });

    return notificationList;
  }
  public render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-primary">
            <div className="panel-body">
              <div className="panel-title">
                <h3>{dictionary.notifications[this.context]}</h3>
              </div>
              <ul className="list-group">{this.getNotifications()}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Notifications;
