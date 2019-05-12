import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import classNames from "classnames";
import React, { MouseEvent, PureComponent } from "react";
import Icon from "../Icon/Icon";
import styles from "./OptionAnswer.module.css";

export type Props = {
  id: string;
  value: string;
  className?: string;
  clickable: boolean;
  onClick?: (event: MouseEvent) => void;
  onRemove: (tag: string, event: MouseEvent) => void;
};

class OptionAnswer extends PureComponent<Props> {
  public static defaultProps = {
    clickable: false
  };

  public render() {
    const { id, value, clickable } = this.props;

    return (
      <div
        id={id}
        className="list-group-item list-group-item-action"
        onClick={clickable ? this.handleClick : undefined}
      >
        <div className="d-flex w-100 justify-content-between">
          <p className={`mb-1 ${styles.option}`} key={id}>
            {value}
          </p>
          <a href={"#"} onClick={this.handleRemove}>
            <Icon icon={faTimes} size={"2x"} className={styles.icon} />
          </a>
        </div>
      </div>
    );
  }

  private handleClick = (event: MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      onClick(event);
    }
  };

  private handleRemove = (event: MouseEvent): void => {
    event.preventDefault();
    this.props.onRemove(this.props.value, event);
  };
}

export default OptionAnswer;
