import React from "react";
import classNames from "classnames/bind";
import styles from "./Loading.module.scss";

const cx = classNames.bind(styles);

const Loading = ({ gauge, title }) => {
  return (
    <div className={cx("loading-box")}>
      <div className={cx("loading-gauge")}>
        <div
          className={cx("gauge")}
          style={{ transform: `translate(${gauge}%, 0)` }}
        />
      </div>
      <div className={cx("loading-wrapper")}>
        <div className={cx("blobs")}>
          <div className={cx("blob-center")} />
          <div className={cx("blob")} />
          <div className={cx("blob")} />
          <div className={cx("blob")} />
          <div className={cx("blob")} />
          <div className={cx("blob")} />
          <div className={cx("blob")} />
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Loading;
