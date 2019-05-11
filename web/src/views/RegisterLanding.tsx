import * as React from "react";
import { dictionary, LanguageContext } from "../utils/language";

class RegisterLanding extends React.Component {
  static contextType = LanguageContext;

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
            <div className="mt-5 text-center">
              <button type="submit" className="btn btn-primary">
                {dictionary.signup[this.context]}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterLanding;
