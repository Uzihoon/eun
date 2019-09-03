import React from "react";
import classNames from "classnames/bind";
import styles from "./List.module.scss";
import { Button } from "antd";

const cx = classNames.bind(styles);

const List = ({ userInfo, listRender }) => {
  const user = userInfo.email || "Unkown";
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
      <div className={cx("list-container")}>
        <div className={cx("list-title")}>Report List</div>
        <div className={cx("list-header")}>
          {listRender.map((e, i) => (
            <div className={cx("list-item", e.key)} key={i}>
              {e.title}
            </div>
          ))}
        </div>
        <div className={cx("list-body")}>
          {test.map((data, key) => {
            return (
              <div className={cx("list-item-box")} key={key}>
                {listRender.map((e, i) => {
                  const value = e.render ? e.render(data, key) : data[e.key];
                  return (
                    <div key={i} className={cx("list-item", e.key)}>
                      {value}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default List;
