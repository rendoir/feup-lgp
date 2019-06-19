import * as React from 'react';

import '../styles/Shop.css';

import Product from '../components/Product/Product';
import AddProductModal from '../components/ProductModal/AddProductModal';

import AuthHelperMethods from '../utils/AuthHelperMethods';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';

type Props = {
  user: any;
  match: {
    params: {
      id: number;
    };
  };
};

type State = {
  addProductSuccess: boolean;
  conferenceOwner: number | undefined;
  error: boolean;
  errorMessage: string;
  fetchingUserPoints: boolean;
  isLoading: boolean;
  products: any[];
  showAddProductAlert: boolean;
  userPoints: number;
};

class Shop extends React.Component<Props, State> {
  public static contextType = LanguageContext;
  public isConferenceShop: boolean; // Indicates if the shop is general (false) or belongs to a conference (true)
  public conferenceId: number | undefined;
  private auth = new AuthHelperMethods();

  constructor(props: Props) {
    super(props);

    this.conferenceId = this.props.match.params.id;
    this.isConferenceShop = this.conferenceId !== undefined;

    this.state = {
      addProductSuccess: true,
      conferenceOwner: undefined,
      error: false,
      errorMessage: '',
      fetchingUserPoints: true,
      isLoading: true,
      products: [],
      showAddProductAlert: true,
      userPoints: 0
    };
  }

  public componentWillMount() {
    this.apiGetProducts();
    this.apiGetUserPoints();
    if (this.isConferenceShop) {
      this.apiGetConfOwner();
    }
  }

  public render() {
    return (
      <div id="Shop" className="container">
        <div className="row">
          <div className="col-lg-3 ml-0">
            <div className="mb-4">
              <h1 className="my-4" />
              <div className="card h-100">
                <div className="card-body">
                  {!this.state.fetchingUserPoints && (
                    <h6>
                      {dictionary.shop_you_have[this.context]}
                      <a id="user-points"> {this.state.userPoints} </a>
                      {dictionary.shop_points[this.context]}
                    </h6>
                  )}
                </div>
              </div>
            </div>
            {this.getAddProductButton()}
          </div>
          <div id="" className="col-lg-9">
            <div className="slide row my-4">{this.renderProducts()}</div>
          </div>
        </div>
      </div>
    );
  }

  private apiGetProducts = () => {
    const url = this.isConferenceShop
      ? `/conferences/${this.conferenceId}/products`
      : '/products';

    this.setState({ isLoading: true }, () => {
      axiosInstance
        .get(url, {
          params: {
            conferenceId: this.conferenceId
          }
        })
        .then(res => {
          this.setState({
            isLoading: false,
            products: res.data.products
          });
        })
        .catch(error => {
          this.setState({
            error: true,
            isLoading: false
          });
        });
    });
  };

  private apiGetUserPoints = () => {
    const url = this.isConferenceShop
      ? `/users/conference_points/${this.conferenceId}`
      : '/users/1/points';
    axiosInstance
      .get(url, {
        params: {
          user: this.props.user.id
        }
      })
      .then(res => {
        this.setState({
          fetchingUserPoints: false,
          userPoints: res.data.points
        });
      })
      .catch(error => console.log(error));
  };

  private apiGetConfOwner = () => {
    axiosInstance
      .get(`/conferences/${this.conferenceId}`, {
        params: {
          user: this.props.user.id
        }
      })
      .then(res => {
        const conference = res.data.conference;
        this.setState({
          conferenceOwner: conference.user_id
        });
      })
      .catch(error => console.log(error.response.data.message));
  };

  private renderProducts = () => {
    if (this.state.fetchingUserPoints) {
      return null;
    }

    return this.state.products.map(product => (
      <Product
        key={product.id}
        id={product.id}
        name={product.name}
        date={new Date(product.date).toLocaleString(
          dictionary.date_format[this.context]
        )}
        points={product.points}
        stock={product.stock}
        image={product.image}
        conferenceId={this.conferenceId}
        conferenceOwner={this.state.conferenceOwner}
        user={this.props.user}
        enoughPoints={this.state.userPoints >= product.points}
        updateUserPoints={this.apiGetUserPoints}
      />
    ));
  };

  private getAddProductButton() {
    let permissions = false;

    if (!this.isConferenceShop && this.auth.isAdmin()) {
      permissions = true;
    } else {
      if (this.auth.getUserPayload().id === this.state.conferenceOwner) {
        permissions = true;
      }
    }

    if (permissions) {
      return (
        <div className="mb-4">
          <h1 className="my-4" />
          <div className="card h-100">
            <div className="p-3">
              <div id="shop-admin-buttons" className="p-0 m-0">
                <h6>{dictionary.administrator[this.context]}</h6>
                <button
                  id="add_product"
                  data-toggle="modal"
                  data-target={`#add_product_modal`}
                >
                  <i className="fas fa-cart-plus" />
                  {dictionary.add_product[this.context]}
                </button>
              </div>
            </div>
          </div>
          {this.getAddProductModal()}
        </div>
      );
    }
  }

  private getAddProductModal() {
    return <AddProductModal conference_id={this.conferenceId} />;
  }
}

export default withAuth(Shop);
