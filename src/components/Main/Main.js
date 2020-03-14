import React, { useEffect } from "react";
import styles from "./Main.module.scss";
import classNames from "classnames/bind";
import { connect } from "react-redux";
import { API } from "aws-amplify";
import { join } from "path";

const cx = classNames.bind(styles);

const Main = props => {
  const { menuList, clickToLink, authed } = props;

  useEffect(() => {
    async function Load() {
      if (!authed) return;

      try {
        const list = await loadEun();
        console.log(list);
      } catch (e) {
        console.error(e);
      }
    }
    // Load();
    console.log(menuList);
  }, [authed]);

  function loadEun() {
    return API.get("eun", "/eun");
  }

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
          {menuList.map((m, i) => {
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

export default connect(state => ({
  authed: state.state.get("authed")
}))(Main);
