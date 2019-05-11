import * as React from "react";
import Button from "../components/Button/Button";
import "../styles/Shop.css";
import { dictionary, LanguageContext } from "../utils/language";

class Shop extends React.Component {
  public static contextType = LanguageContext;

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
                    {" "}
                  </button>
                </form>
              </div>
            </div>
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
                  {" "}
                </li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1">
                  {" "}
                </li>
                <li data-target="#carouselExampleIndicators" data-slide-to="2">
                  {" "}
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

            <div className="row">
              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item One</a>
                    </h4>
                    <h5>10 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!{" "}
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Two</a>
                    </h4>
                    <h5>149 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur! Lorem ipsum dolor sit amet.
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Three</a>
                    </h4>
                    <h5>58 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Four</a>
                    </h4>
                    <h5>94 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Five</a>
                    </h4>
                    <h5>45 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur! Lorem ipsum dolor sit amet.
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Six</a>
                    </h4>
                    <h5>8 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Seven</a>
                    </h4>
                    <h5>82 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Eight</a>
                    </h4>
                    <h5>85 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Nine</a>
                    </h4>
                    <h5>46 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Ten</a>
                    </h4>
                    <h5>43 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Eleven</a>
                    </h4>
                    <h5>543 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 blogBox moreBox">
                <div className="card h-100">
                  <a href="#">
                    {" "}
                    <img
                      className="card-img-top"
                      src="http://placehold.it/700x400"
                      alt=""
                    />{" "}
                  </a>
                  <div className="card-body">
                    <h4 className="card-title">
                      <a href="#">Item Twelve</a>
                    </h4>
                    <h5>666 {dictionary.shop_points[this.context]}</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Amet numquam aspernatur!
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="">
                      <Button
                        theme="primary"
                        view="outline"
                        size="small"
                        wide={true}
                      >
                        {dictionary.shop_exchange[this.context]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Shop;
