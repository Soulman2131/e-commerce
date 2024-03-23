import React from "react";
import { useParams } from "react-router-dom";
import { useGetUserOrderQuery } from "../../features/orders/ordersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Col, Row } from "react-bootstrap";

const UserOrder = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetUserOrderQuery(orderId);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger"> {error.data.message} </Message>
  ) : (
    <>
      <h1> Commande n° {order._id} </h1>
      <Row>
        <Col md={8}>RIGHT</Col>
        <Col md={4}>LEFT</Col>
      </Row>
    </>
  );
};

export default UserOrder;
