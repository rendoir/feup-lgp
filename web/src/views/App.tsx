import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "../components/header/Header";
import "../styles/App.css";

import Backoffice from "./Backoffice";
import Profile from "./Profile";
import Shop from "./Shop";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Route exact={true} path="/user/:username" component={Profile} />
          <Route exact={true} path="/admin" component={Backoffice} />
          <Route exact={true} path="/shop" component={Shop} />
        </Router>
      </div>
    );
  }
}

export default App;
