import * as React from "react";
import Cookies from "universal-cookie";
import "../styles/Notifications.css";

const cookies = new Cookies();

class Notifications extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-primary">
            <div className="panel-body">
              <div className="panel-title">
                <h3>Notifications</h3>
              </div>
              <ul className="list-group">
                <li className="list-group-item">
                  <div className="checkbox">
                    <label htmlFor="checkbox">
                      The user x has asked you to join conference y.
                    </label>
                  </div>
                  <div className="pull-right action-buttons">
                    <span className="far fa-check-square fa-2x">
                      <p className="tooltipText">Join</p>
                    </span>
                    <span className="far fa-minus-square fa-2x">
                      <p>Refuse</p>
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="checkbox">
                    <label htmlFor="checkbox">
                      The user x has asked you to join conference y.
                    </label>
                  </div>
                  <div className="pull-right action-buttons">
                    <span className="far fa-check-square fa-2x">
                      <p className="tooltipText">Join</p>
                    </span>
                    <span className="far fa-minus-square fa-2x">
                      <p>Refuse</p>
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="checkbox">
                    <label htmlFor="checkbox">
                      The user x has asked you to join conference y.
                    </label>
                  </div>
                  <div className="pull-right action-buttons">
                    <span className="far fa-check-square fa-2x">
                      <p className="tooltipText">Join</p>
                    </span>
                    <span className="far fa-minus-square fa-2x">
                      <p>Refuse</p>
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="checkbox">
                    <label htmlFor="checkbox">
                      The user x has asked you to join conference y.
                    </label>
                  </div>
                  <div className="pull-right action-buttons">
                    <span className="far fa-check-square fa-2x">
                      <p className="tooltipText">Join</p>
                    </span>
                    <span className="far fa-minus-square fa-2x">
                      <p>Refuse</p>
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="checkbox">
                    <label htmlFor="checkbox">
                      The user x has asked you to join conference Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Etiam eget
                      ligula eu lectus lobortis condimentum. Aliquam nonummy
                      auctor massa. Pellentesque habitant morbi tristique
                      senectus et netus et malesuada fames ac turpis egestas.
                      Nulla at risus. Quisque purus magna
                    </label>
                  </div>
                  <div className="pull-right action-buttons">
                    <span className="far fa-check-square fa-2x">
                      <p className="tooltipText">Join</p>
                    </span>
                    <span className="far fa-minus-square fa-2x">
                      <p>Refuse</p>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Notifications;
