import * as React from "react";
import MyButton from "../components/Button";
import Header from "../components/header/Header";
import "../stylesheets/App.css";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header />
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <MyButton prop2={2} prop3={5} prop4={"option1"} />
      </div>
    );
  }
}

export default App;
