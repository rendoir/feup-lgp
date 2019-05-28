import * as React from 'react';

import Post from '../components/Post/Post';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

interface IState {
  author: string;
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

    return (
      <div className="container my-5">
        <div className="w-75 mx-auto">
          <Post
            id={Number(this.state.id)}
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
  }
}

export default withAuth(PostView);
