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
        loading
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
                {
                  min: 6
                },
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
          <Item>
            <Button htmlType="submit" loading={loading}>
              Register
            </Button>
          </Item>
        </Form>
      );
    };

    renderConform = () => {
      const { getFieldDecorator } = this.props.form;
      const { loading, handleConfirmation } = this.props;

      return (
        <Form onSubmit={handleConfirmation}>
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
          <Item>
            <Button htmlType="submit" loading={loading}>
              Confirm
            </Button>
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
