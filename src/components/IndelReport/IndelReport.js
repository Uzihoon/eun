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
        <div className={cx("desc")}>
          This chart shows the average indel position of analyzed data. You can
          compare the position of cleavage or indel site of multiple target
          sequences.
          <p>
            Please run{" "}
            <b>
              <a href="/#/analysis">Cas analysis</a>
            </b>{" "}
            first, and put <b>.json</b> file here.
          </p>
        </div>
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
