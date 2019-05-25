import {
  FaSymbol,
  FlipProp,
  IconProp,
  PullProp,
  RotateProp,
  Transform
} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classNames from 'classnames';
import React, { Component, CSSProperties } from 'react';
import { ColorTheme, IconSize } from '../../utils/types';
import styles from './Icon.module.css';

export type Props = {
  className?: string;
  icon: IconProp;
  size: IconSize;
  style?: CSSProperties;
  theme: ColorTheme;
  fixedWidth?: boolean;
  inverse: boolean;
  listItem?: boolean;
  rotation?: RotateProp;
  flip?: FlipProp;
  spin?: boolean;
  pulse?: boolean;
  border?: boolean;
  pull?: PullProp;
  transform?: Transform;
  mask?: IconProp;
  symbol?: FaSymbol;
};

class Icon extends Component<Props> {
  public static defaultProps = {
    inverse: false,
    size: '1x',
    theme: 'default',
    type: 'icon'
  };

  public render() {
    const {
      icon,
      size,
      style,
      theme,
      fixedWidth,
      inverse,
      listItem,
      rotation,
      flip,
      spin,
      pulse,
      border,
      pull,
      transform,
      mask,
      symbol
    } = this.props;

    const className = classNames(
      styles.container,
      {
        [styles[theme]]: theme,
        [styles.inverted]: inverse
      },
      this.props.className
    );

    const props = {
      border,
      icon,
      inverse,
      mask,
      size,
      style,
      symbol,
      transform
    };

    return (
      <FontAwesomeIcon
        {...props}
        className={className}
        fixedWidth={fixedWidth}
        listItem={listItem}
        rotation={rotation}
        flip={flip}
        spin={spin}
        pulse={pulse}
        pull={pull}
      />
    );
  }
}

export default Icon;
