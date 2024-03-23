import React from "react";

import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../features/productApiSlice";

const Home = () => {
  const { pageNumber, keyword } = useParams();

  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {/* isLoading? (): error? () :(X) */}

      {isLoading ? (
        <h2>LOADING</h2>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <>
          <h1>Les Produits Tendances</h1>
          <Row>
            {products.map((product, index) => (
              <Col sm={12} md={6} lg={4} xl={3} key={index}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default Home;
