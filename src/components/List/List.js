import React from "react";
import classNames from "classnames/bind";
import styles from "./List.module.scss";
import { Button } from "antd";

const cx = classNames.bind(styles);

const List = ({ userInfo }) => {
  const user = userInfo.email || "Unkown";
  return (
    <div className={cx("list-wrapper")}>
      <div className={cx("list-container")}>
        <div className={cx("welcome")}>
          Welcome, <span className={cx("point")}>{user}</span>
        </div>
      </div>
    </div>
  );
};

export default List;
