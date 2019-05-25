import React, { Component } from 'react';

import './ProductModal.scss';

import { getApiURL } from '../../utils/apiURL';
import axiosInstance from '../../utils/axiosInstance';
import { dictionary, LanguageContext } from '../../utils/language';

interface IProps {
  id: number;
  name: string;
  stock: number;
  points: number;
}

interface IState {
  id: number;
  product_name: string;
  product_points: number;
  product_stock: number;
}

class EditProductModal extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  constructor(props: IProps) {
    super(props);

    this.state = {
      id: 0,
      product_name: '',
      product_points: 0,
      product_stock: 0
    };

    this.handleEditProduct = this.handleEditProduct.bind(this);
  }

  public render() {
    return (
      <div
        id={`edit_product_modal`}
        className="modal fade"
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
      this.setState({ product_name: value });
    } else if (type === 'product_points') {
      this.setState({ product_points: value });
    } else if (type === 'product_stock') {
      this.setState({ product_stock: value });
    }
  }

  public apiEditProduct() {
    const body = {
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
      .catch(() => console.log('Failed to update product'));
  }

  private handleEditProduct() {
    this.apiEditProduct();
  }

  private getActionButton() {
    return (
      <div>
        <button
          type="button"
          role="submit"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={this.handleEditProduct}
        >
          {dictionary.save_changes[this.context]}
        </button>
      </div>
    );
  }
}

export default EditProductModal;
