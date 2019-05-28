import classNames from 'classnames';
import React, { PureComponent } from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Avatar } from '../components';
import styles from '../styles/Conference.module.css';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

export type Props = {
  user: any;
};

export type State = {
  conferences: any[];
  error: string;
  orderBy: 'title' | 'start' | 'end';
  orderDirection: 'ASC' | 'DESC';
  orderTitle?: string;
};

class Conferences extends PureComponent<Props, State> {
  public static contextType = LanguageContext;
  private readonly dateOptions: object;

  constructor(props: Props) {
    super(props);

    this.state = {
      conferences: [],
      error: '',
      orderBy: 'title',
      orderDirection: 'ASC',
      orderTitle: undefined
    };

    this.dateOptions = {
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      month: 'long',
      year: 'numeric'
    };
  }

  public componentDidMount(): void {
    this.getConferences();
  }

  public render() {
    return (
      <div className={'container-fluid w-100'}>
        <div className={'d-flex flex-row flex-wrap'}>
          <div className={'col-lg-3'}>{this.renderNavbar()}</div>
          <div className={'col-lg-9'}>
            {this.state.conferences.length > 0 && this.state.error === ''
              ? this.renderConferences()
              : this.renderAlert()}
          </div>
        </div>
      </div>
    );
  }

  private getConferences = () => {
    axiosInstance
      .get('/conference/', {
        params: {
          user: this.props.user.id
        }
      })
      .then(res => {
        this.setState({
          conferences: res.data.conferences,
          error: '',
          orderBy: 'title',
          orderDirection: 'ASC',
          orderTitle: dictionary.title[this.context]
        });
      })
      .catch(error => {
        this.setState({
          error: error.message
        });
      });
  };

  private renderNavbar = () => {
    const handleClick = value => {
      const compare = (a, b, parameter) => {
        if (a[parameter] < b[parameter]) {
          return this.state.orderDirection === 'ASC' ? -1 : 1;
        }
        if (a[parameter] > b[parameter]) {
          return this.state.orderDirection === 'ASC' ? 1 : -1;
        }
        return 0;
      };
      if (this.state.orderBy === value) {
        this.setState({
          orderDirection: this.state.orderDirection === 'ASC' ? 'DESC' : 'ASC'
        });
      } else {
        this.setState({
          orderBy: value,
          orderDirection: 'ASC'
        });
      }

      if (this.state.orderBy === 'title') {
        this.setState({
          conferences: this.state.conferences.sort((a, b) =>
            compare(a, b, 'title')
          )
        });
      } else if (this.state.orderBy === 'start') {
        this.setState({
          conferences: this.state.conferences.sort((a, b) =>
            compare(a, b, 'datestart')
          )
        });
      } else if (this.state.orderBy === 'end') {
        this.setState({
          conferences: this.state.conferences.sort((a, b) =>
            compare(a, b, 'dateend')
          )
        });
      }
    };
    const className = classNames('m-3', styles.header);

    return (
      <>
        <Card className={className}>
          <Card.Header className={styles.header}>
            <Card.Title>{dictionary.conferences[this.context]}</Card.Title>
          </Card.Header>
          <Card.Body className={'d-flex flex-column justify-content-start'}>
            <Card.Title className={'mb-2'}>
              {dictionary.orderBy[this.context]}
            </Card.Title>
            <Card.Link
              href={'#'}
              className={'text-dark ml-0'}
              onClick={() => handleClick('title')}
            >
              {dictionary.title[this.context]}
              {this.state.orderBy === 'title' ? (
                this.state.orderDirection === 'ASC' ? (
                  <i className={'fa fa-sort-down ml-2'} />
                ) : (
                  <i className={'fa fa-sort-up ml-2'} />
                )
              ) : null}
            </Card.Link>
            <Card.Link
              href={'#'}
              className={'text-dark ml-0'}
              onClick={() => handleClick('start')}
            >
              {dictionary.starting_date[this.context]}
              {this.state.orderBy === 'start' ? (
                this.state.orderDirection === 'ASC' ? (
                  <i className={'fa fa-sort-down ml-2'} />
                ) : (
                  <i className={'fa fa-sort-up ml-2'} />
                )
              ) : null}
            </Card.Link>
            <Card.Link
              href={'#'}
              className={'text-dark ml-0'}
              onClick={() => handleClick('end')}
            >
              {dictionary.ending_date[this.context]}
              {this.state.orderBy === 'end' ? (
                this.state.orderDirection === 'ASC' ? (
                  <i className={'fa fa-sort-down ml-2'} />
                ) : (
                  <i className={'fa fa-sort-up ml-2'} />
                )
              ) : null}
            </Card.Link>
          </Card.Body>
        </Card>
      </>
    );
  };

  private renderConferences = () => {
    return (
      <CardGroup className={'mt-3'}>
        {this.state.conferences.map(conference => {
          const dateStart = new Date(conference.datestart).toLocaleDateString(
            dictionary.date_format[this.context],
            this.dateOptions
          );
          const dateEnd = new Date(conference.dateend).toLocaleDateString(
            dictionary.date_format[this.context],
            this.dateOptions
          );
          const className = classNames(
            'd-flex flex-row align-items-center',
            styles.header
          );

          return (
            <a
              href={`conference/${conference.id}`}
              key={conference.id}
              style={{ textDecoration: 'none' }}
              className={'text-dark mb-4 col-lg-12'}
            >
              <Card className={styles.border}>
                <Card.Header className={className}>
                  <Avatar
                    image={conference.avatar}
                    title={conference.title}
                    className={'mr-2'}
                  />
                  <Card.Title className={'mb-0'}>{conference.title}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    {conference.about.substring(0, 100)}
                    {conference.about.length > 100 ? '...' : null}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  {dictionary.date_start[this.context]}: {dateStart}
                  <br />
                  {dictionary.date_end[this.context]}: {dateEnd}
                </Card.Footer>
              </Card>
            </a>
          );
        })}
      </CardGroup>
    );
  };

  private renderAlert = () => {
    if (this.state.error) {
      return (
        <Alert variant={'danger'} className={'m-3'}>
          {this.state.error}
        </Alert>
      );
    }

    return (
      <Alert variant={'warning'} className={'m-3'}>
        There are no conferences to display
      </Alert>
    );
  };
}

export default withAuth(Conferences);
