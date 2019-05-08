// @ts-ignore
import createKeyHotKey from "key-event-to-string";
import { Component, ReactNode } from "react";
import { listen } from "../../utils/listen";

type Props = {
  children: ReactNode;
  onHotKey: (trigger: string, event: KeyboardEvent) => any;
};

class HotKeys extends Component<Props> {
  private listener?: { remove(): void } | null;
  private readonly getHotKey: (event: KeyboardEvent) => string;

  constructor(props: Props) {
    super(props);

    this.getHotKey = createKeyHotKey();
  }

  public render() {
    return this.props.children;
  }

  public componentDidMount(): void {
    this.listener = listen(
      window,
      "keydown",
      this.handleKeyDown as EventListener,
      {
        capture: true,
        passive: false
      }
    );
  }

  public componentWillUnmount(): void {
    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    this.props.onHotKey(this.getHotKey(event), event);
  };
}

export default HotKeys;
