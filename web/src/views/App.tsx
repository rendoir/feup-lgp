import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "../components/header/Header";
import "../styles/App.css";

import Backoffice from "./Backoffice";
import Feed from "./Feed";
import Profile from "./Profile";
import RegisterLanding from "./RegisterLanding";
import Shop from "./Shop";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Route exact={true} path="/user/:username" component={Profile} />
          <Route exact={true} path="/" component={Feed} />
          <Route exact={true} path="/admin" component={Backoffice} />
          <Route exact={true} path="/shop" component={Shop} />
          <Route exact={true} path="/register" component={RegisterLanding} />
        </Router>
      </div>
    );
  }
}

export default App;
