import { ClientRect } from "../../utils/types";
import React, { Component } from "react";
import { listen } from "../../utils/listen";
import { AutoSizer } from "react-virtualized";
import classNames from "classnames";
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
  container: HTMLElement | null | undefined;
  listeners: ({ remove(): void }[]) | null | undefined;

  static defaultProps = {
    fromBottom: false
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isUserInteraction: false
    };
  }

  componentDidMount(): void {
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
        //@ts-ignore
        listen(this.container, "keydown", this.handleKeyDown, {
          passive: true
        })
      ];
    }
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return (
      nextProps.children !== this.props.children ||
      nextProps.className !== this.props.className
    );
  }

  componentWillMount(): void {
    if (this.listeners) {
      this.listeners.forEach(listener => listener.remove());
      this.listeners = null;
    }
  }

  handleScrollByUser = (): void => {
    if (this.props.onUserScroll) {
      this.props.onUserScroll();
    }
  };

  handleScrollByJS = (): void => {
    if (this.props.onJSScroll) {
      this.props.onJSScroll();
    }
  };

  handleScroll = (): void => {
    if (this.state.isUserInteraction) {
      if (this.container) {
        this.container.dispatchEvent(new CustomEvent("user_scroll"));
      }
    }
    if (this.props.onScroll) {
      this.props.onScroll();
    }
  };

  handleMouseWheel = (): void => {
    if (this.container) {
      this.container.dispatchEvent(new CustomEvent("user_scroll"));
    }
  };

  handleKeyDown = (event: KeyboardEvent): void => {
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

  handleUserInteractionStart = (): void => {
    this.setState({ isUserInteraction: true });
  };

  handleUserInteractionEnd = (): void => {
    this.setState({ isUserInteraction: false });
  };

  handleTouchMove = (): void => {
    if (this.state.isUserInteraction) {
      if (this.container) {
        this.container.dispatchEvent(new CustomEvent("user_scroll"));
      }
    }
  };

  getDimensions(): Dimensions | null {
    if (this.container) {
      return {
        scrollTop: this.container.scrollTop,
        scrollHeight: this.container.scrollHeight,
        offsetHeight: this.container.offsetHeight
      };
    }

    return null;
  }

  getBoudingClientRect(): ClientRect | null {
    if (this.container) {
      return this.container.getBoundingClientRect();
    }

    return null;
  }

  setContainer = (container: any): void => {
    this.container = container;
  };

  scrollTo(offset: number): void {
    if (this.container) {
      this.container.scrollTop = offset;
      this.container.dispatchEvent(new CustomEvent("js_scroll"));
    }
  }

  scrollToBottom(): void {
    if (this.container) {
      this.scrollTo(this.container.scrollHeight);
    }
  }

  scrollToNode(node: HTMLElement, withGap: boolean = false): void {
    if (this.container) {
      const gap = withGap ? Math.floor(this.container.clientHeight * 0.4) : 0;
      this.scrollTo(
        Math.min(node.offsetTop - gap, this.container.scrollHeight)
      );
    }
  }

  render() {
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
}

export default Scroller;
