import React, { useEffect, useState } from "react";
import styles from "./Indel.module.scss";
import classNames from "classnames/bind";
import { Icon } from "antd";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-colorschemes";
import "chartjs-plugin-crosshair";
import _ from "lodash";
import { ReactComponent as LineIcon } from "img/line-chart.svg";
import imgIcon from "img/img.png";

const cx = classNames.bind(styles);

const Indel = props => {
  const { data, chartType, setRef, indel, indelId, open } = props;
  const [seqList, setSeqList] = useState([]);
  const options = _.cloneDeep(props.options[chartType]);

  useEffect(() => {
    const target = indel[indelId] || { result: [] };
    const seqList = target.result.map(seq => {
      const regex = new RegExp(seq.seq_target);
      const match = seq.standard_seq.match(regex) || {};
      const start = match.index || 0;
      const end = seq.seq_target.length + start;

      return {
        list: seq.standard_seq.split(""),
        title: seq.label,
        start,
        end
      };
    });
    setSeqList(seqList);
  }, [indel]);

  return (
    <div className={cx("indel-wrapper")}>
      <div className={cx("header")}>
        <div className={cx("title-box")}>
          <div className={cx("icon")}>
            <LineIcon />
          </div>
          <div className={cx("title")}>INDEL Chart</div>
        </div>
        <div className={cx("download-box")}>
          <div className={cx("desc")}>Download for</div>
          <div className={cx("icon")} onClick={props.handleImgDownload}>
            <img src={imgIcon} />
          </div>
          {/* <div className={cx("icon")}><img src={pdfIcon}/></div> */}
        </div>
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
      <div
        className={cx("seq-list-container")}
        style={{
          height: open ? "auto" : "42px"
        }}
      >
        <div className={cx("seq-list-header")} onClick={props.handleOpen}>
          <div className={cx("seq-title")}>Seqeunce List</div>
          <div className={cx("icon-box")}>
            <Icon type={open ? "up" : "down"} />
          </div>
        </div>
        {seqList.map((seq, i) => (
          <div className={cx("seq-list-wrapper")} key={i}>
            <div className={cx("title")}>{seq.title}</div>
            <div className={cx("label-wrapper")}>
              {seq.list.map((l, j) => {
                const target = j >= seq.start && j < seq.end;
                const targetClass = target && "target-seq";
                const hover = j === props.hoverIndex - 1 && "hover-seq";
                return (
                  <div className={cx("seq", targetClass, hover)} key={j}>
                    {l}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className={cx("chart-wrapper")}>
        <Line data={data} options={options} ref={ref => setRef(ref)} />
      </div>
    </div>
  );
};

export default Indel;
