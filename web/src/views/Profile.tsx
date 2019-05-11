import * as React from "react";
import Cookies from "universal-cookie";
import Avatar from "../components/Avatar/Avatar";
import Post from "../components/Post/Post";
import { apiSubscription } from "../utils/apiSubscription";
import { apiGetUserInteractions } from "../utils/apiUserInteractions";
import axiosInstance from "../utils/axiosInstance";

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
  user: any;
  fetchingInfo: boolean;
};

const cookies = new Cookies();

class Profile extends React.Component<IProps, State> {
  public id: number; // Id of the profile's user
  public observerId: number; // Id of the user visiting the page

  constructor(props: any) {
    super(props);
    this.id = this.props.match.params.id; // Hardcoded while profile page is not complete
    this.observerId = 1; // cookies.get("user_id"); - change when login fetches user id properly

    this.state = {
      fetchingInfo: true,
      fetchingUserUserInteractions: true,
      numberOfRatings: 1,
      posts: [],
      user: {},
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

  private handleUserRate(e: any) {
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
      const apiUrl = `/users/${this.id}/rate`;
      return axiosInstance
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

  private handleUserSubscription() {
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

  private apiSubscription(endpoint: string) {
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

  private apiGetUserUserInteractions() {
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

  private handleStars() {
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

  private apiGetFeedUser() {
    axiosInstance
      .get(`/users/${this.id}`)
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
          posts: postsComing.posts,
          user: postsComing.user
        });
      })
      .catch(() => console.log("Failed to get posts"));
  }

  private getProfileName() {
    if (this.state.user.first_name && this.state.user.last_name) {
      return (
        <span>
          {" "}
          {this.state.user.first_name} {this.state.user.last_name}{" "}
        </span>
      );
    }
  }

  private getProfileEmail() {
    if (this.state.user.email) {
      return (
        <li>
          <i className="fas fa-envelope" /> {this.state.user.email}
        </li>
      );
    }
  }

  private getProfileTown() {
    if (this.state.user.home_town) {
      return (
        <li>
          <i className="fas fa-home" /> Lives in {this.state.user.home_town}
        </li>
      );
    }
  }

  private getProfileBio() {
    if (this.state.user.bio) {
      return this.state.user.bio;
    }
  }

  private getProfileUniv() {
    if (this.state.user.university) {
      return (
        <li>
          <i className="fas fa-graduation-cap" /> {this.state.user.university}
        </li>
      );
    }
  }

  private getProfileWork() {
    if (this.state.user.work) {
      return (
        <li>
          <i className="fas fa-briefcase" /> {this.state.user.work}
        </li>
      );
    }
  }
  private getWorkField() {
    return this.state.user.work_field;
  }

  private getProfilePosts() {
    const postsDiv: any[] = [];

    for (const post of this.state.posts) {
      postsDiv.push(
        <Post
          key={post.id}
          id={post.id}
          author={post.first_name + " " + post.last_name}
          text={post.content}
          user_id={post.user_id}
          likes={post.likes}
          likers={post.likers}
          comments={post.comments || []}
          tags={post.tags}
          title={post.title}
          date={post.date_created.replace(/T.*/gi, "")}
          visibility={post.visibility}
          files={post.files}
        />
      );
    }

    return postsDiv;
  }
}

export default Profile;
