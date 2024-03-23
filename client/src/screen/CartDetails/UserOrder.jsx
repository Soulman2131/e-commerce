import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetPaypalClientIdQuery,
  useGetUserOrderQuery,
  usePayOrderMutation,
  useUpdateOrderToDeliveredMutation,
} from "../../features/orders/ordersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { selectedAllUsers } from "../../features/users/authSlice";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const UserOrder = () => {
  const { id: orderId } = useParams();
  // ORDER API SLICE
  // 1
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetUserOrderQuery(orderId);
  // console.log(order); //😍

  // 2
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  // 3
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  // Aprés avoir fait le BACKEND ET LE SLICE DE ADMIN SUR ORDER 😍😍
  // 4
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useUpdateOrderToDeliveredMutation();

  //
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { userInfo } = useSelector(selectedAllUsers);

  // USE EFFECT (cf docs paypal react )
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "EUR",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  //1B
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("La commande est payée");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  };

  //2B TESTING ONLY! REMOVE BEFORE PRODUCTION
  const onApproveTest = async () => {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();

    toast.success("Commande payée");
  };

  // 3B
  const onError = (err) => toast.error(err.message);

  // 4B
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  // Aprés avoir fait le BACKEND ET LE SLICE DE ADMIN SUR ORDER 😍

  const handleDeliver = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success("La commande est délivrée");
  };

  // FUNCTION RETURN 😍
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
                <strong>Adresse : </strong>
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
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      <Button
                        style={{ marginBottom: "10px" }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button>

                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {/* MARK AS DELIVERED PLACEHOLDER 😘 */}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={handleDeliver}
                    >
                      Valider si Livrée
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserOrder;
