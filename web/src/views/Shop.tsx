import * as React from 'react';
import Product from '../components/Product/Product';
import AddProductModal from '../components/ProductModal/AddProductModal';
import '../styles/Shop.css';
import axiosInstance from '../utils/axiosInstance';
import { dictionary, LanguageContext } from '../utils/language';
import withAuth from '../utils/withAuth';
import { getApiURL } from '../utils/apiURL';
import AuthHelperMethods from '../utils/AuthHelperMethods';

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
  conferenceID: number | undefined;
  conferenceOwner: number | undefined;
  error: boolean;
  errorMessage: string;
  isLoading: boolean;
  products: any[];
  showAddProductAlert: boolean;
};

class Shop extends React.Component<Props, State> {
  public static contextType = LanguageContext;
  private auth = new AuthHelperMethods();

  constructor(props: Props) {
    super(props);

    this.state = {
      addProductSuccess: true,
      conferenceID: undefined,
      conferenceOwner: undefined,
      error: false,
      errorMessage: '',
      isLoading: true,
      products: [],
      showAddProductAlert: true
    };
  }

  public componentWillMount() {
    this.apiGetProducts();
    this.apiGetConfOwner();
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
                  <h6>
                    {dictionary.shop_you_have[this.context]}
                    <a id="user-points"> x </a>
                    {dictionary.shop_points[this.context]}
                  </h6>
                </div>
                <form id="shop-left-box" className="form-inline my-2 my-lg-0">
                  <h5 className="my-4" id="search-products">
                    {dictionary.shop_search_points[this.context]}
                  </h5>
                  <input
                    id="search-shop-input"
                    className="form-control mr-sm-2"
                    type="text"
                    placeholder={dictionary.search[this.context]}
                  />
                  <button
                    id="search-shop-button"
                    className="form-control btn btn-secondary my-2 my-sm-0 fas fa-search"
                    type="submit"
                  >
                    {' '}
                  </button>
                </form>
              </div>
            </div>
            {this.getAddProductButton()}
          </div>

          <div id="products-carousel" className="col-lg-9">
            <div
              id="carouselExampleIndicators"
              className="carousel slide my-4"
              data-ride="carousel"
            >
              <ol className="carousel-indicators">
                <li
                  data-target="#carouselExampleIndicators"
                  data-slide-to="0"
                  className="active"
                >
                  {' '}
                </li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1">
                  {' '}
                </li>
                <li data-target="#carouselExampleIndicators" data-slide-to="2">
                  {' '}
                </li>
              </ol>
              <div className="carousel-inner" role="listbox">
                <div className="carousel-item active">
                  <img
                    className="d-block img-fluid"
                    src="http://placehold.it/900x350"
                    alt="First slide"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    className="d-block img-fluid"
                    src="http://placehold.it/900x350"
                    alt="Second slide"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    className="d-block img-fluid"
                    src="http://placehold.it/900x350"
                    alt="Third slide"
                  />
                </div>
              </div>
            </div>

            <div className="row">{this.renderProducts()}</div>
          </div>
        </div>
      </div>
    );
  }

  private apiGetProducts = () => {
    let conferenceId, url;
    if (this.props.match.params.id === undefined) {
      conferenceId = null;
      url = '/shop/';
    } else {
      conferenceId = this.props.match.params.id;
      url = `/conference/${this.props.match.params.id}/shop/`;
    }
    this.setState({ isLoading: true }, () => {
      axiosInstance
        .get(url, {
          params: {
            conferenceId: conferenceId
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

  private apiGetConfOwner = () => {
    if (!(this.props.match.params.id === undefined)) {
      axiosInstance
        .get(`/conference/${this.props.match.params.id}`, {
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
    }
  };

  private renderProducts = () => {
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
        conferenceId={this.state.conferenceID}
        conferenceOwner={this.state.conferenceOwner}
        user={this.props.user}
      />
    ));
  };

  private getAddProductButton() {
    let permissions = false;

    if (this.props.match.params.id === undefined && this.auth.isAdmin()) {
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
    return <AddProductModal conference_id={this.props.match.params.id} />;
  }
}

export default withAuth(Shop);
