import axios from "axios";
import * as React from "react";

import Chat from "../components/Chat/Chat";
import Livestream from "../components/Livestream/Livestream";
import Post from "../components/Post/Post";

import "../styles/Conference.css";
import { string } from "prop-types";
import { getApiURL } from "../utils/apiURL";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

type State = {
  hasChat: boolean;
  hasLiveStream: boolean;
  livestreamUrl: string;
  posts: any[];
  title: string;
  description: string;
  place: string;
  date_start: string;
  date_end: string;
};

class Conference extends React.Component<IProps, State> {
  public id: number;

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;

    this.state = {
      date_end: "16:30 20/03/2019",
      date_start: "14:30 20/03/2019",
      description:
        "Nam ut metus sed purus aliquet porttitor sit amet nec metus. Fusce porta neque pellentesque mollis porttitor. Mauris eget leo metus. Etiam venenatis condimentum efficitur. Etiam libero lorem, ornare ac leo nec, accumsan eleifend arcu. Donec at lectus quam. Vivamus ornare ipsum ut dolor faucibus sollicitudin faucibus sit amet orci. In sit amet venenatis eros. Integer vestibulum rhoncus vehicula. Ut venenatis dignissim tellus vel facilisis.",
      hasChat: true,
      hasLiveStream: false,
      livestreamUrl: "https://www.youtube.com/embed/UVxU2HzPGug",
      place: "Porto",
      // posts: []
      posts: [
        {
          comments: [],
          content: "This is the post content",
          date_created: "2019-12-03",
          files: [],
          first_name: "John",
          id: 1,
          last_name: "Doe",
          likers: [],
          likes: 0,
          tags: [],
          title: "My title",
          user_id: 1,
          visibility: "public"
        },
        {
          comments: [],
          content: "This is the post content",
          date_created: "2019-12-03",
          files: [],
          first_name: "John",
          id: 2,
          last_name: "Doe",
          likers: [],
          likes: 0,
          tags: [],
          title: "My title",
          user_id: 2,
          visibility: "public"
        }
      ],
      title: "Conference title"
    };
  }

  public componentDidMount() {
    this.apiGetConference();
  }

  public apiGetConference() {
    const conferenceURL = getApiURL(`/conference/${this.id}`);
    axios
      .get(conferenceURL, {})
      .then(res => {
        console.log(res);
        const conference = res.data.conference;
        let datestart = conference.datestart.split("T");
        datestart = datestart[0] + " " + datestart[1];
        let dateend = conference.dateend.split("T");
        dateend = dateend[0] + " " + dateend[1];

        if (conference.livestream_url) {
          this.setState({ hasLiveStream: true });
        }

        this.setState({
          date_end: dateend,
          date_start: datestart,
          description: conference.about,
          livestreamUrl: conference.livestream_url,
          place: conference.local,
          title: conference.title
        });
      })
      .catch(() => console.log("Failed to get conference"));
  }

  public render() {
    return (
      <div id="Conference" className="my-5">
        <div className="container my-5">
          <h4>{this.state.title}</h4>
          <p>{this.state.description}</p>
        </div>

        {this.state.hasLiveStream && this.renderStream()}

        <div className="container my-5">
          <div className="conf_side">
            <div className="p-3">{this.getDetails()}</div>
            <div className="p-3">{this.getAdminButtons()}</div>
          </div>
          <div className="conf_posts">
            <button className="join">Join conference</button>
            {this.getPosts()}
          </div>
        </div>
      </div>
    );
  }

  private renderStream() {
    return (
      <div className="conf_head w-100">
        <div className="live_wrap">
          <div className="live_container">
            <Livestream src={this.state.livestreamUrl} />
          </div>
        </div>
        <div className="chat_wrap">
          <div className="chat_container">
            <Chat />
          </div>
        </div>
      </div>
    );
  }

  private getPosts() {
    return this.state.posts.map(post => (
      <Post
        key={post.id}
        id={post.id}
        user_id={post.user_id}
        author={post.first_name + " " + post.last_name}
        text={post.content}
        likes={post.likes}
        title={post.title}
        date={post.date_created.replace(/T.*/gi, "")}
        visibility={post.visibility}
        comments={post.comments}
        likers={post.likers}
        tags={post.tags}
        files={post.files}
      />
    ));
  }

  private getDetails() {
    return (
      <ul className="p-0 m-0">
        <li>
          <i className="fas fa-map-marker-alt" /> {this.state.place}
        </li>
        <li>
          <i className="fas fa-hourglass-start" /> {this.state.date_start}
        </li>
        <li>
          <i className="fas fa-hourglass-end" /> {this.state.date_end}
        </li>
      </ul>
    );
  }

  private getAdminButtons() {
    return (
      <div className="p-0 m-0">
        <h6>Administrator</h6>
        <button>
          <i className="fas fa-envelope" />
          Invite user
        </button>
        <button>
          <i className="fas fa-video" />
          Start livestream
        </button>
        <button>
          <i className="fas fa-puzzle-piece" />
          Create challenge
        </button>
        <button>
          <i className="fas fa-archive" />
          Archive conference
        </button>
        <button>
          <i className="fas fa-trash" />
          Delete conference
        </button>
      </div>
    );
  }
}

export default Conference;
