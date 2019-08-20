import React from "react";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { Form, Icon, Input, Button } from "antd";

const cx = classNames.bind(styles);
const Item = Form.Item;

export default Form.create({ name: "login" })(
  class extends React.Component {
    render() {
      const {
        handleSubmit,
        handleRegister,
        handleChagne,
        handleUpload
      } = this.props;
      const { getFieldDecorator } = this.props.form;

      return (
        <Form className={cx("login-container")}>
          <div className={cx("logo-box")} onClick={handleUpload}>
            {/* <svg width="0" height="0">
          <filter id="gooey-black-hole">
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
        <div className={cx("black-hole")}>
          <ul className={cx("gooey-container")}>
            <li className={cx("bubble")} />
            <li className={cx("bubble")} />
            <li className={cx("bubble")} />
            <li className={cx("bubble")} />
            <li className={cx("bubble")} />
            <li className={cx("bubble")} />
          </ul>
        </div> */}

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
        </Form>
      );
    }
  }
);
