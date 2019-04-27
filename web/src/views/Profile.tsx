import * as React from "react";
import Cookies from "universal-cookie";
import { apiSubscription } from "../utils/apiSubscription";
import { apiGetUserInteractions } from "../utils/apiUserInteractions";
import { getApiURL } from "../utils/apiURL";
import axios from "axios";

type State = {
  fetchingUserUserInteractions: boolean;
  userRate: number;
  userRateTotal: number;
  userRated: boolean;
  numberOfRatings: number;
  userSubscription: boolean;
  waitingRateRequest: boolean;
  waitingSubscriptionRequest: boolean;
};

const cookies = new Cookies();

class Profile extends React.Component<{}, State> {
  public id: number; // Id of the profile
  public observerId: number; // Id of the user visiting the page

  constructor(props: any) {
    super(props);

    this.id = 4; // Hardcoded while profile page is not complete
    this.observerId = 1; // cookies.get("user_id"); - change when login fetches user id properly

    this.state = {
      fetchingUserUserInteractions: true,
      userRate: 50,
      userRateTotal: 50,
      userRated: false,
      numberOfRatings: 1,
      userSubscription: false,
      waitingRateRequest: false,
      waitingSubscriptionRequest: false
    };

    this.handleUserRate = this.handleUserRate.bind(this);
    this.handleUserSubscription = this.handleUserSubscription.bind(this);
  }

  public componentDidMount() {
    this.apiGetUserUserInteractions();
  }

  public handleUserRate(e: any) {
    if (this.state.userRated) {
      console.log("You already rated this user");
    } else {
      console.log("RATE LOGGED USER ID: ", this.observerId);
      const rateTarget = e.target.id;
      console.log("You rated: ", parseInt(rateTarget, 10));

      console.log("GOD DAMN IT: ", this.state.numberOfRatings);
      var incrementRate = Number(this.state.numberOfRatings) + 1;
      console.log("i beg you: ", incrementRate);
      this.setState({
        numberOfRatings: incrementRate
      });
      console.log("because: ", this.state.numberOfRatings);
      var userRating =
        (Number(this.state.userRateTotal) + parseInt(rateTarget, 10) * 20) /
        incrementRate;
      console.log("FIM??? ", userRating);
      let body = {};
      body = {
        evaluator: this.observerId,
        rate: parseInt(rateTarget, 10),
        newUserRating: userRating,
        target_user: this.id
      };
      console.log(
        "neww: ",
        (this.state.userRateTotal + parseInt(rateTarget, 10) * 20) /
          this.state.numberOfRatings
      );

      const apiUrl = getApiURL(`/users/rateUser`);
      return axios
        .post(apiUrl, body)
        .then(() => {
          console.log("WTF", this.state.numberOfRatings);
          this.setState({
            userRated: true,
            userRateTotal:
              this.state.userRateTotal + parseInt(rateTarget, 10) * 20
          });
        })
        .catch(() => {
          console.log("Rating system failed");
        });
    }
  }

  public handleUserSubscription() {
    if (this.state.waitingSubscriptionRequest) {
      console.log(
        "Error trying subscription action! Waiting for response from last request"
      );
      return;
    }

    const endpoint = this.state.userSubscription ? "unsubscribe" : "subscribe";
    const subscriptionState = !this.state.userSubscription;

    this.setState({
      userSubscription: subscriptionState,
      waitingSubscriptionRequest: true
    });

    this.apiSubscription(endpoint);
  }

  public apiSubscription(endpoint: string) {
    apiSubscription("users", endpoint, this.observerId, this.id)
      .then(() => {
        this.setState({
          waitingSubscriptionRequest: false
        });
      })
      .catch(() => {
        this.setState({
          userSubscription: endpoint === "unsubscribe",
          waitingSubscriptionRequest: false
        });
        console.log("Subscription system failed");
      });
  }

  public apiGetUserUserInteractions() {
    apiGetUserInteractions("users", this.observerId, this.id)
      .then(res => {
        console.log("FUCK SAKE:", res.data.totalRatingsNumber);
        this.setState({
          fetchingUserUserInteractions: false,
          userRate: res.data.rate,
          numberOfRatings: res.data.totalRatingsNumber,
          userRateTotal: res.data.totalRatingAmount,
          userSubscription: res.data.subscription
        });
        if (!(this.state.userRate == null)) {
          console.log("btch", res.data.rate);
          this.setState({
            userRated: true
          });
        }
        console.log("user rate: ", this.state.userRate);
        console.log("total ratings: ", this.state.numberOfRatings);
        console.log("user rating: ", this.state.userRateTotal);
      })
      .catch(() => console.log("Failed to get user-user interactions"));
  }

  public getUserInteractionButtons() {
    const subscribeIcon = this.state.userSubscription
      ? "fas fa-bell-slash"
      : "fas fa-bell";
    const subscribeBtnText = this.state.userSubscription
      ? "Unsubscribe"
      : "Subscribe";

    return (
      <div>
        <button />
        <fieldset className="rate">
          <div className="star-ratings-css">
            {this.handleStars()}
            <div className="star-ratings-css-bottom">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
          </div>
        </fieldset>
        <button onClick={this.handleUserSubscription}>
          <i className={subscribeIcon} />
          <span>{subscribeBtnText}</span>
        </button>
      </div>
    );
  }

  public handleStars() {
    console.log("q" + this.state.userRateTotal);
    console.log("???? ", this.state.numberOfRatings);
    const userRate =
      (this.state.userRateTotal / this.state.numberOfRatings) * 1.1;
    console.log("usuertotal: ", this.state.userRateTotal);
    console.log("numberofratings: ", this.state.numberOfRatings);
    console.log("r" + userRate / 1.1);

    if (!this.state.userRated) {
      return (
        <div className="star-ratings-css-top" id="rate-user">
          <span id="5" onClick={this.handleUserRate}>
            ★
          </span>
          <span id="4" onClick={this.handleUserRate}>
            ★
          </span>
          <span id="3" onClick={this.handleUserRate}>
            ★
          </span>
          <span id="2" onClick={this.handleUserRate}>
            ★
          </span>
          <span id="1" onClick={this.handleUserRate}>
            ★
          </span>
          <p>Rate this user</p>
        </div>
      );
    } else {
      return (
        <div className="star-ratings-css-top" style={{ width: userRate }}>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      );
    }
  }
  public render() {
    if (this.state.fetchingUserUserInteractions) {
      return null;
    }

    return (
      <div>
        <h3>
          This text is being shown due to some google errors on the page's html
        </h3>
        {this.getUserInteractionButtons()}
      </div>
    );

    return (
      <div className="Profile">
        <main id="profile" className="container">
          <div id="top-div" className="w-100 mt-5">
            <aside className="profile-card">
              <header>
                <img id="cover-img" src="http://via.placeholder.com/800x200" />
                <img id="avatar-img" src="http://via.placeholder.com/150x150" />
                <h1>John Doe</h1>
                <h2>Cardiologist</h2>
                <div className="rating">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star-half-alt" />
                  <i className="far fa-star" />
                </div>
              </header>

              <div className="mx-5 my-4">
                <p>
                  Cardiologist at the London Hospital. I am a certified surgeon
                  with over 30 years of experience.
                </p>
              </div>
            </aside>
          </div>
          <div id="bottom-div" className="w-100 mt-5">
            <div id="left-div" className="p-3">
              <ul className="p-0 m-0">
                <li>
                  <i className="fas fa-briefcase" />
                  Cardiologist at London Hospital
                </li>
                <li>
                  <i className="fas fa-graduation-cap" />
                  Studies Neurobiology at FMUP
                </li>
                <li>
                  <i className="fas fa-graduation-cap" />
                  Studied Cardiology at FMUP
                </li>
                <li>
                  <i className="fas fa-home" />
                  Lives in London, England
                </li>
                <li>
                  <i className="fas fa-home" />
                  From Liverpool, England
                </li>
                <li>
                  <i className="fas fa-envelope" />
                  johndoe@mail.com
                </li>
                <li>
                  <i className="far fa-window-maximize" />
                  www.johndoe.com
                </li>
              </ul>
            </div>
            <div id="right-div">
              <div className="post mb-4">
                <div className="post-header">
                  <img
                    className="post-avatar"
                    src="http://via.placeholder.com/50x50"
                  />
                  <p className="post-author">John Doe</p>
                  <p className="post-date">02-03-2019</p>
                </div>
                <div className="post-content">
                  <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum."
                  </p>
                </div>
                <div className="post-stats">
                  <span>12 likes</span>
                  <span>6 comments</span>
                </div>
                <div className="post-actions">
                  <button>
                    <i className="fas fa-thumbs-up" />
                    <span>Like</span>
                  </button>
                  <button>
                    <i className="far fa-comment-alt" />
                    <span>Comment</span>
                  </button>
                  <button>
                    <i className="fas fa-share-square" />
                    <span>Share</span>
                  </button>
                </div>
                <div className="post-comment-section">
                  <div className="post-comments" />
                  <div className="post-add-comment">
                    <div>
                      <img
                        className="post-avatar"
                        src="http://via.placeholder.com/50x50"
                      />
                    </div>
                    <textarea
                      className="form-control ml-4 mr-3"
                      placeholder="Insert your comment..."
                    />
                    <button className="submit-comment px-2 py-1">
                      <i className="fas fa-chevron-circle-right" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="post mb-4">
                <div className="post-header">
                  <img
                    className="post-avatar"
                    src="http://via.placeholder.com/50x50"
                  />
                  <p className="post-author">John Doe</p>
                  <p className="post-date">20-02-2019</p>
                </div>
                <div className="post-content">
                  <p>Look at this awesome photo</p>
                </div>
                <div className="post-content">
                  <img src="http://via.placeholder.com/800x400" />
                </div>
                <div className="post-stats">
                  <span>35 likes</span>
                  <span>14 comments</span>
                </div>
                <div className="post-actions">
                  <button className="liked">
                    <i className="fas fa-thumbs-up" />
                    <span>Like</span>
                  </button>
                  <button>
                    <i className="far fa-comment-alt" />
                    <span>Comment</span>
                  </button>
                  <button>
                    <i className="fas fa-share-square" />
                    <span>Share</span>
                  </button>
                </div>
                <div className="post-comment-section">
                  <div className="post-comments">
                    <div className="post-comment my-3">
                      <div className="comment-header">
                        <div>
                          <img
                            className="post-avatar"
                            src="http://via.placeholder.com/50x50"
                          />
                        </div>
                        <div>
                          <div className="comment-text">
                            <p>
                              <span className="post-author">John Doe</span>This
                              is a comment.
                            </p>
                          </div>
                          <div className="comment-social">
                            <button className="comment-action">Like</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="post-comment my-3">
                      <div className="comment-header">
                        <div>
                          <img
                            className="post-avatar"
                            src="http://via.placeholder.com/50x50"
                          />
                        </div>
                        <div>
                          <div className="comment-text">
                            <p>
                              <span className="post-author">John Doe</span>This
                              is a super big comment just to test some stuff and
                              has absolutely no content.
                            </p>
                            <span className="comment-detail">
                              <i className="fas fa-thumbs-up" />2
                            </span>
                          </div>
                          <div className="comment-social">
                            <button className="comment-action">Like</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="post-add-comment">
                    <div>
                      <img
                        className="post-avatar"
                        src="http://via.placeholder.com/50x50"
                      />
                    </div>
                    <textarea
                      className="form-control ml-4 mr-3"
                      placeholder="Insert your comment..."
                    />
                    <button className="submit-comment px-2 py-1">
                      <i className="fas fa-chevron-circle-right" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="post mb-4">
                <div className="post-header">
                  <img
                    className="post-avatar"
                    src="http://via.placeholder.com/50x50"
                  />
                  <p className="post-author">John Doe</p>
                  <p className="post-date">01-01-2019</p>
                </div>
                <div className="post-content">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/Y6U728AZnV0"
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                  />
                </div>
                <div className="post-stats">
                  <span>48 likes</span>
                  <span>21 comments</span>
                </div>
                <div className="post-actions">
                  <button>
                    <i className="fas fa-thumbs-up" />
                    <span>Like</span>
                  </button>
                  <button>
                    <i className="far fa-comment-alt" />
                    <span>Comment</span>
                  </button>
                  <button>
                    <i className="fas fa-share-square" />
                    <span>Share</span>
                  </button>
                </div>
                <div className="post-comment-section">
                  <div className="post-comments" />
                  <div className="post-add-comment">
                    <div>
                      <img
                        className="post-avatar"
                        src="http://via.placeholder.com/50x50"
                      />
                    </div>
                    <textarea
                      className="form-control ml-4 mr-3"
                      placeholder="Insert your comment..."
                    />
                    <button className="submit-comment px-2 py-1">
                      <i className="fas fa-chevron-circle-right" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Profile;
