import { Component, ReactNode } from "react";

export const STATE_PENDING = "pending";
export const STATE_SUCCESS = "success";
export const STATE_ERROR = "error";

export type ImageState = "pending" | "success" | "error";

export type State = {
  state: ImageState;
  src: string | undefined;
  error: unknown | null | undefined;
};

export type Props = {
  /** Image src attribute */
  src: string | undefined;
  /** Image onChange event handler */
  onChange?: (state: State) => any;
  /** Handlers that receive an state and returns a Node */
  children: (state: State) => ReactNode;
};

class ImagePreloader extends Component<Props, State> {
  public static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): State {
    return {
      error: null,
      src: nextProps.src === undefined ? undefined : prevState.src,
      state: nextProps.src === prevState.src ? prevState.state : STATE_PENDING
    };
  }
  private requestId: number | null | undefined;
  private image: HTMLImageElement | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
      src: undefined,
      state: STATE_PENDING
    };
  }

  public render() {
    return this.props.children(this.state);
  }

  public componentDidMount(): void {
    if (this.props.src) {
      this.handleStartFetch(this.props.src);
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    if (this.props.src === null) {
      this.handleStopFetch();
    }

    if (this.props.src && this.props.src !== prevProps.src) {
      this.handleStartFetch(this.props.src);
    }

    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  }

  public componentWillUnmount(): void {
    this.handleStopFetch();
  }

  private handleStartFetch = (src: string): void => {
    this.handleStopFetch();
    this.requestId = requestAnimationFrame(() => {
      const image = document.createElement("img");

      image.onload = this.handleSuccess;
      image.onerror = this.handleError;
      image.src = src;

      if (image.complete) {
        this.handleSuccess();
      }

      this.image = image;
    });
  };

  private handleStopFetch = (): void => {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    this.handleImageClear();
  };

  private handleImageClear = (): void => {
    if (this.image) {
      this.image.src = "";
      this.image.onload = null;
      // @ts-ignore
      this.image.onerror = null;
      this.image = null;
    }
  };

  private handleSuccess = (): void => {
    this.setState({
      src: this.props.src,
      state: STATE_SUCCESS
    });
    this.handleStopFetch();
  };

  private handleError = (error?: any): void => {
    this.setState({
      error,
      src: this.props.src,
      state: STATE_ERROR
    });
    this.handleStopFetch();
  };
}

export default ImagePreloader;
