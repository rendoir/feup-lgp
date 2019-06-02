import React, { Component } from 'react';

import styles from './Livestream.module.scss';

export type Props = {
  src: string;
};

export type State = {};

class Livestream extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <iframe
        id={styles.videoStream}
        src={this.props.src}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
      />
    );
  }
}

export default Livestream;
