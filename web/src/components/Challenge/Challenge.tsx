// - Import react components
import React, { Component } from 'react';

// - Import styles
import styles from '../Challenge.module.css';

import CommentPost from './CommentPost';
import PostCreate from './PostCreate';
import QuestionAnswer from './QuestionAnswer';
import QuestionOptions from './QuestionOptions';
import TextChallenge from './TextChallenge';

export type Props = {
  talkID: number;
  id: number;
  title: string;
  challengeType: string;
  datestart: string;
  dateend: string;
  prize: string;
  pointsPrize: number;
  content: any[];
  userId: number;
};

export type State = {};

class Challenge extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const challenge = this.getChallenge();
    return <div className="container d-block w-75">{challenge}</div>;
  }

  public getChallenge() {
    switch (this.props.challengeType) {
      case 'question_options':
        return <QuestionOptions {...this.props} />;
      case 'answer_question':
        return <QuestionAnswer {...this.props} />;
      case 'create_post':
        return <PostCreate {...this.props} />;
      case 'comment_post':
        return <CommentPost {...this.props} />;
      case 'livestream_view':
      default:
        return <TextChallenge {...this.props} />;
    }
  }
}

export default Challenge;
