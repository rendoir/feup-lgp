import classNames from "classnames";
import React, { PureComponent, ReactNode } from "react";
import styles from "./Modal.module.css";
import ReactModal from "./ReactModal";

export type Props = {
  className?: string;
  overlayClassName?: string;
  children?: ReactNode;
  fullscreen?: boolean;
  shouldCloseOnOverlayClick: boolean;
  onClose?: () => any;
};

class Modal extends PureComponent<Props> {
  private static defaultProps = {
    shouldCloseOnOverlayClick: true
  };

  public render() {
    const className = classNames(styles.container, this.props.className);
    const overlayClassName = classNames(
      styles.overlay,
      this.props.overlayClassName,
      {
        [styles.fullscreen]: this.props.fullscreen
      }
    );
    const { onClose, shouldCloseOnOverlayClick } = this.props;

    return (
      <ReactModal
        className={className}
        overlayClassName={overlayClassName}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      >
        <div className={styles.wrapper}>{this.props.children}</div>
      </ReactModal>
    );
  }
}

export default Modal;
