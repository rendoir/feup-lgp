import React, { Component } from "react";

import classNames from "classnames";
import Tab from "./Tab";
import styles from "./Tabs.module.css";

export type TabVariant<T> = {
  id: T;
  title: string;
};

type Props<T> = {
  variants: Array<TabVariant<T>>;
  current: T;
  className?: string;
  onPick: (current: T) => unknown;
};

class Tabs<T extends string> extends Component<Props<T>> {
  public render() {
    const { current, variants } = this.props;
    const className = classNames(styles.container, this.props.className);

    const tabs = variants.map(({ id, title }) => {
      const active = id === current;

      return (
        <Tab
          id={id}
          key={id}
          title={title}
          active={active}
          onPick={this.props.onPick}
        />
      );
    });

    return <ul className={className}>{tabs}</ul>;
  }
}

export default Tabs;
