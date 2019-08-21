import React from "react";
import classNames from "classnames/bind";
import styles from "./List.module.scss";
import { Button } from "antd";

const cx = classNames.bind(styles);

const List = ({ userInfo }) => {
  const user = userInfo.email || "Unkown";
  return (
    <div className={cx("list-wrapper")}>
      <div className={cx("welcome")}>
        <span className={cx("point")}>{user}</span> 저장된 결과 0개
      </div>
      <div className={cx("summary")}>
        <Button>분석하기</Button>
      </div>
    </div>
  );
};

export default List;
