import classNames from "classnames";
import React from "react";
import styles from "./Modal.module.css";

export type Props = {
  className?: string;
  withBorder?: boolean;
  children: React.ReactNode;
};

function ModalFooter(props: Props) {
  const className = classNames(
    styles.footer,
    {
      [styles.border]: props.withBorder
    },
    props.className
  );

  return <footer className={className}>{props.children}</footer>;
}

export default ModalFooter;
