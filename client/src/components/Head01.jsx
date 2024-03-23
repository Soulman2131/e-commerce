import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";

function Header() {
  return (
    <>
      <header>
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>
                <img src={logo} alt="logo de la boutique" />
                Boutique en ligne
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basics-navbar-nav" />
            <Navbar.Collapse id="basics-navbar-nav">
              <Nav className="ms-auto">
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser /> Connexion
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/cart">
                  <Nav.Link>
                    <FaShoppingCart /> Panier
                  </Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
}

export default Header;
