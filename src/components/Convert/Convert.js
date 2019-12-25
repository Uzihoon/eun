import React from "react";
import classNames from "classnames/bind";
import styles from "./Convert.module.scss";
import DragBox from "components/common/DragBox";

const cx = classNames.bind(styles);

const Convert = props => {
  return (
    <div className={cx("convert-wrapper")}>
      <div className={cx("header")}>
        <div className={cx("title")}>File Convert</div>
        <div className={cx("desc")}>Convert your analysised file</div>
      </div>
      <div className={cx("upload-box")}>
        <DragBox uploadInfo={props.uploadInfo} />
      </div>
    </div>
  );
};

export default Convert;
