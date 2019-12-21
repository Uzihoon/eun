import React from "react";
import styles from "./IndelReport.module.scss";
import classNames from "classnames/bind";
import { Upload, Button } from "antd";
import UploadIcon from "img/gene.png";

const cx = classNames.bind(styles);
const Dragger = Upload.Dragger;

const IndelReport = props => {
  return (
    <div className={cx("indel-wrapper")}>
      <div className={cx("header")}>
        <div className={cx("title")}>INDEL Type Report</div>
        <div className={cx("desc")}>This is Indel Report type bla bla bla</div>
      </div>
      <div className={cx("upload-box")}>
        <Dragger {...props.uploadInfo}>
          <p className={cx("upload-icon")}>
            <img src={UploadIcon} />
          </p>
          <p className={cx("upload-text")}>
            Click or drag file to this area to upload
          </p>
        </Dragger>
      </div>
      <div className={cx("button-box")}>
        <Button onClick={props.handleReport}>Report</Button>
      </div>
    </div>
  );
};

export default IndelReport;
