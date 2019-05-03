import * as React from "react";

type Props = {};

type State = {
  id: number;
  livestreamId: string;
};

export default class ConferenceStream extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      livestreamId: "h_lXEdskavo"
    };
  }

  public render() {
    return (
      <div id="chat-embed-wrapper">
        <iframe
          width="560"
          height="315"
          src={"https://www.youtube.com/embed/" + this.state.livestreamId}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        />
        <iframe
          src={
            "https://www.youtube.com/live_chat?v=" +
            this.state.livestreamId +
            "&embed_domain=" +
            window.location.hostname
          }
          frameBorder="0"
          height="315"
        />
        <br />
      </div>
    );
  }
}
