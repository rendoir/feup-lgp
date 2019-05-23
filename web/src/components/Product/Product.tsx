import styles from './Product.module.css';

import { getApiURL } from '../../utils/apiURL';
import { dictionary, LanguageContext } from '../../utils/language';

import AuthHelperMethods from '../../utils/AuthHelperMethods';
import axiosInstance from '../../utils/axiosInstance';
import React, { Component } from 'react';
import Post from '../Post/Post';
import Button from '../Button/Button';

export type Props = {
  id: number;
  name: string;
  date: string;
  stock: number;
  points: number;
};

interface IState {}

class Product extends Component<Props, IState> {
  public static contextType = LanguageContext;

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
            <h4 className="card-title">
              <a href="#">{this.props.name}</a>
            </h4>
            <h5>
              {this.props.points} {dictionary.shop_points[this.context]}
            </h5>
            <p className="card-text">{this.props.stock}</p>
          </div>
          <div className="card-footer">
            <div className="">
              <Button theme="primary" view="outline" size="small" wide={true}>
                {dictionary.shop_exchange[this.context]}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
