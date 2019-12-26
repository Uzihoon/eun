import React from "react";
import classNames from "classnames/bind";
import styles from "./Version.module.scss";
import history from "lib/history.json";
import moment from "moment";
import confetti from "img/confetti.png";

const cx = classNames.bind(styles);

const content = [
  {
    key: "release",
    title: "Release",
    icon: confetti
  },
  {
    key: "bug",
    title: "Bug Fixes"
  },
  {
    key: "feature",
    title: "New Features"
  }
];

const upperChar = title => title.charAt(0).toUpperCase() + title.slice(1);

const Version = _ => {
  return (
    <div className={cx("version-wrapper")}>
      <div className={cx("header")}>
        <div className={cx("title")}>EUN Version</div>
      </div>
      <div className={cx("version-content")}>
        {history.map((v, i) => (
          <div className={cx("version-box")} key={i}>
            <div className={cx("version-header")}>
              <div className={cx("version")}>{v.version}</div>
              <div className={cx("date")}>
                {moment(v.date).format("MMMM DD, YYYY")}
              </div>
            </div>
            {content.map(
              (c, k) =>
                v.log[c.key].length > 0 && (
                  <div className={cx("history-wrapper")} key={k}>
                    <div className={cx("history-title")}>
                      {c.title}
                      {c.icon && <img src={c.icon} />}
                    </div>

                    <div className={cx("history-content")}>
                      {v.log[c.key].map((r, j) => (
                        <div className={cx("history")} key={j}>
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Version;
