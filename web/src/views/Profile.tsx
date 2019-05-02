import axios from "axios";
import * as React from "react";
import Cookies from "universal-cookie";
import Avatar from "../components/Avatar/Avatar";
import Post from "../components/Post/Post";
import { apiSubscription } from "../utils/apiSubscription";
import { getApiURL } from "../utils/apiURL";
import { apiGetUserInteractions } from "../utils/apiUserInteractions";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

type State = {
  fetchingUserUserInteractions: boolean;
  userRate: number;
  userRateTotal: number;
  userRated: boolean;
  numberOfRatings: number;
  userSubscription: boolean;
  waitingRateRequest: boolean;
  waitingSubscriptionRequest: boolean;
  posts: any[];
  info: any;
  fetchingInfo: boolean;
};

const cookies = new Cookies();

class Profile extends React.Component<IProps, State> {
  public id: number; // Id of the profile's user
  public observerId: number; // Id of the user visiting the page

  constructor(props: any) {
    super(props);
    this.id = this.props.match.params.id; // Hardcoded while profile page is not complete
    this.observerId = 2; // cookies.get("user_id"); - change when login fetches user id properly

    this.state = {
      fetchingInfo: true,
      fetchingUserUserInteractions: true,
      info: {},
      numberOfRatings: 1,
      posts: [],
      userRate: 50,
      userRateTotal: 50,
      userRated: false,
      userSubscription: false,
      waitingRateRequest: false,
      waitingSubscriptionRequest: false
    };

    this.handleUserRate = this.handleUserRate.bind(this);
    this.handleUserSubscription = this.handleUserSubscription.bind(this);
  }

  public componentDidMount() {
    this.apiGetFeedUser();
    this.apiGetUserUserInteractions();
  }

  public handleUserRate(e: any) {
    if (this.state.userRated) {
      console.log("You already rated this user");
    } else {
      const rateTarget = e.target.id;

      const incrementRate = Number(this.state.numberOfRatings) + 1;
      this.setState({
        numberOfRatings: incrementRate
      });
      const userRating =
        (Number(this.state.userRateTotal) + parseInt(rateTarget, 10) * 20) /
        incrementRate;
      let body = {};
      body = {
        evaluator: this.observerId,
        newUserRating: userRating,
        rate: parseInt(rateTarget, 10)
      };

      console.log("User Rating updated to: ", userRating);
      const apiUrl = getApiURL(`/users/${this.id}/rate`);
      return axios
        .post(apiUrl, body)
        .then(() => {
          this.setState({
            userRateTotal:
              this.state.userRateTotal + parseInt(rateTarget, 10) * 20,
            userRated: true
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
        this.setState({
          fetchingUserUserInteractions: false,
          numberOfRatings: res.data.totalRatingsNumber,
          userRate: res.data.rate,
          userRateTotal: res.data.totalRatingAmount,
          userSubscription: res.data.subscription
        });
        if (!(this.state.userRate == null)) {
          this.setState({
            userRated: true
          });
        }
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
    const userRate =
      (this.state.userRateTotal / this.state.numberOfRatings) * 1.1;

    if (!this.state.userRated) {
      return (
        <div className="star-ratings-css-top" id="rate">
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

  public apiGetFeedUser() {
    let profileUrl = `${location.protocol}//${location.hostname}`;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      profileUrl += `:${process.env.REACT_APP_API_PORT}/users/${this.id}`;
    } else {
      profileUrl += "/api/users/" + this.id;
    }
    axios
      .get(profileUrl, {
        headers: {},
        params: {}
      })
      .then(res => {
        const postsComing = res.data;
        console.log(postsComing);

        postsComing.posts.map(
          (post: any, idx: any) => (
            (post.comments = postsComing.comments[idx]),
            (post.likers = postsComing.likers[idx]),
            (post.tags = postsComing.tags[idx]),
            (post.files = postsComing.files[idx])
          )
        );

        this.setState({
          fetchingInfo: false,
          info: postsComing.info,
          posts: postsComing.posts
        });
      })
      .catch(() => console.log("Failed to get posts"));
  }

  public getProfileName() {
    if (this.state.info.first_name && this.state.info.last_name) {
      return (
        <span>
          {" "}
          {this.state.info.first_name} {this.state.info.last_name}{" "}
        </span>
      );
    }
  }

  public getProfileEmail() {
    if (this.state.info.email) {
      return (
        <li>
          <i className="fas fa-envelope" /> {this.state.info.email}
        </li>
      );
    }
  }

  public getProfileTown() {
    if (this.state.info.home_town) {
      return (
        <li>
          <i className="fas fa-home" /> Lives in {this.state.info.home_town}
        </li>
      );
    }
  }

  public getProfileBio() {
    if (this.state.info.bio) {
      return this.state.info.bio;
    }
  }

  public getProfileUniv() {
    if (this.state.info.university) {
      return (
        <li>
          <i className="fas fa-graduation-cap" /> {this.state.info.university}
        </li>
      );
    }
  }

  public getProfileWork() {
    if (this.state.info.work) {
      return (
        <li>
          <i className="fas fa-briefcase" /> {this.state.info.work}
        </li>
      );
    }
  }
  public getWorkField() {
    return this.state.info.work_field;
  }

  public getProfilePosts() {
    const postsDiv = [];

    for (const post of this.state.posts) {
      postsDiv.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          likes={post.likes}
          likers={post.likers}
          comments={post.comments || []}
          tagsPost={post.tags}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
          files={post.files}
        />
      );
    }

    return postsDiv;
  }

  public render() {
    if (this.state.fetchingUserUserInteractions) {
      return null;
    }

    const subscribeIcon = this.state.userSubscription
      ? "fas fa-bell-slash"
      : "fas fa-bell";
    const subscribeBtnText = this.state.userSubscription
      ? "Unsubscribe"
      : "Subscribe";

    return (
      <div className="Profile">
        <main id="profile" className="container">
          <div id="top-div" className="w-100 mt-5">
            <aside className="profile-card">
              <header>
                <img
                  id="cover-img"
                  src="https://www.freewebheaders.com/wordpress/wp-content/gallery/cactus-flowers/pink-cactus-flowers-header-9414.jpg"
                />
                <div id="avatar-img">
                  <Avatar
                    title="Admin Admino"
                    placeholder="empty"
                    size={250}
                    image="http://cosmicgirlgames.com/images/games/morty.gif"
                  />
                </div>
                <h1>{this.getProfileName()}</h1>
                <h2>{this.getWorkField()}</h2>
              </header>

              <div className="mx-5 my-4">
                <p>{this.getProfileBio()}</p>
              </div>

              <div className="mx-5 my-4">
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
              </div>

              <div className="mx-5 my-4">
                <div className="buttonSubscribe">
                  <button
                    id="subscribeBtn"
                    onClick={this.handleUserSubscription}
                  >
                    <i className={subscribeIcon} />
                    <span>{subscribeBtnText}</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
          <div id="bottom-div" className="w-100 mt-5">
            <div id="left-div" className="p-3">
              <ul className="p-0 m-0">
                {this.getProfileWork()}
                {this.getProfileUniv()}
                {this.getProfileTown()}
                {this.getProfileEmail()}
              </ul>
            </div>
            <div id="right-div">
              <div className="col-lg-14">{this.getProfilePosts()}</div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Profile;
