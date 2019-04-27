import React, { Context, PureComponent, ReactNode } from "react";

type ModalProviderProps = {
  modalRootId?: string;
  children: ReactNode;
};

type ModalProviderState = {
  modalRoot: null | HTMLDivElement;
};

export const ModalContext: Context<ModalProviderState> = React.createContext<
  ModalProviderState
>({
  modalRoot: null
});

export class ModalProvider extends PureComponent<
  ModalProviderProps,
  ModalProviderState
> {
  constructor(props: ModalProviderProps) {
    super(props);
    this.state = {
      modalRoot: null
    };
  }

  public componentDidMount(): void {
    if (typeof window !== "undefined") {
      const { modalRootId } = this.props;
      const body = document.body;
      if (body) {
        const modalRoot = document.createElement("div");
        if (modalRootId) {
          modalRoot.setAttribute("id", modalRootId);
        }
        body.appendChild(modalRoot);
        this.setState({ modalRoot });
      }
    }
  }

  public componentWillUnmount(): void {
    const { modalRoot } = this.state;
    if (modalRoot && (modalRoot as HTMLDivElement).parentNode) {
      (modalRoot as HTMLDivElement).parentNode!.removeChild(modalRoot);
    }
  }

  public render() {
    const { children } = this.props;

    return (
      <ModalContext.Provider value={this.state}>
        {children}
      </ModalContext.Provider>
    );
  }
}
