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
import "../styles/Talk.css";
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
    type: "post" | "conference" | "conference";
    title: string;
    about: string;
    avatar?: File;
    privacy: string;
    tags: string[];
    dateStart: string;
    dateEnd: string;
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
        local: "",
        privacy: "public",
        switcher: "false",
        tags: [],
        title: "",
        type: "post"
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
    this.state.talks.forEach(talk => {
      let datestart = talk.datestart.split("T");
      datestart = datestart[0] + " " + datestart[1];
      let dateend = talk.dateend.split("T");
      dateend = dateend[0] + " " + dateend[1];
      buffer.push(
        <TalkCard
          id={talk.id}
          title={talk.title}
          local={talk.local}
          dateend={dateend}
          datestart={datestart}
          about={talk.about}
          avatar={talk.avatar}
        />
      );
    });
    return buffer;
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
            <div className="conf_side">
              <div className="p-3">{this.getTalks()}</div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Conference;
