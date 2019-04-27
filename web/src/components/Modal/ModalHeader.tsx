import classNames from "classnames";
import React from "react";
import styles from "./Modal.module.css";

export type Props = {
  className?: string;
  withBorder?: boolean;
  children: React.ReactNode;
};

function ModalHeader(props: Props) {
  const className = classNames(
    styles.header,
    {
      [styles.border]: props.withBorder
    },
    props.className
  );

  return <header className={className}>{props.children}</header>;
}

export default ModalHeader;
