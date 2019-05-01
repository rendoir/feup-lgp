import React, { Component } from "react";
import { AutoSizer } from "react-virtualized";

import classNames from "classnames";
import { listen } from "../../utils/listen";
import { ClientRect } from "../../utils/types";
import styles from "./Scroller.module.css";

export type Dimensions = {
  scrollTop: number;
  scrollHeight: number;
  offsetHeight: number;
};

export type Props = {
  className?: string;
  children: Node;
  onScroll?: () => unknown;
  onUserScroll?: () => unknown;
  onJSScroll?: () => unknown;
  onResize?: (size: { width: number; height: number }) => unknown;
  fromBottom: boolean;
};

type State = {
  isUserInteraction: boolean;
};

class Scroller extends Component<Props, State> {
  public static defaultProps = {
    fromBottom: false
  };

  private container: HTMLElement | null | undefined;
  private listeners: (Array<{ remove(): void }>) | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      isUserInteraction: false
    };
  }

  public render() {
    const className = classNames(styles.container, {
      [styles.fromBottom]: this.props.fromBottom
    });

    return (
      <AutoSizer onResize={this.props.onResize}>
        {size => (
          <div className={this.props.className} style={size}>
            <div className={className} ref={this.setContainer}>
              {this.props.children}
            </div>
          </div>
        )}
      </AutoSizer>
    );
  }

  public scrollToBottom(): void {
    if (this.container) {
      this.scrollTo(this.container.scrollHeight);
    }
  }

  public scrollToNode(node: HTMLElement, withGap: boolean = false): void {
    if (this.container) {
      const gap = withGap ? Math.floor(this.container.clientHeight * 0.4) : 0;
      this.scrollTo(
        Math.min(node.offsetTop - gap, this.container.scrollHeight)
      );
    }
  }

  public componentDidMount(): void {
    if (this.container) {
      // @ts-ignore
      // @ts-ignore
      this.listeners = [
        listen(this.container, "user_scroll", this.handleScrollByUser, {
          passive: true
        }),
        listen(this.container, "js_scroll", this.handleScrollByJS, {
          passive: true
        }),
        listen(this.container, "scroll", this.handleScroll, {
          passive: true
        }),
        listen(this.container, "mousedown", this.handleUserInteractionStart, {
          passive: true
        }),
        listen(this.container, "mouseup", this.handleUserInteractionEnd, {
          passive: true
        }),
        listen(this.container, "wheel", this.handleMouseWheel, {
          passive: true
        }),
        listen(this.container, "touchstart", this.handleUserInteractionStart, {
          passive: true
        }),
        listen(this.container, "touchend", this.handleUserInteractionEnd, {
          passive: true
        }),
        listen(this.container, "touchmove", this.handleTouchMove, {
          passive: true
        }),
        // @ts-ignore
        listen(this.container, "keydown", this.handleKeyDown, {
          passive: true
        })
      ];
    }
  }

  public shouldComponentUpdate(nextProps: Props): boolean {
    return (
      nextProps.children !== this.props.children ||
      nextProps.className !== this.props.className
    );
  }

  public componentWillMount(): void {
    if (this.listeners) {
      this.listeners.forEach(listener => listener.remove());
      this.listeners = null;
    }
  }

  private handleScrollByUser = (): void => {
    if (this.props.onUserScroll) {
      this.props.onUserScroll();
    }
  };

  private handleScrollByJS = (): void => {
    if (this.props.onJSScroll) {
      this.props.onJSScroll();
    }
  };

  private handleScroll = (): void => {
    if (this.state.isUserInteraction) {
      if (this.container) {
        this.container.dispatchEvent(new CustomEvent("user_scroll"));
      }
    }
    if (this.props.onScroll) {
      this.props.onScroll();
    }
  };

  private handleMouseWheel = (): void => {
    if (this.container) {
      this.container.dispatchEvent(new CustomEvent("user_scroll"));
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (
      event.code === "PageUp" ||
      event.code === "PageDown" ||
      event.code === "Home" ||
      event.code === "End" ||
      event.code === "ArrowLeft" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowRight" ||
      event.code === "ArrowDown"
    ) {
      if (this.container) {
        this.container.dispatchEvent(new CustomEvent("user_scroll"));
      }
    }
  };

  private handleUserInteractionStart = (): void => {
    this.setState({ isUserInteraction: true });
  };

  private handleUserInteractionEnd = (): void => {
    this.setState({ isUserInteraction: false });
  };

  private handleTouchMove = (): void => {
    if (this.state.isUserInteraction) {
      if (this.container) {
        this.container.dispatchEvent(new CustomEvent("user_scroll"));
      }
    }
  };

  private getDimensions(): Dimensions | null {
    if (this.container) {
      return {
        offsetHeight: this.container.offsetHeight,
        scrollHeight: this.container.scrollHeight,
        scrollTop: this.container.scrollTop
      };
    }

    return null;
  }

  private getBoudingClientRect(): ClientRect | null {
    if (this.container) {
      return this.container.getBoundingClientRect();
    }

    return null;
  }

  private setContainer = (container: any): void => {
    this.container = container;
  };

  private scrollTo(offset: number): void {
    if (this.container) {
      this.container.scrollTop = offset;
      this.container.dispatchEvent(new CustomEvent("js_scroll"));
    }
  }
}

export default Scroller;
