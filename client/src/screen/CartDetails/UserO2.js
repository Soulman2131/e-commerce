import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetUserOrderQuery } from "../../features/orders/ordersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";

const UserOrder = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetUserOrderQuery(orderId);
  // console.log(order); //😍

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger"> {error.data.message} </Message>
  ) : (
    <>
      <h1> Commande n° {order._id} </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Adresse de livraison</h2>
              <p>
                <strong>Nom : </strong> {order.user.name}
              </p>
              <p>
                <strong>Email : </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Adresse :</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Commande livrée {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Commande non livrée</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Methode de paiement</h2>
              <p>
                <strong>Moyen de paiement: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Commande payée {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">Non payée</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Articles</h2>
              {order.orderItems.length === 0 ? (
                <Message>Pas de commande</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
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
                <h2>Récapitulatif</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Articles</Col>
                  <Col>{order.itemsPrice} &euro;</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Frais de livraison</Col>
                  <Col>{order.shippingPrice} &euro; </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>TVA</Col>
                  <Col>{order.taxPrice} &euro;</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{order.totalPrice} &euro;</Col>
                </Row>
              </ListGroup.Item>
              {/* PAY ORDER PLACEHOLDER */}
              {/* MARK AS DELIVERED PLACEHOLDER */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserOrder;
