import { func } from "prop-types";
import React, { Component } from "react";
import classNames from "classnames";
import { AvatarPlaceholder, UserStatusType } from "../../utils/types";
import getAvatarText from "../../utils/getAvatarText";
import getAvatarColor from "../../utils/getAvatarColor";
import createSequence from "../../utils/createSequence";
import styles from "./Avatar.module.css";

export type Props = {
  id: string;
  title: string | null;
  image?: string;
  size: number;
  placeholder: AvatarPlaceholder;
  className?: string;
  onClick?: (event: MouseEvent) => any;
  status?: UserStatusType;
};

export type State = {
  isHovered: boolean;
};

const seq = createSequence();

class Avatar extends Component<Props, State> {
  id: string;

  static defaultProps = {
    image: null,
    title: null,
    size: 32,
    placeholder: "empty",
    status: null
  };

  constructor(props: Props) {
    super(props);

    this.id = "avatar_" + seq.next();
    this.state = {
      isHovered: false
    };
  }

  handleHover = (hover: boolean): void => {
    this.setState({ isHovered: hover });
  };

  renderGradient() {
    const { placeholder } = this.props;
    const colors = getAvatarColor(placeholder);

    return (
      <linearGradient
        id={this.id}
        gradientUnits="userSpaceOnUse"
        x1={"100%"}
        y1={"100%"}
        y2={"0%"}
        x2={"0%"}
      >
        <stop offset={"0%"} stopColor={colors.payload.from} />
        <stop offset={"100%"} stopColor={colors.payload.to} />
      </linearGradient>
    );
  }

  renderDefs() {}
}
