import React, { Component } from 'react';

import './ProductModal.scss';

import { getApiURL } from '../../utils/apiURL';
import axiosInstance from '../../utils/axiosInstance';
import { dictionary, LanguageContext } from '../../utils/language';

interface IProps {
  id: number;
  image: string;
  name: string;
  stock: number;
  points: number;
}

interface IState {
  id: number;
  product_error: boolean;
  product_name: string;
  product_name_error: boolean;
  product_points: number;
  product_points_error: boolean;
  product_stock: number;
  product_stock_error: boolean;
  product_image: string;
}

class EditProductModal extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  constructor(props: IProps) {
    super(props);

    this.state = {
      id: this.props.id,
      product_error: false,
      product_image: this.props.image,
      product_name: this.props.name,
      product_name_error: false,
      product_points: this.props.points,
      product_points_error: false,
      product_stock: this.props.stock,
      product_stock_error: false
    };

    this.handleEditProduct = this.handleEditProduct.bind(this);
  }

  public render() {
    return (
      <div
        id={`edit_product_modal_${this.props.id}`}
        className="modal fade edit-product"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
        data-backdrop="false"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                {dictionary.edit_product[this.context]}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h5>{dictionary.insert_product_name[this.context]}</h5>
              <input
                name="product_name"
                type="text"
                autoComplete="off"
                className="post_field"
                onChange={e =>
                  this.handleInputChange('product_name', e.target.value)
                }
                defaultValue={this.props.name}
                placeholder={dictionary.insert_product_name[this.context]}
                required={true}
              />
            </div>
            <p
              className={
                (this.state.product_name_error ? '' : 'd-none') + ' pt-1'
              }
            >
              {dictionary.product_name_error_message[this.context]}
            </p>
            <div className="modal-body">
              <h5>{dictionary.insert_product_points[this.context]}</h5>
              <input
                name="product_points"
                type="number"
                autoComplete="off"
                className="post_field"
                defaultValue={this.props.points.toString()}
                onChange={e =>
                  this.handleInputChange('product_points', e.target.value)
                }
                placeholder={dictionary.insert_product_points[this.context]}
                required={true}
              />
            </div>
            <p
              className={
                (this.state.product_points_error ? '' : 'd-none') + ' pt-1'
              }
            >
              {dictionary.product_points_error_message[this.context]}
            </p>
            <div className="modal-body">
              <h5>{dictionary.insert_product_stock[this.context]}</h5>
              <input
                name="product_stock"
                type="number"
                autoComplete="off"
                className="post_field"
                onChange={e =>
                  this.handleInputChange('product_stock', e.target.value)
                }
                defaultValue={this.props.stock.toString()}
                placeholder={dictionary.insert_product_stock[this.context]}
                required={true}
              />
            </div>
            <p
              className={
                (this.state.product_stock_error ? '' : 'd-none') + ' pt-1'
              }
            >
              {dictionary.product_stock_error_message[this.context]}
            </p>
            <div className="modal-body">
              <h5>{dictionary.insert_product_image[this.context]}</h5>
              <input
                name="product_image"
                type="text"
                autoComplete="off"
                className="post_field"
                onChange={e =>
                  this.handleInputChange('product_image', e.target.value)
                }
                placeholder={dictionary.insert_product_image[this.context]}
                defaultValue={this.props.image}
                required={true}
              />
            </div>
            <p className={(this.state.product_error ? '' : 'd-none') + ' pt-1'}>
              {dictionary.product_error_message[this.context]}
            </p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                {dictionary.cancel[this.context]}
              </button>
              {this.getActionButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleInputChange(type, value) {
    if (type === 'product_name') {
      this.setState({ product_name: value, product_name_error: false });
    } else if (type === 'product_points') {
      this.setState({ product_points: value, product_points_error: false });
    } else if (type === 'product_stock') {
      this.setState({ product_stock: value, product_stock_error: false });
    } else if (type === 'product_image') {
      this.setState({ product_image: value });
    }
  }

  private apiEditProduct() {
    const body = {
      image: this.state.product_image,
      name: this.state.product_name,
      points: this.state.product_points,
      stock: this.state.product_stock
    };

    axiosInstance
      .put(getApiURL(`/products/${this.props.id}`), body)
      .then(res => {
        console.log('Product updated - reloading page...');
        window.location.reload();
      })
      .catch(() => {
        console.log('Failed to edit product');
        this.setState({ product_error: true });
      });
  }

  private handleEditProduct() {
    if (this.state.product_name.length === 0) {
      this.setState({ product_name_error: true });
    } else if (this.state.product_points < 0) {
      this.setState({ product_points_error: true });
    } else if (this.state.product_stock < 1) {
      this.setState({ product_stock_error: true });
    } else {
      this.apiEditProduct();
    }
  }

  private getActionButton() {
    return (
      <div>
        <button
          type="button"
          role="submit"
          className="btn btn-primary"
          onClick={this.handleEditProduct}
        >
          {dictionary.save_changes[this.context]}
        </button>
      </div>
    );
  }
}

export default EditProductModal;
