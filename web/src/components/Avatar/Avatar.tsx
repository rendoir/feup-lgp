import React, { Component } from "react";
import classNames from "classnames";
import { AvatarPlaceholder, UserStatusType } from "../../utils/types";
import getAvatarText from "../../utils/getAvatarText";
import getAvatarColor from "../../utils/getAvatarColor";
import createSequence from "../../utils/createSequence";
import ImagePreloader, {
  State as ImagePreloaderState,
  STATE_SUCCESS
} from "../ImagePreloader/ImagePreloader";
import styles from "./Avatar.module.css";

export type Props = {
  title: string | undefined;
  image: string | undefined;
  size: number;
  placeholder: AvatarPlaceholder;
  className?: string;
  onClick?: (event: MouseEvent) => unknown;
  status?: UserStatusType | null | undefined;
};

export type State = {
  isHovered: boolean;
};

const seq = createSequence();

class Avatar extends Component<Props, State> {
  id: string;

  static defaultProps = {
    image: undefined,
    title: undefined,
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

  renderGradient() {
    const { placeholder } = this.props;
    const colors = getAvatarColor(placeholder);

    return (
      <linearGradient
        id={this.id}
        gradientUnits="userSpaceOnUse"
        x1="100%"
        y1="100%"
        y2="0%"
        x2="0%"
      >
        <stop offset="0%" stopColor={colors.payload.from} />
        <stop offset="100%" stopColor={colors.payload.to} />
      </linearGradient>
    );
  }

  renderDefs({ state, src }: ImagePreloaderState) {
    if (state === STATE_SUCCESS || src !== undefined) {
      return (
        <pattern
          id={this.id}
          width="100%"
          height="100%"
          patternUnits="objectBoundingBox"
        >
          <image
            x="0"
            y="0"
            width="100%"
            height="100%"
            xlinkHref={src}
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      );
    }
    return this.renderGradient();
  }

  renderText({ state, src }: ImagePreloaderState) {
    const { title, size } = this.props;

    if (state === STATE_SUCCESS || src !== undefined || !title) {
      return null;
    }

    const placeholderText = size >= 20 ? getAvatarText(title) : null;

    if (!placeholderText) {
      return null;
    }

    return (
      <text
        className={styles.text}
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="central"
        dominantBaseline="central"
      >
        {placeholderText}
      </text>
    );
  }

  renderMask() {
    const { status } = this.props;

    if (!status || status === "invisible") {
      return (
        <circle
          fill={`url(#${this.id})`}
          cx="50"
          cy="50"
          r="50"
          className={styles.mask}
        />
      );
    }

    return (
      <path
        d="M68.393 96.508C62.7 98.762 56.495 100 50 100 22.386 100 0 77.614 0 50S22.386 0 50 0s50 22.386 50 50c0 6.495-1.238 12.7-3.492 18.393C93.083 65.643 88.734 64 84 64c-11.046 0-20 8.954-20 20 0 4.734 1.644 9.083 4.393 12.508z"
        fill={`url(#${this.id})`}
        className={styles.mask}
      />
    );
  }

  renderStatus() {
    const { status } = this.props;

    if (!status || status === "invisible") {
      return null;
    }

    return <circle cx="84" cy="84" r="15" className={styles[status]} />;
  }

  renderAvatar = (imageState: ImagePreloaderState) => {
    return (
      <g>
        <defs>{this.renderDefs(imageState)}</defs>
        {this.renderMask()}
        {this.renderText(imageState)}
        {this.renderStatus()}
      </g>
    );
  };

  render() {
    const { size } = this.props;
    const className = classNames(
      styles.container,
      this.props.className,
      this.state.isHovered ? styles.hovered : null
    );

    return (
      <div
        style={{ width: size, height: size }}
        className={className}
        title={this.props.title}
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          shapeRendering="auto"
          className={styles.svg}
        >
          <ImagePreloader src={this.props.image}>
            {this.renderAvatar}
          </ImagePreloader>
        </svg>
      </div>
    );
  }
}

export default Avatar;
