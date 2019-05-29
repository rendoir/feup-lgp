import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import classNames from 'classnames';
import React, { MouseEvent, PureComponent } from 'react';
import Icon from '../Icon/Icon';
import styles from './Tag.module.css';

export type Props = {
  id: string;
  value: string;
  className?: string;
  clickable: boolean;
  onClick?: (event: MouseEvent) => void;
  onRemove: (tag: string, event: MouseEvent) => void;
};

class Tag extends PureComponent<Props> {
  public static defaultProps = {
    clickable: false
  };

  public render() {
    const { id, value, clickable } = this.props;
    const classname = classNames(styles.wrapper, this.props.className);

    return (
      <div
        id={id}
        className={classname}
        onClick={clickable ? this.handleClick : undefined}
      >
        <p className={styles.tag}>
          #{value}
          <a href={'#'} onClick={this.handleRemove}>
            <Icon icon={faTimes} size={'2x'} className={styles.icon} />
          </a>
        </p>
      </div>
    );
  }

  private handleClick = (event: MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      onClick(event);
    }
  };

  private handleRemove = (event: MouseEvent): void => {
    event.preventDefault();
    this.props.onRemove(this.props.value, event);
  };
}

export default Tag;
