import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const FormShip = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/users/login">
            <Nav.Link>Se connecter</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Se connecter</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/cart/shipping">
            <Nav.Link>Livraison</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Livraison</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/cart/payment">
            <Nav.Link>Paiement</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Paiement</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>Commande</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Commande</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default FormShip;
