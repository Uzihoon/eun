import React from "react";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { Form, Icon, Input, Button } from "antd";

const cx = classNames.bind(styles);
const Item = Form.Item;

const Login = ({ handleSubmit, handleRegister, handleChagne }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="id" onChange={e => handleChagne("email", e)} />
        <input name="password" onChange={e => handleChagne("password", e)} />
        <button type="subtmi">LOGIN</button>
      </form>
      <form onSubmit={handleRegister}>
        <input />
        <input />
        <button type="subtmi">REGISTER</button>
      </form>
    </>
  );
};

export default Login;
