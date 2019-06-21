import * as React from 'react';
import Spinner from 'react-bootstrap/Spinner';

import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import Icon from '../components/Icon/Icon';
import Post from '../components/Post/Post';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

import styles from '../components/InfiniteScroll/InfiniteScroll.module.css';

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

interface IState {
  author: string;
  avatar?: string;
  avatar_mimetype?: string;
  comments: any[];
  content: string;
  date: string;
  date_updated: string | null;
  fetchingInfo: boolean;
  files: any[];
  id: number;
  tags: any[];
  title: string;
  user_id: number;
  visibility: string;
}

class PostView extends React.Component<IProps, IState> {
  public static contextType = LanguageContext;
  private readonly id: number;
  private readonly dateOptions: object;

  constructor(props: IProps) {
    super(props);

    this.id = this.props.match.params.id;
    this.dateOptions = {
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    this.state = {
      author: '',
      avatar: '',
      avatar_mimetype: '',
      comments: [],
      content: '',
      date: '',
      date_updated: null,
      fetchingInfo: true,
      files: [],
      id: -1,
      tags: [],
      title: '',
      user_id: -1,
      visibility: ''
    };
  }

  public componentDidMount() {
    this.apiGetPost();
  }

  public apiGetPost() {
    axiosInstance
      .get(`/post/${this.id}`)
      .then(res => {
        this.setState({
          ...res.data.post,
          comments: res.data.comments,
          fetchingInfo: false,
          files: res.data.files,
          tags: res.data.tags
        });
      })
      .catch(error => console.log(error.response.data.message));
  }

  public render() {
    let date = '';
    if (this.state.date_updated != null) {
      date = new Date(this.state.date_updated).toLocaleDateString(
        dictionary.date_format[this.context],
        this.dateOptions
      );
    } else {
      date = new Date(this.state.date).toLocaleDateString(
        dictionary.date_format[this.context],
        this.dateOptions
      );
    }

    if (!this.state.fetchingInfo) {
      return (
        <div className="container my-5">
          <div className="w-75 mx-auto">
            <Post
              id={this.id}
              title={this.state.title}
              author={this.state.author}
              date={date}
              content={this.state.content}
              user_id={this.state.user_id}
              comments={this.state.comments}
              files={this.state.files}
              tags={this.state.tags}
              visibility={this.state.visibility}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="container my-5">
          <Spinner animation={'border'} role={'status'}>
            <span className={'sr-only'}>Loading...</span>
          </Spinner>
        </div>
      );
    }
  }
}

export default withAuth(PostView);
