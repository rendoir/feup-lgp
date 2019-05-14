import axios from "axios";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { getApiURL } from "../../utils/apiURL";
import { dictionary, LanguageContext } from "../../utils/language";

type State = {
  confirmPasswordError: boolean;
  confirmPasswordErrorMessage: string;
  email: string;
  emailError: boolean;
  emailErrorMessage: string;
  emailExists: boolean;
  emailHadInteraction: boolean;
  first_name: string;
  first_nameError: boolean;
  first_nameErrorMessage: string;
  home_town: string;
  last_name: string;
  last_nameError: boolean;
  last_nameErrorMessage: string;
  loading: boolean;
  password: string;
  passwordError: boolean;
  passwordErrorMessage: string;
  passwordHadInteraction: boolean;
  university: string;
  work: string;
  work_field: string;
};

class RegisterForm extends React.Component<RouteComponentProps, State> {
  public static contextType = LanguageContext;

  constructor(props) {
    super(props);
    this.state = {
      confirmPasswordError: true,
      confirmPasswordErrorMessage: "",
      email: "",
      emailError: true,
      emailErrorMessage: "",
      emailExists: true,
      emailHadInteraction: false,
      first_name: "",
      first_nameError: true,
      first_nameErrorMessage: "",
      home_town: "",
      last_name: "",
      last_nameError: true,
      last_nameErrorMessage: "",
      loading: false,
      password: "",
      passwordError: true,
      passwordErrorMessage: "",
      passwordHadInteraction: false,
      university: "",
      work: "",
      work_field: ""
    };

    this.handlePress = this.handlePress.bind(this);
  }

  public render() {
    return (
      <form className="mt-3" onSubmit={this.handlePress}>
        <div className="form-row">
          <div className="form-group col-6">
            <input
              type="text"
              className="form-control"
              id="inputFirstName"
              placeholder={dictionary.first_name[this.context]}
              onChange={e => this.validate("first_name", e.target.value)}
            />
          </div>
          <div className="form-group col-6">
            <input
              type="text"
              className="form-control"
              id="inputLastName"
              placeholder={dictionary.last_name[this.context]}
              onChange={e => this.validate("last_name", e.target.value)}
            />
          </div>
        </div>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control col"
            id="inputInstituicao"
            placeholder={dictionary.workplace_institution[this.context]}
            onChange={e => this.validate("work", e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control col"
            id="inputProfissaoCurso"
            placeholder={dictionary.profession_field[this.context]}
            onChange={e => this.validate("work_field", e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control col"
            id="inputHomeTown"
            placeholder={dictionary.hometown[this.context]}
            onChange={e => this.validate("home_town", e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control col"
            id="inputUniversity"
            placeholder={dictionary.university[this.context]}
            onChange={e => this.validate("university", e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="email"
            className="form-control col"
            id="inputEmail"
            placeholder="E-mail"
            onChange={e => this.validate("email", e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="password"
            className="form-control col"
            id="inputPassword"
            placeholder={dictionary.password[this.context]}
            onChange={e => this.validate("password", e.target.value)}
          />
          <p id="passwordErrorMessage">
            {dictionary.invalid_password[this.context]}
          </p>
        </div>
        <div>
          <input
            type="password"
            className="form-control col"
            id="inputConfirmPassword"
            placeholder={dictionary.confirm_password[this.context]}
            onChange={e => this.validate("confirm_password", e.target.value)}
          />
          <p id="confirmPasswordErrorMessage">
            {dictionary.invalid_confirm_password[this.context]}
          </p>
        </div>
        <div className="mt-3 text-center">
          <button type="submit" className="btn btn-primary">
            {dictionary.signup[this.context]}
          </button>
        </div>
      </form>
    );
  }

  private handlePress(e) {
    e.preventDefault();
    if (
      !this.state.passwordError &&
      !this.state.emailError &&
      !this.state.confirmPasswordError
    ) {
      this.setState({ loading: true });
      const body = {
        email: this.state.email,
        first_name: this.state.first_name,
        home_town: this.state.home_town,
        last_name: this.state.last_name,
        password: this.state.password,
        university: this.state.university,
        work: this.state.work,
        work_field: this.state.work_field
      };

      return axios
        .post(getApiURL("/users"), body)
        .then(() => {
          console.log("Registration completed, redirecting to feed!");
          this.setState({
            loading: false
          });
          this.props.history.push("/");
        })
        .catch(() => {
          console.log("Register system failed");
        });
    } else {
      console.log("Fill the necessary inputs!");
    }
  }

  private validate(type, value) {
    if (type === "email") {
      const emailError = document.getElementById("emailErrorMessage");
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(value)) {
        this.setState(() => ({ emailError: false }));
        if (emailError !== null) {
          emailError.style.display = "none";
        }
      } else {
        this.setState(() => ({ emailError: true, email: value }));
        if (emailError !== null) {
          emailError.style.display = "block";
        }
      }
      this.setState(() => ({ emailHadInteraction: true, email: value }));
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
      this.setState(() => ({ passwordHadInteraction: true, password: value }));
    } else if (type === "confirm_password") {
      const confirmPasswordError = document.getElementById(
        "confirmPasswordErrorMessage"
      );
      if (this.state.password === value) {
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
      this.setState(() => ({ first_name: value }));
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
      this.setState(() => ({ last_name: value }));
    } else if (type === "work") {
      this.setState(() => ({ work: value }));
    } else if (type === "work_field") {
      this.setState(() => ({ work_field: value }));
    } else if (type === "home_town") {
      this.setState(() => ({ home_town: value }));
    } else if (type === "university") {
      this.setState(() => ({ university: value }));
    }
  }
}

export default withRouter(RegisterForm);
