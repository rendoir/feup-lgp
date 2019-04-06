import React, { Component } from "react";
import classNames from "classnames";

import createSequence from "../../utils/createSequence";

import styles from "./Post.module.css";

export type Props = {};

export type State = {};

const seq = createSequence();

class Post extends Component<Props, State> {
  id: string;

  static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.id = "post_" + seq.next();
    this.state = {
      isHovered: false
    };
  }

  render() {
    /*const { size } = this.props;
    const className = classNames(
      styles.container,
      this.props.className,
      this.state.isHovered ? styles.hovered : null
    );
*/
    return; /*(
      <div
        style={{ width: size, height: size }}
        className={className}
        title={this.props.title}
      >
        <div
          style={{ width: size, height: size }}
          className="post-header"
        >
          <Avatar></Avatar>
          <p className="post-author">{this.props.author}</p>
          <p className="post-date">{this.props.date}</p>
        </div>
      </div>
    );    */
  }
}

export default Post;
