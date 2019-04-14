import { Component, ReactNode } from "react";

export const STATE_PENDING = "pending";
export const STATE_SUCCESS = "success";
export const STATE_ERROR = "error";

export type VideoState = "pending" | "success" | "error";

export interface State {
  state: VideoState;
  src: string | undefined;
  error: unknown | null | undefined;
}

export interface Props {
  /** Video src attribute */
  src: string | undefined;
  /** Video onChange event handler */
  onChange?: (state: State) => any;
  /** Handlers that receive an state and returns a Node */
  children: (state: State) => ReactNode;
}

class VideoPreloader extends Component<Props, State> {
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
  public Video: HTMLVideoElement | null | undefined;

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
      const Video = document.createElement("iframe");

      Video.onload = this.handleSuccess;
      Video.onerror = this.handleError;
      Video.src = src;
      /*
      COMENTADO PARA CONSEGUIR COMPILAR
      if (Video.complete) {
        this.handleSuccess();
      }

      this.Video = Video;*/
    });
  };

  public handleStopFetch = (): void => {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    this.handleVideoClear();
  };

  public handleVideoClear = (): void => {
    if (this.Video) {
      this.Video.src = "";
      this.Video.onload = null;
      // @ts-ignore
      this.Video.onerror = null;
      this.Video = null;
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

export default VideoPreloader;
