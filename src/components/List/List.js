import React from "react";
import classNames from "classnames/bind";
import styles from "./List.module.scss";
import { Button } from "antd";

const cx = classNames.bind(styles);

const List = ({ userInfo, listRender }) => {
  const user = userInfo.email.split("@")[0];

  const test = [
    {
      name: "test",
      fileCount: 5,
      target: " C",
      change: "D",
      average: "50%",
      date: "2018-09-09"
    },
    {
      name: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
      fileCount: 5,
      target: " C",
      change: "D",
      average: "50%",
      date: "2018-09-09"
    }
  ];
  return (
    <div className={cx("list-wrapper")}>
      <div className={cx("header")}>
        <div className={cx("title")}>{user}'s List</div>
      </div>
      <div className={cx("body")}>

      </div>
    </div>
  );
};

export default List;
