import * as React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Header from "../components/header/Header";
import "../styles/App.css";

import Profile from "./Profile";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Route exact path="/user/:username" component={Profile} />
        </Router>
      </div>
    );
  }
}

export default App;
