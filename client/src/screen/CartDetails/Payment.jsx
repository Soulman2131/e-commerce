import React, { useEffect, useState } from "react";
import FormC from "../FormC";
import FormShip from "../FormShip";
import { Button, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { payMethod, selectedAllCart } from "../../features/cartSlice";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("PayPal"); //😍

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector(selectedAllCart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/cart/shipping");
    }
  }, [navigate, shippingAddress]);

  //
  const handlePayment = (e) => {
    e.preventDefault();
    dispatch(payMethod(paymentMethod));
    navigate("/cart/order");
  };

  return (
    <FormC>
      <FormShip step1 step2 step3 />
      <h1>Méthode de paiement</h1>
      <Form onSubmit={handlePayment}>
        <Form.Group>
          <Form.Label as="legend">
            Choisissez votre moyen de paiement
          </Form.Label>
          <Col>
            <Form.Check
              className="my-2"
              type="radio"
              label="PayPal ou Carte de crédit"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormC>
  );
}

export default Payment;
