// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "../Post/Post.module.css";

export type Props = {};

export type State = {};

class ChallengeCarousel extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const challenge = this.getChallenge();

    return <div>{this.getChallenge()}</div>;
  }

  public getChallenge() {
    return null;
  }
}

export default ChallengeCarousel;
