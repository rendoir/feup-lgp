import classNames from 'classnames';
import React, { Component } from 'react';
import { ColorTheme } from '../../utils/types';
import styles from '../Button/Button.module.css';

export type Props = {
  /** LinkButton class attribute */
  className?: string;
  /** LinkButton children */
  children: React.ReactNode;
  /** LinkButton wide attribute */
  wide: boolean;
  /** LinkButton rounded attribute */
  rounded: boolean;
  /** LinkButton view */
  view: 'button' | 'outline' | 'link';
  /** LinkButton theme */
  theme: ColorTheme;
  /** LinkButton Size */
  size: 'small' | 'normal' | 'large';
  /** LinkButton href attribute */
  href: string;
  /** LinkButton target attribute */
  target?: string;
  /** LinkButton id attribute */
  id?: string;
};

class LinkButton extends Component<Props> {
  public static defaultProps = {
    rounded: true,
    size: 'normal',
    theme: 'default',
    view: 'button',
    wide: false
  };

  public render() {
    const {
      theme,
      size,
      wide,
      rounded,
      children,
      view,
      target,
      href,
      id
    } = this.props;
    const className = classNames(
      styles.container,
      styles[theme],
      styles[view],
      styles[size],
      {
        [styles.wide]: wide,
        [styles.rounded]: rounded
      },
      this.props.className
    );

    return (
      <a href={href} target={target} className={className} id={id}>
        {children}
      </a>
    );
  }
}

export default LinkButton;
