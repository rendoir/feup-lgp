import classNames from 'classnames';
import React from 'react';
import styles from './Modal.module.css';

export type Props = {
  className?: string;
  children: React.ReactNode;
};

function ModalBody(props: Props) {
  const className = classNames(styles.body, props.className);

  return <section className={className}>{props.children}</section>;
}

export default ModalBody;
