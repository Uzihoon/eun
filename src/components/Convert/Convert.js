import React from "react";
import classNames from "classnames/bind";
import styles from "./Convert.module.scss";
import DragBox from "components/common/DragBox";
import { Button } from "antd";

const cx = classNames.bind(styles);

const Convert = props => {
  const { selected, handleConvert } = props;
  return (
    <div className={cx("convert-wrapper")}>
      <div className={cx("header")}>
        <div className={cx("title")}>File Convert</div>
        <div className={cx("desc")}>
          You can convert the file or change the sequence data.
          <br />
          Click the button what you want to convert and after convert, it would
          be downloaded for zip file.
        </div>
      </div>
      <div className={cx("upload-box")}>
        <DragBox uploadInfo={props.uploadInfo} />
      </div>
      <div className={cx("select-wrapper")}>
        <div className={cx("select-title")}>Select convert types</div>
        <div className={cx("select-content")}>
          {props.convertList.map((c, i) => {
            const selectConvert = selected.findIndex(e => e === c.id);
            const selectClass = selectConvert >= 0 && "select-convert";

            return (
              <div className={cx("convert-box")} key={i}>
                <div
                  className={cx("icon-box", selectClass)}
                  onClick={_ => handleConvert(c.id)}
                >
                  <div className={cx("img")}>
                    <img src={c.icon} />
                  </div>
                </div>
                <div className={cx("title-box")}>{c.title}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cx("button-box")}>
        <Button onClick={props.handleConvertFile}>Convert</Button>
      </div>
    </div>
  );
};

export default Convert;
