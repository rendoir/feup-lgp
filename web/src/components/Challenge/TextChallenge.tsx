// - Import react components
import React, { Component } from 'react';

// - Import styles
import styles from './Challenge.module.css';

export type Props = {
  id: number;
  title: string;
  challengeType: string;
  datestart: string;
  dateend: string;
  prize: string;
  pointsPrize: number;
  content: any[];
};

export type State = {};

class TextChallenge extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div className="card">
        <div className="card-header d-flex flex-row">
          <div
            key={'Challenge_' + this.props.id + '_title'}
            className="mr-auto"
          >
            {this.props.title}
          </div>
          <div className={styles.challenge_end}>
            Ending at: {this.props.dateend}
          </div>
        </div>
        <div className="card-body">
          <h6 className="card-title"> Challenge {this.props.id} </h6>
          <p className="card-text"> {this.props.content} </p>
        </div>
        <div className={`card-footer ${styles.card_footer}`}>
          <button
            id="invite_modal_done"
            className="btn btn-info"
            type="button"
            data-dismiss="modal"
          >
            Solve Challenge
          </button>
        </div>
      </div>
    );
  }
}

export default TextChallenge;
