import React, { useState } from "react";
import FormC from "../FormC";
import { Button, Form } from "react-bootstrap";
import FormShip from "../FormShip";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectedAllCart, shipAddress } from "../../features/cartSlice";

export default function Shipping() {
  const cart = useSelector(selectedAllCart);
  const { shippingAddress } = cart;

  // Permet de save l'adresse sur la barre Form
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //
  const handleShipping = (e) => {
    e.preventDefault();
    dispatch(shipAddress({ address, city, postalCode, country }));
    navigate("/cart/payment");
  };

  return (
    <FormC>
      <FormShip step1 step2 />
      <h1>Adresse de livraison</h1>
      <Form onSubmit={handleShipping}>
        <Form.Group className="my-2" controlId="address">
          <Form.Label>Adresse</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer votre adresse"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="city">
          <Form.Label>Ville</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer la ville"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="postalCode">
          <Form.Label>Code postal</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer le code postal"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="country">
          <Form.Label>Pays</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer le pays"
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormC>
  );
}
