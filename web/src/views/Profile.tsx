import * as React from "react";

class Profile extends React.Component {
  public render() {
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
                    allowFullScreen
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
