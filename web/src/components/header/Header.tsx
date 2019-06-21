import {
  faBell,
  faClinicMedical,
  faExclamationCircle,
  faPlus,
  faUserMd,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import React, { MouseEvent, PureComponent } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { RouteComponentProps, withRouter } from 'react-router';

import AuthHelperMethods from '../../utils/AuthHelperMethods';
import axiosInstance from '../../utils/axiosInstance';
import { dictionary, LanguageContext } from '../../utils/language';
import CreateNewModal from '../CreateNewModal/CreateNewModal';
import { Request, Step } from '../CreateNewModal/types';
import Icon from '../Icon/Icon';
import SearchSimpleForm from '../SearchSimpleForm/SearchSimpleForm';
import Select from '../Select/Select';
import styles from './Header.module.css';

import { apiGetNotificationsAmount } from '../../utils/apiInvite';
import { apiGetReportNotificationsAmount } from '../../utils/apiReport';
import { getApiURL } from '../../utils/apiURL';

type Props = {
  title: string;
  onSearchClick?: (text: string, event: MouseEvent) => any;
  onProfileClick?: (event: MouseEvent) => any;
  onLanguageChange: (lang: string) => any;
};

type State = {
  search: string;
  isOpen: boolean;
  step: Step;
  request: Request;
  userFirstName;
  adminNotifications: number;
  userNotifications: number;
};

class Header extends PureComponent<RouteComponentProps<{}> & Props, State> {
  public static contextType = LanguageContext;
  private auth = new AuthHelperMethods();
  private tags: string[];

  constructor(props) {
    super(props);

    this.state = {
      adminNotifications: 0,
      isOpen: false,
      request: {
        avatar: undefined,
        dateEnd: '',
        dateStart: '',
        description: '',
        files: {
          docs: [],
          images: [],
          videos: []
        },
        local: '',
        tags: [],
        title: '',
        type: 'post',
        visibility: 'public'
      },
      search: '',
      step: 'type',
      userFirstName: 'User',
      userNotifications: 0
    };

    this.tags = [];
  }

  public componentDidMount(): void {
    if (this.auth.loggedIn()) {
      this.apiGetUserName();
      this.getPossibleTags();
      this.getUserNotificationAmount();
      this.getAdminNotificationAmount();
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        <Navbar
          collapseOnSelect={true}
          className={styles.wrapper}
          expand={'lg'}
          variant={'dark'}
        >
          {this.renderBrand()}
          <Navbar.Toggle aria-controls={'navbar-nav'} />
          <Navbar.Collapse id={'navbar-nav'}>
            {this.auth.loggedIn() && this.renderLinks()}
            {this.auth.loggedIn() && <SearchSimpleForm />}
            {this.renderLanguageSelector()}
            {this.auth.loggedIn() && this.renderButtons()}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }

  private renderLanguageSelector() {
    return (
      <div className={styles.language_wrapper + ' my-auto'}>
        <Select
          className="my-auto"
          id="language_selector"
          value={this.context}
          options={[
            { value: 'EN', title: 'English' },
            { value: 'PT', title: 'Português' }
          ]}
          onChange={this.props.onLanguageChange}
        />
      </div>
    );
  }

  private renderBrand() {
    const { title } = this.props;

    return (
      <Navbar.Brand href={'/'} className={styles.logo}>
        <Icon icon={faClinicMedical} size={'lg'} className={styles.icon} />
        {title}
      </Navbar.Brand>
    );
  }

  private renderLinks() {
    return (
      <Nav className={'mr-auto'}>
        <Nav.Link href={'/conferences'} className={styles.link}>
          {dictionary.conferences[this.context]}
        </Nav.Link>
        <Nav.Link href={'/shop'} className={styles.link}>
          {dictionary.shop[this.context]}
        </Nav.Link>
      </Nav>
    );
  }

  private apiGetUserName() {
    const userID = this.auth.getUserPayload().id;
    axiosInstance
      .get(`/users/${userID}`)
      .then(res => {
        this.setState({
          userFirstName: res.data.user.first_name
        });
      })
      .catch(() => console.log('Failed to get user'));
  }

  private getNotificationIcon(type: string = 'user') {
    const href = type === 'admin' ? '/admin' : '/notifications';
    const icon = type === 'admin' ? faExclamationCircle : faBell;
    const notifsAmount =
      type === 'admin'
        ? this.state.adminNotifications
        : this.state.userNotifications;
    return (
      <Nav.Link href={href} className={styles.link}>
        <Icon
          icon={icon}
          size={'lg'}
          inverse={true}
          theme={'primary'}
          className={'mr-1'}
        />
        {notifsAmount > 0 && (
          <span className="badge badge-light">{notifsAmount}</span>
        )}
      </Nav.Link>
    );
  }

  private renderButtons() {
    return (
      <Nav>
        {this.auth.isAdmin() && this.getNotificationIcon('admin')}
        {this.getNotificationIcon('user')}
        <Nav.Link href={'#'} onClick={this.handleClick} className={styles.link}>
          <Icon
            icon={faPlus}
            size={'lg'}
            inverse={true}
            theme={'primary'}
            className={'mr-1'}
          />
          {dictionary.new[this.context]}
        </Nav.Link>
        <NavDropdown
          alignRight={true}
          title={
            <div style={{ display: 'inline-block' }} className={styles.link}>
              <Icon icon={faUserMd} size={'lg'} className={styles.icon} />{' '}
              {this.state.userFirstName}
            </div>
          }
          id="header_user_dropdown"
        >
          <NavDropdown.Item href={`/user/${this.auth.getUserPayload().id}`}>
            {dictionary.profile[this.context]}
          </NavDropdown.Item>
          <NavDropdown.Item href={`/invite`}>
            {dictionary.invite_users[this.context]}
          </NavDropdown.Item>
          {this.renderAdminDropdown()}
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={this.onClickLogout}>
            {dictionary.logout[this.context]}
          </NavDropdown.Item>
        </NavDropdown>
        {this.state.isOpen ? (
          <CreateNewModal
            onChange={request => this.setState({ request })}
            onClose={this.resetState}
            onStepChange={step => this.setState({ step })}
            onSubmit={this.handleSubmit}
            request={this.state.request}
            show={this.state.isOpen}
            step={this.state.step}
            tags={this.tags}
          />
        ) : null}
      </Nav>
    );
  }

  private renderAdminDropdown() {
    let isAdmin = false;

    axiosInstance
      .get(getApiURL(`/admin/${this.auth.getUserPayload().id}`))
      .then(res => {
        isAdmin = res.data;
        if (isAdmin) {
          return (
            <div>
              <NavDropdown.Item href="/admin">
                {dictionary.admin_area[this.context]}
              </NavDropdown.Item>
            </div>
          );
        }
      })
      .catch(error => console.log('Failed to check if isAdmin. ' + error));
  }

  private onClickLogout = (event: any) => {
    this.auth.logout();

    window.location.href = '/';
  };

  private handleClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.setState({ isOpen: true });
  };

  private handleSubmit = (request: Request) => {
    if (request.type === 'post') {
      const formData = new FormData();
      if (request.files) {
        request.files.images.forEach((file, idx) =>
          formData.append('images[' + idx + ']', file)
        );
        request.files.videos.forEach((file, idx) =>
          formData.append('videos[' + idx + ']', file)
        );
        request.files.docs.forEach((file, idx) =>
          formData.append('docs[' + idx + ']', file)
        );
      }

      if (request.tags) {
        request.tags.forEach((tag, i) =>
          formData.append('tags[' + i + ']', tag)
        );
      }

      formData.append('text', request.description);
      formData.append('title', request.title);
      formData.append('visibility', request.visibility);

      axiosInstance
        .post('/post', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          console.log('Post created - reloading page...');
          window.location.href = '/post/' + res.data.id;
          this.resetState();
        })
        .catch(() => console.log('Failed to create post'));
    } else {
      const formData = new FormData();

      formData.append('about', request.description.trim());
      formData.append('title', request.title.trim());
      formData.append('privacy', request.visibility.trim());

      if (request.local === undefined) {
        request.local = '';
      }
      formData.append('local', request.local.trim());

      if (request.dateStart === undefined) {
        request.dateStart = '';
      }
      formData.append('dateStart', request.dateStart.trim());

      if (request.dateEnd === undefined) {
        request.dateEnd = '';
      }
      formData.append('dateEnd', request.dateEnd.trim());

      if (request.avatar !== undefined) {
        formData.append('avatar', request.avatar);
      }

      axiosInstance
        .post('/conference', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          console.log(`conference with id = ${res.data.id} created`);
          window.location.href = '/conference/' + res.data.id;
          this.resetState();
        })
        .catch(error => console.log('Failed to create conference. ' + error));
    }
  };

  private getPossibleTags = (): void => {
    axiosInstance
      .get('/tags')
      .then(res => {
        res.data.forEach(tag => {
          this.tags.push(tag.name);
        });
      })
      .catch(() => console.log('Failed to get tags'));
  };

  private async getUserNotificationAmount() {
    const userNotifications = await apiGetNotificationsAmount();
    this.setState({ userNotifications });
  }

  private async getAdminNotificationAmount() {
    if (this.auth.isAdmin()) {
      const adminNotifications = await apiGetReportNotificationsAmount();
      this.setState({ adminNotifications });
    }
  }

  private resetState = () => {
    this.setState({
      isOpen: false,
      request: {
        avatar: undefined,
        dateEnd: '',
        dateStart: '',
        description: '',
        files: {
          docs: [],
          images: [],
          videos: []
        },
        local: '',
        tags: [],
        title: '',
        type: 'post',
        visibility: 'public'
      },
      search: '',
      step: 'type'
    });
  };
}

export default withRouter(Header);
