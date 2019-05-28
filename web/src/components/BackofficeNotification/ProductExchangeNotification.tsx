import React, { Component } from 'react';

import { dictionary, LanguageContext } from '../../utils/language';

interface IProps {
  exchangeId: number;
  productId: number;
  productName: string;
  buyerId: number;
  buyerFirstName: string;
  buyerLastName: string;
}

export class ProductExchangeNotification extends Component<IProps, {}> {
  public static contextType = LanguageContext;

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="container border mb-2 admin_notif">
        <div className="row d-flex justify-content-between mx-1">
          <div className="mt-2" style={{ textTransform: 'capitalize' }}>
            <b>
              {dictionary.shipment_order[this.context]} (ID:{' '}
              {this.props.exchangeId})
            </b>
          </div>
          <button className="close align-self-end">
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="dropdown-divider p" />

        <p className="exchange_message mb-3">
          {/* User profile link */}
          {dictionary.ship_product[this.context]}{' '}
          <b>{this.props.productName}</b>{' '}
          {`(${dictionary.product[this.context]} id: ${this.props.productId}) `}
          {dictionary.to_user[this.context]}{' '}
          <a href={`/user/${this.props.buyerId}`}>
            {`${this.props.buyerFirstName} ${this.props.buyerLastName}`}
          </a>
        </p>
      </div>
    );
  }
}
