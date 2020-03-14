import React from "react";
import { connect } from "react-redux";
import styles from "./InnerLoader.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function InnerLoader({ innerLoading }) {
  if (!innerLoading) return "";
  return (
    <div className={cx("loader-wrapper")}>
      <div className={cx("lds-ellipsis")}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default connect(state => ({
  innerLoading: state.state.get("innerLoading")
}))(InnerLoader);
