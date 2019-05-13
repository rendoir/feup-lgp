import * as React from "react";
import { dictionary, LanguageContext } from "../../utils/language";

class RegisterForm extends React.Component {
  public static contextType = LanguageContext;

  public render() {
    return (
      <form className="mt-3">
        <div className="form-row">
          <div className="form-group col-6">
            <input
              type="text"
              className="form-control"
              id="inputFirstName"
              placeholder={dictionary.first_name[this.context]}
            />
          </div>
          <div className="form-group col-6">
            <input
              type="text"
              className="form-control"
              id="inputLastName"
              placeholder={dictionary.last_name[this.context]}
            />
          </div>
        </div>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control col"
            id="inputInstituicao"
            placeholder={dictionary.workplace_institution[this.context]}
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control col"
            id="inputProfissaoCurso"
            placeholder={dictionary.profession_field[this.context]}
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="email"
            className="form-control col"
            id="inputEmail"
            placeholder="E-mail"
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="password"
            className="form-control col"
            id="inputPassword"
            placeholder={dictionary.password[this.context]}
          />
        </div>
        <div className="mt-3 text-center">
          <button type="submit" className="btn btn-primary">
            {dictionary.signup[this.context]}
          </button>
        </div>
      </form>
    );
  }
}

export default RegisterForm;
