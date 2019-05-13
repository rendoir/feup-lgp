import * as React from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import { dictionary, LanguageContext } from "../utils/language";
import withoutAuth from "../utils/withoutAuth";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

class Landing extends React.Component {
  public static contextType = LanguageContext;

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
          <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
            <Tab eventKey="login" title={dictionary.login[this.context]}>
              <LoginForm />
            </Tab>
            <Tab eventKey="register" title={dictionary.signup[this.context]}>
              <RegisterForm />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withoutAuth(Landing);
