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

import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../features/users/usersApiSlice";

// 😍 N'oublions pas de transférer le TOAST au APP.JS

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector(selectedAllUsers);
  const [register, { isLoading }] = useRegisterMutation();

  // 😍 pour la page Panier
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(getAuth({ ...res }));
        navigate(redirect);
        // console.log(res);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  // Attention au controlID => name email etc.

  return (
    <FormC>
      <h1>Inscription</h1>

      <Form onSubmit={handleRegister}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Prénom </Form.Label>
          <Form.Control
            type="text"
            placeholder="Prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
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
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Confirmer votre mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Déja un compte?{" "}
          <Link
            to={redirect ? `/users/login?redirect=${redirect}` : "/users/login"}
          >
            Se connecter
          </Link>
        </Col>
      </Row>
    </FormC>
  );
}

export default Register;
