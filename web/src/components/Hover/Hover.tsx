import React, { Component, MouseEvent, ReactNode } from 'react';
import { hasSelection } from '../../utils/hasSelection';
import { listen } from '../../utils/listen';

export type Props = {
  className?: string;
  id?: string;
  children?: ReactNode;
  onHover: (hover: boolean) => any;
  onClick?: (event: MouseEvent) => any;
};

class Hover extends Component<Props> {
  private hover: boolean;
  private selecting: boolean;
  private listener: { remove(): void } | undefined | null;

  constructor(props: Props) {
    super(props);

    this.hover = false;
    this.selecting = false;
  }

  public componentDidMount(): void {
    this.listener = listen(
      document,
      'selectionchange',
      this.handleSelectionChange,
      { passive: true }
    );
  }

  public componentWillUnmount(): void {
    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  }

  public render() {
    return (
      <div
        id={this.props.id}
        className={this.props.className}
        onClick={this.props.onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children}
      </div>
    );
  }

  private handleSelectionChange = (): void => {
    if (hasSelection()) {
      this.selecting = true;
      this.props.onHover(false);
    } else {
      this.selecting = false;
      this.props.onHover(this.hover);
    }
  };

  private handleMouseEnter = (): void => {
    this.hover = true;
    if (!this.selecting) {
      this.props.onHover(true);
    }
  };

  private handleMouseLeave = (): void => {
    this.hover = false;
    if (!this.selecting) {
      this.props.onHover(false);
    }
  };
}

export default Hover;
