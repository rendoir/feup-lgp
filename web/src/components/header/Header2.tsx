import { faClinicMedical } from "@fortawesome/free-solid-svg-icons";
import { faUserMd } from "@fortawesome/free-solid-svg-icons/faUserMd";
import classNames from "classnames";
import React, { MouseEvent, PureComponent, ReactNode } from "react";
import Icon from "../Icon/Icon";
import styles from "./Header.module.css";

type Props = {
  logoRedirectToHome: boolean;
  title: string;
  searchBar: boolean;
  onSearchClick?: (text: string, event: MouseEvent) => any;
  onProfileClick?: (event: MouseEvent) => any;
};

type State = {
  search: string;
  isOpen: boolean;
};

class Header2 extends PureComponent<Props, State> {
  public static defaultProps = {
    logoRedirectToHome: false,
    searchBar: false
  };

  constructor(props: Props) {
    super(props);

    this.setState({
      isOpen: false,
      search: ""
    });
  }

  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {this.renderBrand()}
          {this.renderLinks()}
        </div>
        <div className={styles.buttons}>{this.renderButtons()}</div>
      </div>
    );
  }

  private renderBrand() {
    const { title, logoRedirectToHome } = this.props;

    if (logoRedirectToHome) {
      return (
        <div>
          <a href={"/"} className={styles.logo}>
            <Icon icon={faClinicMedical} size={"lg"} className={styles.icon} />
            {title}
          </a>
        </div>
      );
    }

    return (
      <div>
        <Icon icon={faClinicMedical} size={"lg"} className={styles.logo} />
        {title}
      </div>
    );
  }

  private renderLinks() {
    return (
      <div>
        <a href={"/"} className={styles.link}>
          Home
        </a>
        <a href={"/shop"} className={styles.link}>
          Shop
        </a>
      </div>
    );
  }

  private renderButtons() {
    return (
      <div>
        <a href={"#"} onClick={this.handleClick} />
        <a
          href={"#"}
          onClick={event => event.preventDefault()}
          className={styles.buttons}
        >
          <Icon icon={faUserMd} size={"lg"} className={styles.icon} />
        </a>
      </div>
    );
  }

  private handleClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.setState({ isOpen: true });
  };
}

export default Header2;
