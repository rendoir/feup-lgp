import * as React from "react";
import { MouseEvent } from "react";

import Avatar from "../components/Avatar/Avatar";
import InfiniteScroll from "../components/InfiniteScroll/InfiniteScroll";
import Post from "../components/Post/Post";
import { apiSubscription } from "../utils/apiSubscription";
import { apiGetUserInteractions } from "../utils/apiUserInteractions";
import axiosInstance from "../utils/axiosInstance";
import { dictionary, LanguageContext } from "../utils/language";

import AuthHelperMethods from "../utils/AuthHelperMethods";
import withAuth from "../utils/withAuth";

import { Button } from "../components";
import {
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalProvider
} from "../components/Modal/index";
import Modal from "../components/Modal/Modal";
import ProfileModal from "../components/ProfileModal/ProfileModal";

import { isNull } from "util";

import { Request, Step } from "../components/ProfileModal/types";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

type State = {
  fetchingUserUserInteractions: boolean;
  isOpen: boolean;
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
  request: {
    avatar?: File;
    email: string;
    first_name: string;
    home_town: string;
    last_name: string;
    loading: boolean;
    old_password: string;
    password: string;
    confirm_password: string;
    university: string;
    work: string;
    work_field: string;
  };
  step: Step;
};

class Profile extends React.Component<IProps, State> {
  public static contextType = LanguageContext;

  public id: number; // Id of the profile's user
  private auth = new AuthHelperMethods();

  constructor(props: any) {
    super(props);
    this.id = this.props.match.params.id;

    this.state = {
      fetchingInfo: true,
      fetchingUserUserInteractions: true,
      isOpen: false,
      numberOfRatings: 1,
      posts: [],
      request: {
        avatar: undefined,
        confirm_password: "",
        email: "",
        first_name: "",
        home_town: "",
        last_name: "",
        loading: false,
        old_password: "",
        password: "",
        university: "",
        work: "",
        work_field: ""
      },
      step: "profile",
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
    this.apiGetUser();
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
      ? dictionary.unsubscribe_action[this.context]
      : dictionary.subscribe_action[this.context];

    let profileUrl = `${location.protocol}//${location.hostname}`;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      profileUrl += `:${process.env.REACT_APP_API_PORT}/users/${this.id}/posts`;
    } else {
      profileUrl += "/api/users/" + this.id + "/posts";
    }
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
                    image={this.state.user.avatar}
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
              {this.getEditButton()}
              <ul className="p-0 m-0">
                {this.getProfileWork()}
                {this.getProfileUniv()}
                {this.getProfileTown()}
                {this.getProfileEmail()}
                {this.state.isOpen ? (
                  <ProfileModal
                    pending={false}
                    onSubmit={this.apiEditProfile}
                    onStepChange={step => this.setState({ step })}
                    maxGroupSize={5}
                    request={this.state.request}
                    onRequestChange={request => this.setState({ request })}
                    onClose={this.resetState}
                    autoFocus={false}
                    step={"profile"}
                  />
                ) : null}
              </ul>
            </div>
            <div id="right-div">
              <div className={"col-lg-14"}>
                <InfiniteScroll requestUrl={profileUrl} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  private resetState = () => {
    this.setState({
      isOpen: false,
      request: {
        avatar: undefined,
        confirm_password: "",
        email: this.state.user.email,
        first_name: this.state.user.first_name,
        home_town: this.state.user.home_town,
        last_name: this.state.user.last_name,
        loading: false,
        old_password: "",
        password: "",
        university: this.state.user.university,
        work: isNull(this.state.user.work_field)
          ? ""
          : this.state.user.work_field,
        work_field: isNull(this.state.user.work_field)
          ? ""
          : this.state.user.work_field
      },
      step: "profile"
    });
  };

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

    const method = this.state.userSubscription ? "delete" : "post";
    const subscriptionState = !this.state.userSubscription;

    this.setState({
      userSubscription: subscriptionState,
      waitingSubscriptionRequest: true
    });

    this.apiSubscription(method);
  }

  private apiSubscription(method: string) {
    apiSubscription("users", method, this.id)
      .then(() => {
        this.setState({
          waitingSubscriptionRequest: false
        });
      })
      .catch(() => {
        this.setState({
          userSubscription: method === "delete",
          waitingSubscriptionRequest: false
        });
        console.log("Subscription system failed");
      });
  }

  private apiEditProfile = (request: Request) => {
    if (this.auth.getUserPayload().id !== this.id) {
      return;
    }

    const formData = new FormData();

    formData.append("author", String(this.auth.getUserPayload().id));

    formData.append("email", request.email);

    if (
      request.old_password !== "" &&
      request.password === request.confirm_password
    ) {
      formData.append("old_password", request.old_password);
      formData.append("password", request.password);
    }

    if (request.avatar !== undefined) {
      formData.append("avatar", request.avatar);
    }

    formData.append("first_name", request.first_name);
    formData.append("last_name", request.last_name);

    formData.append("work", request.work);
    formData.append("work_field", request.work_field);
    formData.append("home_town", request.home_town);
    formData.append("university", request.university);

    axiosInstance
      .post(`/users/${this.id}/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        console.log("Edited user info - reloading page...");
        window.location.reload();
        this.resetState();
      })
      .catch(
        error => console.log("Failed to edit user info: ") + error.response
      );
  };

  private apiGetUserUserInteractions() {
    apiGetUserInteractions("users", this.id)
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

  private apiGetUser() {
    axiosInstance
      .get(`/users/${this.id}`)
      .then(res => {
        this.setState({
          request: {
            avatar: undefined,
            confirm_password: "",
            email: res.data.user.email,
            first_name: res.data.user.first_name,
            home_town: res.data.user.home_town,
            last_name: res.data.user.last_name,
            loading: false,
            old_password: "",
            password: "",
            university: res.data.user.university,
            work: res.data.user.work,
            work_field: res.data.user.work_field
          },
          user: res.data.user
        });
      })
      .catch(() => console.log("Failed to get posts"));
  }

  private handleEditProfile = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ isOpen: true });
  };

  private getEditButton() {
    if (this.auth.getUserPayload().id === this.id) {
      return (
        <span className="edit-icon" onClick={this.handleEditProfile}>
          <i className="fas fa-pencil-alt" />
        </span>
      );
    }
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
          <i className="fas fa-home" /> {this.state.user.home_town}
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
          content={post.content}
          user_id={post.user_id}
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

export default withAuth(Profile);
