import React from "react";
import styles from "./Hidden.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Hidden = () => {
  return (
    <div className={cx("hidden-wrapper")}>
      <div className={cx("animation-box")}>
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
      <div className={cx("animation-box")}>
        <svg width="0" height="0">
          <filter id="gooey-fill">
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
        <div className={cx("fill")}>
          <div className={cx("gooey-container")}>
            <span className={cx("level")}>
              <span className={cx("bubble")} />
              <span className={cx("bubble")} />
              <span className={cx("bubble")} />
              <span className={cx("bubble")} />
              <span className={cx("bubble")} />
              <span className={cx("bubble")} />
              <span className={cx("bubble")} />
              <span className={cx("bubble")} />
            </span>
          </div>
        </div>
      </div>
      <div className={cx("animation-box")}>
        <svg width="0" height="0">
          <filter id="gooey-plasma">
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
        <div className={cx("plasma")}>
          <div className={cx("gooey-container")}>
            <span className={cx("bubble")} />
            <span className={cx("bubble")} />
            <span className={cx("bubble")} />
            <span className={cx("bubble")} />
            <span className={cx("bubble")} />
            <span className={cx("bubble")} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hidden;
