import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "../components/header/Header";
import "../styles/App.css";

import Backoffice from "./Backoffice";
import Conference from "./Conference";
import ErrorBoundary from "./ErrorBoundary";
import Feed from "./Feed";
import Login from "./Login";
import PostView from "./PostView";
import Profile from "./Profile";
import RegisterLanding from "./RegisterLanding";
import SearchResults from "./SearchResults";
import Shop from "./Shop";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Router>
          <ErrorBoundary>
            <Header title={"gNet"} />
            <Switch>
              <Route exact={true} path="/" component={Feed} />
              <Route path="/user/:id" component={Profile} />
              <Route path="/post/:id" component={PostView} />
              <Route path="/admin" component={Backoffice} />
              <Route path="/shop" component={Shop} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={RegisterLanding} />
              <Route path="/search" component={SearchResults} />
              <Route path="/conference/:id" component={Conference} />
            </Switch>
          </ErrorBoundary>
        </Router>
      </div>
    );
  }
}

export default App;
