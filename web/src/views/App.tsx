import * as React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Header from "../components/header/Header";
import "../styles/App.css";

import Profile from "./Profile";
import Backoffice from "./Backoffice";
import Shop from "./Shop";
import RegisterLanding from "./RegisterLanding";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Route exact path="/user/:username" component={Profile} />
          <Route exact path="/admin" component={Backoffice} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/register" component={RegisterLanding} />
        </Router>
      </div>
    );
  }
}

export default App;
