import * as React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Header from "../components/header/Header";
import "../styles/App.css";

import Profile from "./Profile";
import PostView from "./PostView";
import Feed from "./Feed";
import Backoffice from "./Backoffice";
import Shop from "./Shop";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Route exact path="/user/:username" component={Profile} />
          <Route exact path="/post/:id" component={PostView} />
          <Route exact path="/admin" component={Backoffice} />
          <Route exact path="/" component={Feed} />
          <Route exact path="/shop" component={Shop} />
        </Router>
      </div>
    );
  }
}

export default App;
