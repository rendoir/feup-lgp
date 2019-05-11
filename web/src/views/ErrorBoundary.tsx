import React, { Component } from "react";
import { dictionary, LanguageContext } from "../utils/language";

type Props = {};
type State = {
  error: any;
  errorInfo: any;
};

class ErrorBoundary extends Component<Props, State> {
  public static contextType = LanguageContext;

  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  // For this example we'll just use componentDidCatch, this is only
  // here to show you what this method would look like.
  // static getDerivedStateFromProps(error){
  // return { error: true }
  // }

  public componentDidCatch(error: any, info: any) {
    this.setState({ error, errorInfo: info });
  }

  public render() {
    if (this.state.errorInfo) {
      return (
        <div className="error-boundary">
          <h2>{dictionary.unknown_error[this.context]}</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo.componentStack}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
