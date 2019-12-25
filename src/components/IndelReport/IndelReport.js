import React from "react";
import styles from "./IndelReport.module.scss";
import classNames from "classnames/bind";
import { Button } from "antd";
import DragBox from "components/common/DragBox";

const cx = classNames.bind(styles);

const IndelReport = props => {
  return (
    <div className={cx("indel-wrapper")}>
      <div className={cx("header")}>
        <div className={cx("title")}>INDEL Type Report</div>
        <div className={cx("desc")}>This is Indel Report type bla bla bla</div>
      </div>
      <div className={cx("upload-box")}>
        <DragBox uploadInfo={props.uploadInfo} />
      </div>
      <div className={cx("button-box")}>
        <Button onClick={props.handleReport}>Report</Button>
      </div>
    </div>
  );
};

export default IndelReport;
