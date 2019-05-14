import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { MouseEvent } from "react";
import * as React from "react";
import Avatar from "../components/Avatar/Avatar";
import Chat from "../components/Chat/Chat";
import Icon from "../components/Icon/Icon";
import Livestream from "../components/Livestream/Livestream";
import Post from "../components/Post/Post";
import InviteModal from "../components/PostModal/InviteModal";

import styles from "../components/Post/Post.module.css";
import "../styles/Conference.css";
import { getApiURL } from "../utils/apiURL";

import {
  faGlobeAfrica,
  faLock,
  faQuestion,
  faUserFriends,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import CreateNewModal from "../components/CreateNewModal/CreateNewModal";
import { Request, Step } from "../components/CreateNewModal/types";

// - Import utils
import TalkCard from "../components/TalkCard/TalkCard";
import {
  apiCheckUserCanJoinTalk,
  apiCheckUserTalkParticipation,
  apiUserJoinTalk,
  apiUserLeaveTalk
} from "../utils/apiTalk";
import { dictionary, LanguageContext } from "../utils/language";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

interface IState {
  hasChat: boolean;
  step: Step;
  hasLiveStream: boolean;
  talks: any[];
  title: string;
  description: string;
  conference_id: number;
  place: string;
  date_start: string;
  date_end: string;
  userCanJoin: boolean;
  userParticipation: boolean;
  waitingUserJoinLeave: boolean;
  isHidden: boolean;
  owner_id: number;
  owner_name: string;
  privacy: string;
  postModalOpen: boolean;
  request: {
    type: "post" | "talk" | "conference";
    title: string;
    about: string;
    avatar?: File;
    privacy: string;
    tags: string[];
    files: {
      docs: File[];
      videos: File[];
      images: File[];
    };
    dateStart: string;
    dateEnd: string;
    livestream: string;
    local: string;
    switcher: string;
  };
}

class Conference extends React.Component<IProps, IState> {
  public static contextType = LanguageContext;

  public id: number;
  public userId: number;
  public tags: string[];

  constructor(props: IProps) {
    super(props);
    this.id = this.props.match.params.id;
    this.userId = 1; // cookies.get("user_id"); - change when login fetches user id properly
    this.tags = [];
    this.state = {
      conference_id: 1,
      date_end: "",
      date_start: "",
      description: "",
      hasChat: true,
      hasLiveStream: true,
      isHidden: false,
      owner_id: 1,
      owner_name: "",
      place: "",
      postModalOpen: false,
      privacy: "",
      request: {
        about: "",
        avatar: undefined,
        dateEnd: "",
        dateStart: "",
        files: {
          docs: [],
          images: [],
          videos: []
        },
        livestream: "",
        local: "",
        privacy: "public",
        switcher: "false",
        tags: [],
        title: "",
        type: "talk"
      },
      step: "type",
      talks: [],
      title: "",
      userCanJoin: false,
      userParticipation: false,
      waitingUserJoinLeave: false
    };
  }
  public componentDidMount() {
    this.getConference();
  }
  public getConference() {
    const conferenceURL = getApiURL(`/conference/${this.id}`);
    axios
      .get(conferenceURL, {})
      .then(res => {
        const conference = res.data.conference;
        let datestart = conference.datestart.split("T");
        datestart = datestart[0] + " " + datestart[1];
        let dateend = conference.dateend.split("T");
        dateend = dateend[0] + " " + dateend[1];

        if (conference.privacy === "closed") {
          this.setState({
            isHidden: true
          });
        }

        this.setState({
          conference_id: conference.id,
          date_end: dateend,
          date_start: datestart,
          description: conference.about,
          owner_id: conference.user_id,
          owner_name: conference.first_name + conference.last_name,
          place: conference.local,
          privacy: conference.privacy,
          talks: res.data.talks,
          title: conference.title
        });
      })
      .catch(() => console.log("Failed to get conference info"));
  }

  public getTalks() {
    const buffer: any[] = [];
    let lastEnd = "";
    this.state.talks.forEach(talk => {
      let datestart = talk.datestart.split("T");
      datestart = datestart[0] + " " + datestart[1];
      let dateend = talk.dateend.split("T");
      dateend = dateend[0] + " " + dateend[1];
      if (lastEnd !== dateend) {
        buffer.push(
          <h6>
            {dictionary.day_split[this.context]}
            {this.cleanDate(dateend.split(" ")[0])}
          </h6>
        );
      }
      lastEnd = dateend;
      buffer.push(
        <TalkCard
          id={talk.id}
          title={talk.title}
          local={talk.local}
          dateend={this.cleanDate(dateend.split(" ")[0])}
          datestart={this.cleanDate(datestart.split(" ")[0])}
          about={talk.about}
          avatar={talk.avatar}
        />
      );
    });
    return buffer;
  }

  public cleanDate(date) {
    date = date.split("-");
    switch (date[1]) {
      case "01":
        date[1] = dictionary.month1[this.context];
        break;
      case "02":
        date[1] = dictionary.month2[this.context];
        break;
      case "03":
        date[1] = dictionary.month3[this.context];
        break;
      case "04":
        date[1] = dictionary.month4[this.context];
        break;
      case "05":
        date[1] = dictionary.month5[this.context];
        break;
      case "06":
        date[1] = dictionary.month6[this.context];
        break;
      case "07":
        date[1] = dictionary.month7[this.context];
        break;
      case "08":
        date[1] = dictionary.month8[this.context];
        break;
      case "09":
        date[1] = dictionary.month9[this.context];
        break;
      case "10":
        date[1] = dictionary.month10[this.context];
        break;
      case "11":
        date[1] = dictionary.month11[this.context];
        break;
      case "12":
        date[1] = dictionary.month12[this.context];
        break;
    }
    let cleanDate =
      date[2] +
      " " +
      dictionary.of[this.context] +
      " " +
      date[1] +
      ", " +
      date[0];
    return cleanDate;
  }

  public render() {
    if (this.state.isHidden && this.userId === this.state.owner_id) {
      return (
        <div id="Conference" className="my-5">
          <div className="container my-5">
            <h4>
              {dictionary.title[this.context]}: {this.state.title}
            </h4>
            <h5>Test Conference</h5>
          </div>

          <div className="container my-5">
            <div className="conf_side" />
          </div>
        </div>
      );
    } else {
      return (
        <div id="Conference" className="my-5">
          <div className="container my-5">
            <h4>{this.state.title}</h4>
            <h5>{this.state.description}</h5>
          </div>
          <div className="container my-5">
            <div className="conf_posts">
              <div className="p-3">{this.getTalks()}</div>
              <button className="create" onClick={this.createConfPost}>
                {dictionary.create_new_talk[this.context]}
              </button>
              {this.state.postModalOpen ? (
                <CreateNewModal
                  pending={false}
                  onSubmit={this.handleSubmit}
                  onStepChange={step => this.setState({ step })}
                  maxGroupSize={5}
                  request={this.state.request}
                  onRequestChange={request => this.setState({ request })}
                  onClose={this.resetState}
                  autoFocus={false}
                  step={"talkConf"}
                  tags={this.tags}
                />
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  }

  private createConfPost = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ postModalOpen: true });
  };

  private handleSubmit = (request: Request) => {
    let url = `${location.protocol}//${location.hostname}`;
    url +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";

    if (request.type === "talk") {
      url += "/talk/create";
      axios
        .post(url, {
          about: request.about,
          author: 1,
          avatar: request.avatar,
          conference: this.state.conference_id,
          dateEnd: request.dateEnd,
          dateStart: request.dateStart,
          local: request.local,
          privacy: request.privacy,
          title: request.title
        })
        .then(res => {
          console.log(`talk with id = ${res.data.id} created`);
          window.location.href = "/talk/" + res.data.id;
          this.resetState();
        })
        .catch(error => console.log("Failed to create talk. " + error));
    }
  };
  private resetState = () => {
    this.setState({
      postModalOpen: false,
      request: {
        about: "",
        avatar: undefined,
        dateEnd: "",
        dateStart: "",
        files: {
          docs: [],
          images: [],
          videos: []
        },
        livestream: "",
        local: "",
        privacy: "public",
        shortname: "",
        switcher: "false",
        tags: [],
        title: "",
        type: "talk"
      },
      step: "type"
    });
  };
}

export default Conference;
