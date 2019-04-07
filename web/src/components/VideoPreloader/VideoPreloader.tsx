import { Component, ReactNode } from "react";

export const STATE_PENDING = "pending";
export const STATE_SUCCESS = "success";
export const STATE_ERROR = "error";

export type VideoState = "pending" | "success" | "error";

export type State = {
  state: VideoState;
  src: string | undefined;
  error: unknown | null | undefined;
};

export type Props = {
  /** Video src attribute */
  src: string | undefined;
  /** Video onChange event handler */
  onChange?: (state: State) => any;
  /** Handlers that receive an state and returns a Node */
  children: (state: State) => ReactNode;
};

class VideoPreloader extends Component<Props, State> {
  requestId: number | null | undefined;
  Video: HTMLVideoElement | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      state: STATE_PENDING,
      src: undefined,
      error: null
    };
  }

  componentDidMount(): void {
    if (this.props.src) {
      this.handleStartFetch(this.props.src);
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
    return {
      src: nextProps.src === undefined ? undefined : prevState.src,
      state: nextProps.src === prevState.src ? prevState.state : STATE_PENDING,
      error: null
    };
  }

  componentDidUpdate(prevProps: Props): void {
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

  componentWillUnmount(): void {
    this.handleStopFetch();
  }

  handleStartFetch = (src: string): void => {
    this.handleStopFetch();
    this.requestId = requestAnimationFrame(() => {
      const Video = document.createElement("iframe");

      Video.onload = this.handleSuccess;
      Video.onerror = this.handleError;
      Video.src = src;

      if (Video.complete) {
        this.handleSuccess();
      }

      this.Video = Video;
    });
  };

  handleStopFetch = (): void => {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    this.handleVideoClear();
  };

  handleVideoClear = (): void => {
    if (this.Video) {
      this.Video.src = "";
      this.Video.onload = null;
      // @ts-ignore
      this.Video.onerror = null;
      this.Video = null;
    }
  };

  handleSuccess = (): void => {
    this.setState({
      state: STATE_SUCCESS,
      src: this.props.src
    });
    this.handleStopFetch();
  };

  handleError = (error?: any): void => {
    this.setState({
      state: STATE_ERROR,
      src: this.props.src,
      error
    });
    this.handleStopFetch();
  };

  render() {
    return this.props.children(this.state);
  }
}

export default VideoPreloader;
