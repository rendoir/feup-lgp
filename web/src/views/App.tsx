import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "../components/header/Header";
import "../styles/App.css";

import Feed from "./Feed";
import Backoffice from "./Backoffice";
import Profile from "./Profile";
import RegisterLanding from "./RegisterLanding";
import Shop from "./Shop";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Route exact path="/user/:username" component={Profile} />
          <Route exact path="/" component={Feed} />
          <Route exact path="/admin" component={Backoffice} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/register" component={RegisterLanding} />
        </Router>
      </div>
    );
  }
}

export default App;
