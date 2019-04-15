import React, { Component } from "react";
import classNames from "classnames";
import styles from "./Tabs.module.css";

export type Props<T> = {
  id: T;
  title: string;
  active: boolean;
  onPick: (id: T) => unknown;
};

class Tab<T extends string> extends Component<Props<T>> {
  handleClick = (): void => {
    this.props.onPick(this.props.id);
  };

  render() {
    const { title, active, id } = this.props;
    const className = classNames(styles.tab, {
      [styles.active]: active
    });

    return (
      <li
        className={className}
        onClick={this.handleClick}
        id={`tabs_tab_${id}`}
      >
        {title}
      </li>
    );
  }
}

export default Tab;
