import axios from "axios";
import * as React from "react";
import { getApiURL } from "../utils/apiURL";
import { dictionary, LanguageContext } from "../utils/language";

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

class RegisterLanding extends React.Component<{}, State> {
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

  public handlePress(e) {
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

      const apiUrl = getApiURL(`/users/`);
      return axios
        .post(apiUrl, body)
        .then(() => {
          console.log("Registration completed, redirecting to feed!");
          this.setState({
            loading: false
          });
          window.location.href = "/";
        })
        .catch(() => {
          console.log("Register system failed");
        });
    } else {
      console.log("Fill the necessary inputs!");
      e.preventDefault();
    }
  }

  public validate(type, value) {
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

  public render() {
    return (
      <div
        className="row mt-5 d-flex justify-content-center"
        id="register-landing"
      >
        <div className="col-sm-4 mt-5" id="landing-info">
          <h2>{dictionary.website_description[this.context]}</h2>
          <div className="row mt-5">
            <div className="col-sm-1 col-md-1 col-lg-1" />
            <h4>{dictionary.document_sharing[this.context]}</h4>
            <div className="col-sm-2 col-md-2 col-lg-2">
              <i className="far fa-folder-open fa-lg" />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-sm-1 col-md-1 col-lg-1" />
            <h4>{dictionary.comment_encourage[this.context]}</h4>
            <div className="col-sm-2 col-md-2 col-lg-2">
              <i className="far fa-comment-dots fa-lg" />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-sm-1 col-md-1 col-lg-1" />
            <h4>{dictionary.search_find[this.context]}</h4>
            <div className="col-sm-2 col-md-2 col-lg-2">
              <i className="fas fa-search fa-lg" />
            </div>
          </div>
          <h2 className="mt-5 mb-5">
            {dictionary.website_description2[this.context]}
          </h2>
        </div>
        <div className="col-9 col-sm-8 col-md-6 col-lg-4 mt-5">
          <form>
            <h3 className="text-center">{dictionary.signup[this.context]}</h3>
            <div className="mt-5 form-row">
              <div className="form-group col-6">
                <input
                  type="text"
                  className="form-control"
                  id="inputFirstName"
                  placeholder={dictionary.first_name[this.context]}
                  onChange={e => this.validate("first_name", e.target.value)}
                />
                <p id="firstNameErrorMessage">
                  {dictionary.invalid_name[this.context]}
                </p>
              </div>
              <div className="form-group col-6">
                <input
                  type="text"
                  className="form-control"
                  id="inputLastName"
                  placeholder={dictionary.last_name[this.context]}
                  onChange={e => this.validate("last_name", e.target.value)}
                />
                <p id="lastNameErrorMessage">
                  {dictionary.invalid_name[this.context]}
                </p>
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
                placeholder="Email"
                onChange={e => this.validate("email", e.target.value)}
              />
              <p id="emailErrorMessage">
                {dictionary.invalid_email[this.context]}
              </p>
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
                onChange={e =>
                  this.validate("confirm_password", e.target.value)
                }
              />
              <p id="confirmPasswordErrorMessage">
                {dictionary.invalid_confirm_password[this.context]}
              </p>
            </div>
            <div className="mt-5 text-center">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.handlePress}
              >
                {dictionary.register[this.context]}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterLanding;
