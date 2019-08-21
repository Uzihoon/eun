import React from "react";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { Form, Icon, Input, Button } from "antd";

const cx = classNames.bind(styles);
const Item = Form.Item;
const Password = Input.Password;

export default Form.create({ name: "login" })(
  class extends React.Component {
    render() {
      const { handleSubmit, pending, handleRegister } = this.props;
      const { getFieldDecorator } = this.props.form;

      return (
        <Form className={cx("login-container")} onSubmit={handleSubmit}>
          <div className={cx("logo-box")}>
            <svg width="0" height="0">
              <filter id="gooey-plasma-2">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="20"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -16"
                  result="goo"
                />
              </filter>
            </svg>
            <div className={cx("plasma-2")}>
              <ul className={cx("gooey-container")}>
                <li className={cx("bubble")} />
                <li className={cx("bubble")} />
                <li className={cx("bubble")} />
                <li className={cx("bubble")} />
                <li className={cx("bubble")} />
                <li className={cx("bubble")} />
              </ul>
            </div>
          </div>
          <div className={cx("login-box")}>
            <Item className={cx("input-box")}>
              {getFieldDecorator("email", {
                rules: [
                  {
                    required: true,
                    message: "Please input email"
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon
                      type="user"
                      style={{ color: "rgba(255,255,255,.55)" }}
                    />
                  }
                  placeholder="Email"
                  style={{ backgroundColor: "transparent" }}
                />
              )}
            </Item>
            <Item className={cx("input-box")}>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "Please input password" }]
              })(
                <Password
                  placeholder="Password"
                  prefix={
                    <Icon
                      type="lock"
                      style={{ color: "rgba(255,255,255,.55)" }}
                    />
                  }
                />
              )}
            </Item>
            <div className={cx("button-box")}>
              <Button htmlType="submit" loading={pending}>
                LOGIN
              </Button>
              <Button onClick={handleRegister}>Register</Button>
            </div>
          </div>
        </Form>
      );
    }
  }
);
