import React from 'react';
import Avatar from '../Avatar/Avatar';

import './UserCard.scss';

export type Props = {
  id: number;
  first_name: string;
  last_name: string;
  rate: any;
  date_created: any;
};

class UserCard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div id="user-card-comp" className="card mb-2">
        <a href={'/user/' + this.props.id}>
          <div className="card-body col-md d-flex align-items-center">
            <Avatar
              title={this.props.first_name + ' ' + this.props.last_name}
              placeholder="empty"
              size={50}
              image="https://picsum.photos/200/200?image=52"
            />
            <div className="ml-3 username">
              {this.props.first_name + ' ' + this.props.last_name}
            </div>
          </div>
        </a>
      </div>
      // <div className="card mb-2">
      //     <div className="card-header">{this.props.first_name + ' ' + this.props.last_name}</div>
      //     <div className="card-body row col-md d-flex align-items-center pr-lg-2 pr-xl-4">
      //     <div className="col-12 col-lg-2 d-flex justify-content-center">
      //         <img
      //         className="img-fluid img-thumbnail rounded-circle"
      //         src={this.props.image}
      //         alt="card image"
      //         />
      //     </div>
      //     <div className="col-12 col-lg-8 mb-2 mb-lg-0">
      //         <p className="card-text">
      //         <strong>Email:</strong> {this.props.email}
      //         </p>
      //         <p className="card-text">
      //         <strong>Institution/College:</strong> {this.props.institution}
      //         </p>
      //         <p className="card-text">
      //         <strong>Profession/Course:</strong> {this.props.profession}
      //         </p>
      //     </div>
      //     </div>
      // </div>
    );
  }
}

export default UserCard;
