import React from "react";
import classNames from "classnames/bind";
import styles from "./DragBox.module.scss";
import { Upload } from "antd";
import UploadIcon from "img/gene.png";

const Dragger = Upload.Dragger;
const cx = classNames.bind(styles);

const DragBox = props => (
  <Dragger {...props.uploadInfo}>
    <p className={cx("upload-icon")}>
      <img src={UploadIcon} />
    </p>
    <p className={cx("upload-text")}>
      Click or drag file to this area to upload
    </p>
  </Dragger>
);

export default DragBox;
