import React, { useEffect, useState } from "react";
import styles from "./TopBar.module.scss";
import classNames from "classnames/bind";
import { Layout } from "antd";

const { Header } = Layout;
const cx = classNames.bind(styles);

const TopBar = props => {
  const { handleLogout, sampleLoading, nolayout, pushPage } = props;
  const [width, setWidth] = useState(110);
  const [cursor, setCursor] = useState("pointer");
  const [style, setStyle] = useState({});

  // componentDidMount
  useEffect(() => {
    let style = {};

    if (nolayout) {
      style = {
        position: "relative",
        zIndex: "1000",
        padding: "0",
        background: "transparent"
      };
    } else {
      style = {
        padding: "0",
        background: `linear-gradient(
          138deg,
          rgba(44, 172, 209, 1) 0%,
          rgba(44, 101, 177, 1) 100%
        )`
      };
    }

    setStyle(style);
  }, []);

  useEffect(() => {
    if (sampleLoading) {
      setWidth(110);
      setCursor("not-allowed");
    } else {
      setWidth(110);
      setCursor("pointer");
    }
  }, sampleLoading);

  return (
    <Header className={cx("header")} style={style}>
      <div className={cx("header-box")}>
        <div className={cx("left-side")}>
          <div className={cx("logo")} onClick={_ => pushPage("/")}>
            <div className={cx("logo-text")}>EUN</div>
          </div>
          {!nolayout &&
            props.menuList.map((menu, i) => (
              <div
                className={cx("menu-box")}
                key={i}
                onClick={_ => pushPage(menu.url)}
              >
                <div className={cx("menu")}>{menu.title}</div>
              </div>
            ))}
        </div>

        <div className={cx("right-side")}>
          {props.sampleBtn && (
            <div
              className={cx("run-sample")}
              onClick={props.runSample}
              style={{ cursor }}
            >
              <span>{sampleLoading ? "Loading..." : "Run Sample"}</span>
              <svg style={{ width: `${width}px` }}>
                <polyline
                  className={cx("o1")}
                  points={`0 0, ${width} 0, ${width} 35, 0 35, 0 0`}
                />
                <polyline
                  className={cx("o2")}
                  points={`0 0, ${width} 0, ${width} 35, 0 35, 0 0`}
                />
              </svg>
            </div>
          )}

          <div className={cx("logout")} onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>
    </Header>
  );
};

export default TopBar;
