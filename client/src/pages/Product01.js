import React from "react";
import { Link, useParams } from "react-router-dom";
import products from "../products";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Rating from "../components/Rating";

function ProductId() {
  const { id: productId } = useParams();
  const product = products.find((p) => p._id === productId);
  //   console.log(product);
  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Retour aux produits
      </Link>

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
              {/*  */}
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  Ajouter au panier
                </Button>
              </ListGroup.Item>
              {/*  */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ProductId;
