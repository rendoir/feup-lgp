import React, { Component } from 'react';

import './ProductModal.scss';

import { getApiURL } from '../../utils/apiURL';
import axiosInstance from '../../utils/axiosInstance';
import { dictionary, LanguageContext } from '../../utils/language';

interface IProps {
  id: number;
}

interface IState {
  id: number;
  product_name: string;
  product_points: number;
  product_stock: number;
}

class RemoveProductModal extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  constructor(props: IProps) {
    super(props);

    this.state = {
      id: 0,
      product_name: '',
      product_points: 0,
      product_stock: 0
    };

    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
  }

  public render() {
    return (
      <div
        id={`remove_product_modal`}
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
                {dictionary.remove_product[this.context]}
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
              <p>{dictionary.confirm_delete_product[this.context]}</p>
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

  public apiDeleteProduct() {
    axiosInstance
      .delete(getApiURL(`/products/${this.props.id}`))
      .then(res => {
        console.log('Product deleted - reloading page...');
        window.location.reload();
      })
      .catch(() => console.log('Failed to delete product'));
  }

  private handleDeleteProduct() {
    this.apiDeleteProduct();
  }

  private getActionButton() {
    return (
      <div>
        <button
          type="button"
          role="submit"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={this.handleDeleteProduct}
        >
          {dictionary.yes[this.context]}
        </button>
      </div>
    );
  }
}

export default RemoveProductModal;
