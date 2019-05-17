import classNames from "classnames";
import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  PureComponent
} from "react";
import { fileToBase64 } from "../../utils/fileToBase64";
import { dictionary, LanguageContext } from "../../utils/language";
import AvatarSelector from "../AvatarSelector/AvatarSelector";
import InputNext, { HTMLAbstractInputElement } from "../InputNext/InputNext";
import Select from "../Select/Select";
import Switcher from "../Switcher/Switcher";
import Tag from "../Tags/Tag";
import styles from "./CreateNewModal.module.css";

export type Props = {
  id: string;
  avatar?: File;
  confirm_password: string;
  email: string;
  first_name: string;
  home_town: string;
  last_name: string;
  password: string;
  university: string;
  work: string;
  work_field: string;
  className?: string;
  vertical: boolean;
  isPublicGroupEnabled: boolean;
  aboutMaxLength?: number;
  onSubmit: (event: Event) => void;
  onChange: (value: string, type: string) => void;
  onAvatarRemove: () => void;
  onAvatarChange: (avatar: File) => void;
};

export type State = {
  avatar?: string;
  confirmPasswordError: boolean;
  confirmPasswordErrorMessage: string;
  emailError: boolean;
  emailErrorMessage: string;
  emailExists: boolean;
  emailHadInteraction: boolean;
  first_nameError: boolean;
  first_nameErrorMessage: string;
  last_nameError: boolean;
  last_nameErrorMessage: string;
  loading: boolean;
  passwordError: boolean;
  passwordErrorMessage: string;
  passwordHadInteraction: boolean;
};

class CreateGroupInfoForm extends PureComponent<Props, State> {
  public static contextType = LanguageContext;

  public static defaultProps = {
    aboutMaxLength: 130,
    email: "string",
    first_name: "string",
    home_town: "string",
    last_name: "string",
    password: "string",
    university: "string",
    vertical: false,
    work: "string"
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      avatar: undefined,
      confirmPasswordError: true,
      confirmPasswordErrorMessage: "",
      emailError: true,
      emailErrorMessage: "",
      emailExists: true,
      emailHadInteraction: false,
      first_nameError: true,
      first_nameErrorMessage: "",
      last_nameError: true,
      last_nameErrorMessage: "",
      loading: false,
      passwordError: true,
      passwordErrorMessage: "",
      passwordHadInteraction: false
    };
  }

  public render() {
    const { id } = this.props;

    const className = classNames(
      styles.info,
      {
        [styles.vertical]: this.props.vertical
      },
      this.props.className
    );

    return (
      <div className={className}>
        {this.renderAvatar()}
        <form id={id} autoComplete={"off"} className={styles.form}>
          <div className="form-row">
            <div className="form-group col-6">
              <InputNext
                className={styles.input}
                id={`${id}_first_name`}
                name={"first_name"}
                onChange={e => this.validate(e, "first_name")}
                placeholder={dictionary.first_name[this.context]}
                label={dictionary.first_name[this.context]}
                value={this.props.first_name}
                htmlAutoFocus={true}
                required={true}
              />
            </div>
            <div className="form-group col-6">
              <InputNext
                className={styles.input}
                id={`${id}_last_name`}
                name={"last_name"}
                onChange={e => this.validate(e, "last_name")}
                placeholder={dictionary.last_name[this.context]}
                label={dictionary.last_name[this.context]}
                value={this.props.last_name}
                htmlAutoFocus={true}
                required={true}
              />
            </div>
          </div>
          <div className="form-group mt-3">
            <InputNext
              className={styles.input}
              id={`${id}_work`}
              name={"work"}
              onChange={e => this.validate(e, "work")}
              placeholder={dictionary.workplace_institution[this.context]}
              label={dictionary.workplace_institution[this.context]}
              value={this.props.work}
              htmlAutoFocus={true}
              required={true}
            />
          </div>
          <div className="form-group mt-3">
            <InputNext
              className={styles.input}
              id={`${id}_work_field`}
              name={"work_field"}
              onChange={e => this.validate(e, "work_field")}
              placeholder={dictionary.profession_field[this.context]}
              label={dictionary.profession_field[this.context]}
              value={this.props.work_field}
              htmlAutoFocus={true}
              required={true}
            />
          </div>
          <div className="form-group mt-3">
            <InputNext
              className={styles.input}
              id={`${id}_home_town`}
              name={"home_town"}
              onChange={e => this.validate(e, "home_town")}
              placeholder={dictionary.hometown[this.context]}
              label={dictionary.hometown[this.context]}
              value={this.props.home_town}
              htmlAutoFocus={true}
              required={true}
            />
          </div>
          <div className="form-group mt-3">
            <InputNext
              className={styles.input}
              id={`${id}_university`}
              name={"university"}
              onChange={e => this.validate(e, "university")}
              placeholder={dictionary.university[this.context]}
              label={dictionary.university[this.context]}
              value={this.props.university}
              htmlAutoFocus={true}
              required={true}
            />
          </div>
          <div className="form-group mt-3">
            <InputNext
              className={styles.input}
              id={`${id}_email`}
              name={"email"}
              type="email"
              onChange={e => this.validate(e, "email")}
              placeholder={"E-mail"}
              label={"E-mail"}
              value={this.props.email}
              htmlAutoFocus={true}
              required={true}
            />
            <p id="emailErrorMessage">
              {dictionary.invalid_email[this.context]}
            </p>
          </div>
          <div className="form-group mt-3">
            <InputNext
              className={styles.input}
              id={`${id}_password`}
              name={"password"}
              type="password"
              onChange={e => this.validate(e, "password")}
              placeholder={dictionary.password[this.context]}
              label={dictionary.password[this.context]}
              value={this.props.password}
              htmlAutoFocus={true}
              required={true}
            />
            <p id="passwordErrorMessage">
              {dictionary.invalid_password[this.context]}
            </p>
          </div>
          <div>
            <InputNext
              className={styles.input}
              id={`${id}_confirm_password`}
              name={"confirm_password"}
              type="password"
              onChange={e => this.validate(e, "confirm_password")}
              placeholder={dictionary.confirm_password[this.context]}
              label={dictionary.confirm_password[this.context]}
              value={this.props.confirm_password}
              htmlAutoFocus={true}
              required={true}
            />
            <p id="confirmPasswordErrorMessage">
              {dictionary.invalid_confirm_password[this.context]}
            </p>
          </div>
        </form>
      </div>
    );
  }

  public componentDidMount(): void {
    if (this.props.avatar) {
      fileToBase64(this.props.avatar, (avatar: string) =>
        this.setState({ avatar })
      );
    }
  }

  public componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (nextProps.avatar) {
      fileToBase64(nextProps.avatar, avatar => this.setState({ avatar }));
    } else {
      this.setState({ avatar: nextProps.avatar });
    }
  }

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    this.props.onSubmit(event);
  };

  private handleChange = (value: string, event: ChangeEvent) => {
    // @ts-ignore
    this.setState({
      [(event.target as HTMLAbstractInputElement).name]: value
    });
    // this.props.onChange(value, event.target.name);
  };

  private renderAvatar() {
    const { avatar } = this.state;
    const { email } = this.props;

    return (
      <div className={styles.avatarBlock}>
        <AvatarSelector
          title={email}
          placeholder={"empty"}
          avatar={avatar}
          size={140}
          onRemove={this.props.onAvatarRemove}
          onChange={this.props.onAvatarChange}
        />
      </div>
    );
  }

  private validate(value, type) {
    if (type === "email") {
      const emailError = document.getElementById("emailErrorMessage");
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(value)) {
        this.setState(() => ({ emailError: false }));
        if (emailError !== null) {
          emailError.style.display = "none";
        }
      } else {
        this.props.onChange(value, type);
        if (emailError !== null) {
          emailError.style.display = "block";
        }
      }
      this.setState(() => ({ emailHadInteraction: true }));
      this.props.onChange(value, type);
    } else if (type === "password") {
      const passwordError = document.getElementById("passwordErrorMessage");
      if (String(value).length >= 8 && /\d/.test(value)) {
        this.setState(() => ({ passwordError: false }));
        if (passwordError !== null) {
          passwordError.style.display = "none";
        }
      } else {
        this.setState(() => ({ passwordError: true }));
        if (passwordError !== null) {
          passwordError.style.display = "block";
        }
      }
      this.setState(() => ({ passwordHadInteraction: true }));
      this.props.onChange(value, type);
    } else if (type === "confirm_password") {
      const confirmPasswordError = document.getElementById(
        "confirmPasswordErrorMessage"
      );
      if (this.props.password === value) {
        this.setState(() => ({ confirmPasswordError: false }));
        if (confirmPasswordError !== null) {
          confirmPasswordError.style.display = "none";
        }
      } else {
        this.setState(() => ({ confirmPasswordError: true }));
        if (confirmPasswordError !== null) {
          confirmPasswordError.style.display = "block";
        }
      }
    } else if (type === "first_name") {
      const firstNameError = document.getElementById("firstNameErrorMessage");
      if (value.toString().length > 1) {
        this.setState(() => ({ first_nameError: value }));
        if (firstNameError !== null) {
          firstNameError.style.display = "none";
        }
      } else {
        this.setState(() => ({ first_nameError: true }));
        if (firstNameError !== null) {
          firstNameError.style.display = "block";
        }
      }
      this.props.onChange(value, type);
    } else if (type === "last_name") {
      const lastNameError = document.getElementById("lastNameErrorMessage");
      if (value.toString().length > 1) {
        this.setState(() => ({ last_nameError: value }));
        if (lastNameError !== null) {
          lastNameError.style.display = "none";
        }
      } else {
        this.setState(() => ({ last_nameError: true }));
        if (lastNameError !== null) {
          lastNameError.style.display = "block";
        }
      }
      this.props.onChange(value, type);
    } else if (type === "work") {
      this.props.onChange(value, type);
    } else if (type === "work_field") {
      this.props.onChange(value, type);
    } else if (type === "home_town") {
      this.props.onChange(value, type);
    } else if (type === "university") {
      this.props.onChange(value, type);
    }
  }
}

export default CreateGroupInfoForm;
