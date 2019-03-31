import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "@fortawesome/fontawesome-free/css/all.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import "./stylesheets/index.css";
import App from "./views/App";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
