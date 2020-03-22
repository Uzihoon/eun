import React from "react";
import { Form, Input, Button } from "antd";
import classNames from "classnames/bind";
import styles from "./Signup.module.scss";

const cx = classNames.bind(styles);
const Item = Form.Item;
const Password = Input.Password;

export default Form.create({ name: "signup" })(
  class extends React.Component {
    renderSignup = () => {
      const {
        validateToNextPassword,
        compareToFirstPassword,
        handleConfirmBlur,
        handleSubmit,
        loading,
        pushToLogin
      } = this.props;
      const { getFieldDecorator } = this.props.form;

      return (
        <Form className={cx("signup-form")} onSubmit={handleSubmit}>
          <Item label="E-mail">
            {getFieldDecorator("username", {
              rules: [
                {
                  required: true,
                  message: "Please input your email!"
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!"
                }
              ]
            })(<Input />)}
          </Item>
          <Item label="Password" hasFeedback>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "Please input your password!"
                },
                // {
                //   min: 8
                // },
                {
                  validator: validateToNextPassword
                }
              ]
            })(<Password />)}
          </Item>
          <Item label="Confirm Password" hasFeedback>
            {getFieldDecorator("confirm", {
              rules: [
                {
                  required: true,
                  message: "Please confirm your password!"
                },
                {
                  validator: compareToFirstPassword
                }
              ]
            })(<Password onBlur={handleConfirmBlur} />)}
          </Item>
          <div className={cx("notification")}>
            Alreay joined?
            <span className={cx("login-point")} onClick={pushToLogin}>
              Login
            </span>
          </div>
          <Item>
            <div className={cx("login-button")} onClick={handleSubmit}>
              <span>Register</span>
              <svg>
                <polyline
                  className={cx("o1")}
                  points="0 0, 90 0, 90 35, 0 35, 0 0"
                />
                <polyline
                  className={cx("o2")}
                  points="0 0, 90 0, 90 35, 0 35, 0 0"
                />
              </svg>
            </div>
          </Item>
        </Form>
      );
    };

    renderConform = () => {
      const { getFieldDecorator } = this.props.form;
      const { loading, handleConfirmation, pushToLogin, username } = this.props;

      return (
        <Form onSubmit={handleConfirmation} className={cx("confirm-form")}>
          <div className={cx("sent-noti")}>
            Please check <span className={cx("point-send")}>{username}</span>
          </div>
          <Item label="Confirmation Code">
            {getFieldDecorator("code", {
              rules: [
                {
                  required: true,
                  message: "Please input confirmation code"
                }
              ]
            })(<Input />)}
          </Item>
          <div className={cx("notification")}>
            Alreay confirmed?
            <span className={cx("login-point")} onClick={pushToLogin}>
              Login
            </span>
          </div>
          <Item>
            <div className={cx("login-button")} onClick={handleConfirmation}>
              <span>Confirm</span>
              <svg>
                <polyline
                  className={cx("o1")}
                  points="0 0, 90 0, 90 35, 0 35, 0 0"
                />
                <polyline
                  className={cx("o2")}
                  points="0 0, 90 0, 90 35, 0 35, 0 0"
                />
              </svg>
            </div>
          </Item>
        </Form>
      );
    };

    render() {
      const { confirm } = this.props;
      return (
        <div className={cx("signup-container")}>
          {confirm ? this.renderConform() : this.renderSignup()}
        </div>
      );
    }
  }
);
