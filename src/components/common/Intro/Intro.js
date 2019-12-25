import React from "react";
import classNames from "classnames/bind";
import styles from "./Intro.module.scss";
import bg from "img/bg.png";

const cx = classNames.bind(styles);

const Intro = () => {
  return (
    <div className={cx("intro-wrapper")}>
      <div className={cx("intro-loader")}>
        <img src={bg} />
      </div>
    </div>
  );
};

export default Intro;
