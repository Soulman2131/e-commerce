import React, { useEffect } from "react";
import { Button, Card, Col, Image, ListGroup } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { clearCartItems, selectedAllCart } from "../../features/cartSlice";
import { useCreateOrderMutation } from "../../features/orders/ordersApiSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import FormShip from "../FormShip";

const Order = () => {
  const cart = useSelector(selectedAllCart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/cart/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/cart/payment");
    }
  }, [cart.shippingAddress.address, navigate, cart.paymentMethod]);

  //
  const handleOrder = async () => {
    try {
      const res = await createOrder({
        // on l'a pris sur UPDATECART
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/cart/order/${res._id}`); //Nous raméne à After-Order
      console.log(res);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <FormShip step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Commande</h2>
              <p>
                <strong>Adresse de livraison : </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Méthode de paiement</h2>
              <strong>Moyen de paiement: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2> Les articles de la commande</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Votre panier est vide</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          {/* 😍😍😍 item.product? */}
                          {/* <Link to={`/product/${item.product}`}> */}
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price}&euro; =
                          {(item.qty * (item.price * 100)) / 100}&euro;
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2> Récapitulatif de la commande</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col> Articles</Col>

                  <Col>{cart.itemsPrice} &euro; </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Frais de port</Col>
                  <Col>{cart.shippingPrice} &euro;</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>TVA</Col>
                  <Col>{cart.taxPrice} &euro;</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{cart.totalPrice} &euro; </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant="danger">{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block bg-bg-black"
                  disabled={cart.cartItems === 0}
                  onClick={handleOrder}
                >
                  Valider la commande
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
