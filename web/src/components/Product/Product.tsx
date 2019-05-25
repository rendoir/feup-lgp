import React, { Component } from 'react';

import styles from './Product.module.css';

import AuthHelperMethods from '../../utils/AuthHelperMethods';
import { dictionary, LanguageContext } from '../../utils/language';
import Button from '../Button/Button';
import EditProductModal from '../ProductModal/EditProductModal';
import RemoveProductModal from '../ProductModal/RemoveProductModal';

export type Props = {
  id: number;
  name: string;
  date: string;
  stock: number;
  points: number;
  image: string;
  conferenceId: number | undefined;
  conferenceOwner: number | undefined;
  user: any;
  enoughPoints: boolean; // True if user has enough points to reedem product
  updateUserPoints: any; // Function called to update user points when a product purchase occurs
};

interface IState {
  exchangingProduct: boolean;
  stock: number;
}

class Product extends Component<Props, IState> {
  public static contextType = LanguageContext;
  private auth = new AuthHelperMethods();

  constructor(props: Props) {
    super(props);

    this.state = {
      exchangingProduct: false,
      stock: this.props.stock
    };

    this.handleProductExchange = this.handleProductExchange.bind(this);
  }

  public handleProductExchange() {
    console.log('COMPPPPRRROU ', this.props.id);
    this.setState({
      exchangingProduct: true
    });
    // TODO BACKEND: DIMINUIR STOCK, TIRAR PONTOS AO UTILIZADOR
    // QUANDO A TROCA FOR BEM SUCEDIDA CHAMAR     this.props.updateUserPoints()
  }

  public render() {
    let imageURL = this.props.image;
    if (imageURL === null) {
      imageURL = 'http://placehold.it/700x400';
    }
    return (
      <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
        <div className="card h-100" id={`${styles.card_product}`}>
          <div className={`${styles.product_image}`}>
            <img
              id="product-img"
              className="card-img-top"
              src={imageURL}
              alt=""
            />
          </div>
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
            <div className="">{this.getReedemButton()}</div>
            {this.getEditProductModal()}
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
          data-target={`#edit_product_modal`}
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

  private getReedemButton() {
    const buttonDisabled = Boolean(
      this.state.stock === 0 ||
        !this.props.enoughPoints ||
        this.state.exchangingProduct
    );

    let buttonText = dictionary.shop_exchange[this.context];
    let buttonTheme: 'primary' | 'danger' | 'info' = 'primary';

    if (this.state.exchangingProduct) {
      buttonText = dictionary.shop_exchanging[this.context];
      buttonTheme = 'info';
    } else if (this.state.stock === 0) {
      buttonText = dictionary.sold_out[this.context];
      buttonTheme = 'danger';
    } else if (!this.props.enoughPoints) {
      buttonText = dictionary.not_enough_points[this.context];
      buttonTheme = 'danger';
    }

    return (
      <Button
        theme={buttonTheme}
        view="outline"
        size="small"
        wide={true}
        disabled={buttonDisabled}
        onClick={this.handleProductExchange}
      >
        {buttonText}
      </Button>
    );
  }

  private getEditProductModal() {
    return <EditProductModal {...this.props} />;
  }

  private getRemoveProductModal() {
    return <RemoveProductModal id={this.props.id} />;
  }
}

export default Product;
