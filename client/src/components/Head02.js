import React from "react";
import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import { selectedAllCart } from "../features/cartSlice";
import { logout, selectedAllUsers } from "../features/users/authSlice";
import { NavDropdown } from "react-bootstrap";
import { useLogoutMutation } from "../features/users/usersApiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const { cartItems } = useSelector(selectedAllCart);
  // console.log(cartItems);
  const { userInfo } = useSelector(selectedAllUsers);
  const [logoutApi] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //
  const handleLogout = async () => {
    try {
      const res = await logoutApi().unwrap();
      dispatch(logout(res));
      navigate("/users/login");
    } catch (error) {
      console.error(error);
    }
  };

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
                {/* 😍 */}
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/users/profile">
                      <NavDropdown.Item> Profil</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={handleLogout}>
                      {" "}
                      Déconnexion
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/users/login">
                    <Nav.Link>
                      <FaUser /> Se connecter
                    </Nav.Link>
                  </LinkContainer>
                )}

                <LinkContainer to="/cart">
                  <Nav.Link>
                    <FaShoppingCart /> Panier
                    {/* 😍 */}
                    {cartItems.length > 0 && (
                      <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </Badge>
                    )}
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
