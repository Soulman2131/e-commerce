import React from "react";
import FormC from "./FormC";
import { Form } from "react-bootstrap";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuth, selectedAllUsers } from "../features/users/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLoginMutation } from "../features/users/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

// 😍 N'oublions pas de transférer le TOAST au APP.JS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector(selectedAllUsers);

  const [login, { isLoading }] = useLoginMutation();

  // 😍 pour la page Panier
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(getAuth({ ...res }));
      navigate(redirect);
      // console.log(res);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormC>
      <h1>Connexion</h1>

      <Form onSubmit={handleLogin}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email </Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          className="mt-3"
        >
          Se connecter
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Nouvel utilisateur?{" "}
          <Link
            to={
              redirect
                ? `/users/register?redirect=${redirect}`
                : "/users/register"
            }
          >
            S'inscrire
          </Link>
        </Col>
      </Row>
    </FormC>
  );
}

export default Login;
