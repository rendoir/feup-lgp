import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React from "react";
import Icon from "../Icon/Icon";
import styles from "./Modal.module.css";

export type Props = {
  className?: string;
  pending?: boolean;
  id?: string;
  onClick: () => any;
};

function ModalClose(props: Props) {
  const className = classNames(styles.closeContainer, props.className);

  if (props.pending) {
    return <Icon icon={faSpinner} pulse={true} />;
  }

  return (
    <div id={props.id} className={className} onClick={props.onClick}>
      <Icon icon={faTimes} className={styles.close} size={"2x"} />
    </div>
  );
}

export default ModalClose;
