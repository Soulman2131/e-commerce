import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart, removeCart, selectedAllCart } from "../features/cartSlice";
import { useSelector } from "react-redux";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector(selectedAllCart);
  // console.log(cart);
  const { cartItems } = cart;

  //   HANDLE (comme le HandleCart dans ProductId)
  const handleAddToCart = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const handleRemoveCart = (productId) => {
    dispatch(removeCart(productId));
  };
  //   😍😍😍
  const handleCheckOut = () => {
    navigate("/users/login?redirect=/cart/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Votre panier</h1>
        {cartItems.length === 0 ? (
          <Message>
            Votre panier est vide <Link to="/">Retour aux produits</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>{item.price} euros</Col>
                  <Col md={2}>
                    {/* On copie ceci depuis ProductId 😍 */}
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        handleAddToCart(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => handleRemoveCart(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Achats ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                articles
              </h2>
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}{" "}
              euros
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={handleCheckOut}
              >
                Procéder au paiement
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default Cart;
