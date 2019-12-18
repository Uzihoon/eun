import React from "react";
import styles from "./Indel.module.scss";
import classNames from "classnames/bind";
import chartjs from "chart.js";
import { Icon } from "antd";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-colorschemes";
import "chartjs-plugin-crosshair";
import _ from "lodash";
import { ReactComponent as LineIcon } from "img/line-chart.svg";
import pdfIcon from "img/pdf.png";
import imgIcon from "img/img.png";

const cx = classNames.bind(styles);

const Indel = props => {
  const { data, chartType, setRef } = props;
  const options = _.cloneDeep(props.options[chartType]);
  return (
    <div className={cx("indel-wrapper")}>
      <div className={cx("header")}>
        <div className={cx("icon")}>
          <LineIcon />
        </div>
        <div className={cx("title")}>INDEL Chart</div>
      </div>
      {data.datasets.length < 1 && (
        <div className={cx("no-data-wrapper")}>
          <div className={cx("icon")}>
            <Icon type="warning" />
          </div>
          <div className={cx("text")}>
            If you can not see any chart data, try run
            <a href="/#/analysis">Cas Analysis</a>
            first!
          </div>
        </div>
      )}
      <div className={cx("download-box")}>
        <div className={cx("desc")}>Download for</div>
        <div className={cx("icon")} onClick={props.handleImgDownload}><img src={imgIcon}/></div>
        {/* <div className={cx("icon")}><img src={pdfIcon}/></div> */}
      </div>
      <div className={cx("chart-wrapper")}>
        <Line data={data} options={options} 
          ref={ref => setRef(ref)} 
        />
      </div>
    </div>
  );
};

export default Indel;
