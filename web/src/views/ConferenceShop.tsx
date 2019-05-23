import React, { PureComponent } from 'react';
import withAuth from '../utils/withAuth';

export type Props = {
  user: any;
};

export type State = {};

class ConferenceShop extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return <div>CONFERENCE SHOP!</div>;
  }
}

export default withAuth(ConferenceShop);
