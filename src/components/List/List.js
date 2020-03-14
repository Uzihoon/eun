import React from "react";
import classNames from "classnames/bind";
import styles from "./List.module.scss";
import { Button } from "antd";
import forensic from "img/forensic.png";

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
      name:
        "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
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
        <div className={cx("no-data")}>
          <div className={cx("img")}>
            <img src={forensic} />
          </div>
          <div className={cx("text")}>Sorry. there's no analysed list.</div>
        </div>
      </div>
    </div>
  );
};

export default List;
