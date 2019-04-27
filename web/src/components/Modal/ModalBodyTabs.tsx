import React, { PureComponent, ReactNode } from "react";
import Tabs, { TabVariant } from "../Tabs/Tabs";
import styles from "./Modal.module.css";
import ModalBody from "./ModalBody";

export type Props<T> = {
  className?: string;
  children: ReactNode;
  tabs: Array<TabVariant<T>>;
  current: T;
  onChange: (screen: T) => any;
};

class ModalBodyTabs<T extends string> extends PureComponent<Props<T>> {
  public renderTabs(): ReactNode {
    const { tabs, current } = this.props;

    if (tabs.length === 0) {
      return null;
    }

    return (
      <Tabs
        className={styles.tabs}
        variants={tabs}
        current={current}
        onPick={this.props.onChange}
      />
    );
  }

  public render() {
    return (
      <div className={styles.bodyWrapper}>
        {this.renderTabs()}
        <ModalBody className={this.props.className}>
          {this.props.children}
        </ModalBody>
      </div>
    );
  }
}

export default ModalBodyTabs;
