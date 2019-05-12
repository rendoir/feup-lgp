import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "../components/header/Header";
import "../styles/App.css";
import {
  defaultLanguage,
  LanguageContext,
  preferedLanguage,
  saveLanguage
} from "../utils/language";

import Backoffice from "./Backoffice";
import Talk from "./Talk";
import ErrorBoundary from "./ErrorBoundary";
import Feed from "./Feed";
import Login from "./Login";
import Notifications from "./Notifications";
import PostView from "./PostView";
import Profile from "./Profile";
import RegisterLanding from "./RegisterLanding";
import SearchResults from "./SearchResults";
import Shop from "./Shop";

type State = {
  language: string;
};

class App extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      language: preferedLanguage ? preferedLanguage : defaultLanguage
    };

    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  public render() {
    return (
      <div className="App">
        <LanguageContext.Provider value={this.state.language}>
          <Router>
            <ErrorBoundary>
              <Header title={"gNet"} onLanguageChange={this.onLanguageChange} />
              <Switch>
                <Route exact={true} path="/" component={Feed} />
                <Route path="/user/:id" component={Profile} />
                <Route path="/post/:id" component={PostView} />
                <Route path="/admin" component={Backoffice} />
                <Route path="/shop" component={Shop} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={RegisterLanding} />
                <Route path="/search" component={SearchResults} />
                <Route path="/conference/:id" component={Talk} />
                <Route path="/notifications" component={Notifications} />
              </Switch>
            </ErrorBoundary>
          </Router>
        </LanguageContext.Provider>
      </div>
    );
  }

  public onLanguageChange(lang: string) {
    this.setState({
      language: lang
    });
    saveLanguage(lang);
  }
}

export default App;
