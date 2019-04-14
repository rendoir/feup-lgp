import { Component, ReactNode } from "react";

export const STATE_PENDING = "pending";
export const STATE_SUCCESS = "success";
export const STATE_ERROR = "error";

export type ImageState = "pending" | "success" | "error";

export interface State {
  state: ImageState;
  src: string | undefined;
  error: unknown | null | undefined;
}

export interface Props {
  /** Image src attribute */
  src: string | undefined;
  /** Image onChange event handler */
  onChange?: (state: State) => any;
  /** Handlers that receive an state and returns a Node */
  children: (state: State) => ReactNode;
}

class ImagePreloader extends Component<Props, State> {
  public static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): State {
    return {
      src: nextProps.src === undefined ? undefined : prevState.src,
      state: nextProps.src === prevState.src ? prevState.state : STATE_PENDING,
      error: null
    };
  }
  public requestId: number | null | undefined;
  public image: HTMLImageElement | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      state: STATE_PENDING,
      src: undefined,
      error: null
    };
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

  public handleStartFetch = (src: string): void => {
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

  public handleStopFetch = (): void => {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    this.handleImageClear();
  };

  public handleImageClear = (): void => {
    if (this.image) {
      this.image.src = "";
      this.image.onload = null;
      // @ts-ignore
      this.image.onerror = null;
      this.image = null;
    }
  };

  public handleSuccess = (): void => {
    this.setState({
      state: STATE_SUCCESS,
      src: this.props.src
    });
    this.handleStopFetch();
  };

  public handleError = (error?: any): void => {
    this.setState({
      state: STATE_ERROR,
      src: this.props.src,
      error
    });
    this.handleStopFetch();
  };

  public render() {
    return this.props.children(this.state);
  }
}

export default ImagePreloader;
