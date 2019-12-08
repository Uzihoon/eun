import React from "react";
import styles from "./Main.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Main = props => {
  const { menu, clickToLink } = props;

  return (
    <div className={cx("main-container")}>
      <div className={cx("main-content")}>
        <div className={cx("info-box")}>
          <div className={cx("info-text")}>
            Start to analyze CRISPR/Cas <br />
            with simple and fast EUN website
          </div>
        </div>
        <div className={cx("menu-container")}>
          {menu.map((m, i) => {
            return (
              <div
                className={cx("menu-box")}
                key={i}
                onClick={_ => clickToLink(m.url)}
              >
                <div className={cx("icon-box")}>
                  <img src={m.icon} />
                </div>
                <div className={cx("icon-title")}>{m.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
