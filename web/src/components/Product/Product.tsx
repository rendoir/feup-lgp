import styles from './Product.module.css';

import { dictionary, LanguageContext } from '../../utils/language';

import AuthHelperMethods from '../../utils/AuthHelperMethods';
import React, { Component } from 'react';
import Button from '../Button/Button';
import RemoveProductModal from '../ProductModal/RemoveProductModal';

export type Props = {
  id: number;
  name: string;
  date: string;
  stock: number;
  points: number;
  conferenceId: number | undefined;
  conferenceOwner: number | undefined;
  user: any;
};

interface IState {}

class Product extends Component<Props, IState> {
  public static contextType = LanguageContext;
  private auth = new AuthHelperMethods();

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
        <div className="card h-100">
          <a href="#">
            {' '}
            <img
              className="card-img-top"
              src="http://placehold.it/700x400"
              alt=""
            />{' '}
          </a>
          <div className="card-body">
            {this.getDropdown()}
            <h4 className="card-title">
              <a href="#">{this.props.name}</a>
            </h4>
            <h5>
              {this.props.points} {dictionary.shop_points[this.context]}
            </h5>
            <p className="card-text">
              {dictionary.shop_stock[this.context]}
              {this.props.stock}
            </p>
          </div>
          <div className="card-footer">
            <div className="">
              <Button theme="primary" view="outline" size="small" wide={true}>
                {dictionary.shop_exchange[this.context]}
              </Button>
            </div>
            {this.getRemoveProductModal()}
          </div>
        </div>
      </div>
    );
  }

  private getDropdown() {
    let permissions = false;

    if (this.props.conferenceId === undefined && this.auth.isAdmin()) {
      permissions = true;
    } else {
      if (this.auth.getUserPayload().id === this.props.conferenceOwner) {
        permissions = true;
      }
    }

    if (permissions) {
      return (
        <div className={`${styles.post_options} btn-group`}>
          <button
            className="w-100 h-100 ml-2"
            role="button"
            data-toggle="dropdown"
          >
            <i className="fas fa-ellipsis-v" />
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            {this.getDropdownButtons()}
          </div>
        </div>
      );
    }
  }

  private getDropdownButtons() {
    return (
      <div>
        <button
          id="edit_product"
          data-toggle="modal"
          data-target={`#remove_product_modal`}
        >
          {dictionary.edit_product[this.context]}
        </button>
        <button
          id="remove_product"
          data-toggle="modal"
          data-target={`#remove_product_modal`}
        >
          {dictionary.remove_product[this.context]}
        </button>
      </div>
    );
  }

  private getRemoveProductModal() {
    return <RemoveProductModal id={this.props.id} />;
  }
}

export default Product;
