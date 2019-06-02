import React, { MouseEvent, PureComponent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from './ModalContext';

export type Props = {
  className?: string;
  overlayClassName?: string;
  onRequestClose?: () => any;
  shouldCloseOnOverlayClick: boolean;
  children: ReactNode;
};

class ReactModal extends PureComponent<Props> {
  public static defaultProps = {
    shouldCloseOnOverlayClick: true
  };

  public handleClickOverlay = () => {
    const { onRequestClose, shouldCloseOnOverlayClick } = this.props;

    if (shouldCloseOnOverlayClick && onRequestClose) {
      onRequestClose();
    }
  };

  public handleInnerClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  public render() {
    const { children, overlayClassName, className } = this.props;

    return (
      <ModalContext.Consumer>
        {({ modalRoot }) => {
          if (!modalRoot) {
            return null;
          }

          return createPortal(
            <div className={overlayClassName} onClick={this.handleClickOverlay}>
              <div className={className} onClick={this.handleInnerClick}>
                {children}
              </div>
            </div>,
            modalRoot
          );
        }}
      </ModalContext.Consumer>
    );
  }
}

export default ReactModal;
