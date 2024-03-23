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

import {
  useCreateReviewMutation,
  useGetProductQuery,
} from "../features/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import Meta from "../components/Meta";
import { useSelector } from "react-redux";
import { selectedAllUsers } from "../features/users/authSlice";
import { toast } from "react-toastify";

function ProductId() {
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductQuery(productId);

  const [createReview, { isLoading: loadingReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector(selectedAllUsers);

  // HANDLE CART
  const handleCart = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  //
  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Votre note est publiée avec succes");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
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
        <>
          {/* 😍 */}
          <Meta />
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
                <ListGroup.Item>
                  {" "}
                  Price : {product.price} &euro;{" "}
                </ListGroup.Item>
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
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
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
          <Row className="review">
            <Col md={6}>
              <h2>Donner une note et un avis.</h2>
              {product.reviews.length === 0 && (
                <Message>
                  Partagez votre expérience afin d'aider les autres
                  utilisateurs.
                </Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Accorder une note.</h2>

                  {loadingReview && <Loader />}

                  {userInfo ? (
                    // 🥰🥰
                    <Form onSubmit={handleReview}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Pas satisfait</option>
                          <option value="2">2 - Peu satisfait</option>
                          <option value="3">3 - Satisfait</option>
                          <option value="4">4 - Trés satisfait</option>
                          <option value="5">5 - Extrêment satisfait</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>Commentaire</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingReview}
                        type="submit"
                        variant="primary"
                      >
                        Valider la publication
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Veuillez <Link to="/users/login">se connecter</Link> pour
                      rédiger une note.
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ProductId;
