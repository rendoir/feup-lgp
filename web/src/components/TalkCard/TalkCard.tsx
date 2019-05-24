import React from 'react';

import { dictionary, LanguageContext } from '../../utils/language';
import Avatar from '../Avatar/Avatar';
import './TalkCard.scss';

type Props = {
  id: number;
  title: string;
  local: string;
  dateend: any;
  datestart: any;
  about: string;
  avatar: string;
};

class TalkCard extends React.Component<Props> {
  public static contextType = LanguageContext;
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div id="talk-card-comp" className="card mb-2">
        <a href={'/talk/' + this.props.id}>
          <div className="card-body col-md d-flex align-items-center">
            <Avatar
              title={this.props.title}
              placeholder="empty"
              size={50}
              image={this.props.avatar}
            />
            <ul>
              <li className="noDot ml-3 username">{this.props.title}</li>
              <li className="noDot ml-3 about">{this.props.about}</li>
              <li className="noDot ml-3 about">
                {dictionary.start_at[this.context] + ' ' + this.props.datestart}
              </li>
            </ul>
          </div>
        </a>
      </div>
    );
  }
}

export default TalkCard;
