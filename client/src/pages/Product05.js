import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import Rating from "../components/Rating";

import { useGetProductQuery } from "../features/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

function ProductId() {
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,

    error,
  } = useGetProductQuery(productId);

  // const {userInfo} = useSelector(state => state.auth)

  // HANDLE CART
  const handleCart = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Retour aux produits
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name} </h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} notes `}
                />
              </ListGroup.Item>
              <ListGroup.Item> Price : {product.price} &euro; </ListGroup.Item>
              <ListGroup.Item>
                {" "}
                <strong>Description:</strong> {product.description}{" "}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                {/*  */}
                <ListGroup.Item>
                  <Row>
                    <Col>Price: </Col>
                    <Col>
                      <strong> {product.price} &euro; </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/*  */}
                <ListGroup.Item>
                  <Row>
                    <Col>Disponibilité: </Col>
                    <Col>
                      <strong>
                        {" "}
                        {product.countInStock > 0
                          ? "En stock"
                          : "En rupture"}{" "}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* 😍 QTY */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Quantité</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                {/* 😍 */}
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={handleCart}
                  >
                    Ajouter au panier
                  </Button>
                </ListGroup.Item>
                {/*  */}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}

export default ProductId;
