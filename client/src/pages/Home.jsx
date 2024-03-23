import React from "react";

import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../features/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCaroussel.jsx";
import Meta from "../components/Meta";

const Home = () => {
  const { pageNumber, keyword } = useParams();

  const {
    // On enleve products à cause du back de getProducts
    // data: products,
    data,
    isLoading,
    error,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Retour aux articles
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Les Produits Tendances</h1>
          <Row>
            {data.products.map((product, index) => (
              <Col sm={12} md={6} lg={4} xl={3} key={index}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default Home;
