import * as React from "react";

class RegisterLanding extends React.Component {
  public render() {
    return (
      <div
        className="row mt-5 d-flex justify-content-center"
        id="register-landing"
      >
        <div className="col-sm-4 mt-5" id="landing-info">
          <h2>
            Social Network for medicine professionals and medicin students.
          </h2>
          <div className="row mt-5">
            <div className="col-sm-1 col-md-1 col-lg-1" />
            <h4>Document Sharing</h4>
            <div className="col-sm-2 col-md-2 col-lg-2">
              <i className="far fa-folder-open fa-lg" />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-sm-1 col-md-1 col-lg-1" />
            <h4>Comment and Encourage</h4>
            <div className="col-sm-2 col-md-2 col-lg-2">
              <i className="far fa-comment-dots fa-lg" />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-sm-1 col-md-1 col-lg-1" />
            <h4>Search and Find</h4>
            <div className="col-sm-2 col-md-2 col-lg-2">
              <i className="far fa-search fa-lg" />
            </div>
          </div>
          <h2 className="mt-5 mb-5">
            Thesis, clinical cases, video conferences...
          </h2>
        </div>
        <div className="col-9 col-sm-8 col-md-6 col-lg-4 mt-5">
          <form>
            <h3 className="text-center">Sign up</h3>
            <div className="mt-5 form-row">
              <div className="form-group col-6">
                <input
                  type="text"
                  className="form-control"
                  id="inputFirstName"
                  placeholder="First Name"
                />
              </div>
              <div className="form-group col-6">
                <input
                  type="text"
                  className="form-control"
                  id="inputLastName"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="form-group mt-3">
              <input
                type="text"
                className="form-control col"
                id="inputInstituicao"
                placeholder="Workplace/Institution"
              />
            </div>
            <div className="form-group mt-3">
              <input
                type="text"
                className="form-control col"
                id="inputProfissaoCurso"
                placeholder="Profession/Field"
              />
            </div>
            <div className="form-group mt-3">
              <input
                type="email"
                className="form-control col"
                id="inputEmail"
                placeholder="Institucional E-mail"
              />
            </div>
            <div className="form-group mt-3">
              <input
                type="password"
                className="form-control col"
                id="inputPassword"
                placeholder="Password"
              />
            </div>
            <div className="mt-5 text-center">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterLanding;
