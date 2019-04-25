import * as React from "react";
import Cookies from "universal-cookie";
import { apiGetUserInteractions } from "../utils/apiUserInteractions";

type State = {
  fetchingUserUserInteractions: boolean;
  userRate: number;
  userSubscription: boolean;
};

const cookies = new Cookies();

class Profile extends React.Component<{}, State> {
  public id: number; // Id of the profile
  public observerId: number; // Id of the user visiting the page

  constructor(props: any) {
    super(props);

    this.id = 3; // Hardcoded while profile page is not complete
    this.observerId = 1; // cookies.get("user_id"); - change when login fetches user id properly

    this.state = {
      fetchingUserUserInteractions: true,
      userRate: 0,
      userSubscription: false
    };

    this.handleUserRate = this.handleUserRate.bind(this);
    //this.handleUserSubscription = this.handleUserSubscription.bind(this);
  }

  public componentDidMount() {
    this.apiGetUserUserInteractions();
    console.log("JA CHAMOU");
  }

  public handleUserRate() {
    console.log("RATE  USER ID: ", this.observerId);
  }

  /*public handleUserSubscription() {
    console.log("SUBSCRIBE   USER ID: ", this.userId);
    if (this.state.userSubscription) {
      this.apiSubscription("unsubscribe");
    } else {
      this.apiSubscription("subscribe");
    }
  }

  public apiSubscription(endpoint: string) {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post";
    axios
      .post(`${postUrl}/${endpoint}`, {
        postId: this.props.id,
        userId: this.userId
      })
      .then(res => {
        console.log("id: ", this.props.id);
        const subscription: boolean = endpoint === "subscribe";
        this.setState({ userSubscription: subscription });
      })
      .catch(() => console.log("Subscription system failed"));
  }*/

  public async apiGetUserUserInteractions() {
    console.log("oiiiii");
    const interactions = await apiGetUserInteractions(
      "users",
      this.observerId,
      this.id
    );
    console.log("RECEBEU INTERAÇOES", interactions);
    if (interactions != null) {
      /*this.setState({
        fetchingUserUserInteractions: false,
        userRate: res.data.rate || 0,
        userSubscription: res.data.subscription
      });*/
    } else {
      console.log("errooooooooooooooooo");
    }
  }

  public render() {
    if (this.state.fetchingUserUserInteractions) {
      return null;
    }

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
