import * as React from "react";
import MyButton from "../components/Button";
import "../stylesheets/App.css";
import Navbar from "./navbar/Navbar";

import logo from "../images/logo.svg";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Navbar />
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <MyButton prop2={2} prop3={5} prop4={"option1"} />
      </div>
    );
  }
}

export default App;
