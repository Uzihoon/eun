import React from "react";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { Form, Icon, Input } from "antd";
import bg from "img/bg.png";

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
        <div className={cx("for-daeun")}>@2019 Uzihoon to Da-Eun Yoon</div>
          <div className={cx("circle")}>
            <img src={bg} />
          </div>
          <div className={cx("project-info")}>
            <div className={cx("desc")}>
              This is the first project by Uzihoon
            </div>
            <div className={cx("small")}>
              If you want to register, you can contact me via email
            </div>
            <div className={cx("email")}>uzihoon.dev@gmail.com</div>
            <div className={cx("sns-box")}>
              <a href="https://github.com/Uzihoon">
                <Icon type="github" />
              </a>
            </div>
          </div>
          <div className={cx("login-box")}>
            <div className={cx("title")}>EUN Project</div>
            <div className={cx("sub-desc")}>
              This website provides the easy way to analyze CRISPR/Cas
              efficiency.<br/>
              Simple and fast with Javascript
            </div>
            <div className={cx("login-form")}>
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
                <div className={cx("login-button")} onClick={handleSubmit}>
                  <span>LOGIN</span>
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
                {/* 190826 disable register */}
                <div className={cx("login-button")} onClick={handleRegister}>
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
              </div>
            </div>
          </div>
        </Form>
      );
    }
  }
);
