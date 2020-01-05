import React from "react";
import classNames from "classnames/bind";
import styles from "./Analysis.module.scss";
import { Table, Icon, Tooltip } from "antd";
import Excel from "components/Excel";

const cx = classNames.bind(styles);

const Analysis = props => {
  const {
    summary,
    format,
    resultList,
    sequenceCharList,
    sequenceList,
    handleExcel,
    handleIndel,
    analysisId,
    handleIndelFile,
    download,
    sequenceFix,
    infoColorList,
    changeColorList,
    setRef
  } = props;
  const analysisList = props.analysisList[analysisId];
  if (!analysisList) return "";
  const summaryList = Object.keys(analysisList).sort((a, b) => {
    const findNumber = new RegExp(/[0-9]+/);
    const firstNumber = a.match(findNumber);
    const lastNumber = b.match(findNumber);
    const prev = firstNumber && firstNumber.length > 0 ? +firstNumber[0] : a;
    const next = lastNumber && lastNumber.length > 0 ? +lastNumber[0] : b;

    return prev - next;
  });
  const seqList = format[analysisId].seq_RGEN.split("") || [];
  return (
    <div
      className={cx("analysis-wrapper", sequenceFix && "analysis-fix-wrapper")}
    >
      <div className={cx("summary")}>
        <div className={cx("title-box")}>
          <div className={cx("title")}>Summary</div>
          <div className={cx("download-box")}>
            <div className={cx("btn-box", "indel-btn")} onClick={handleIndel}>
              <Icon type="line-chart" />
              <span className={cx("btn-guide")}>INDEL Type Report</span>
            </div>
            <div
              className={cx("btn-box", "report-btn")}
              onClick={handleIndelFile}
            >
              <Icon type="file-text" />
              <span className={cx("btn-guide")}>Download for INDEL Report</span>
            </div>
            <div className={cx("btn-box", "excel-btn")} onClick={handleExcel}>
              <Icon type="file-excel" />
              <span className={cx("btn-guide")}>Download for Excel</span>
            </div>
            {download && <Excel {...props} />}
          </div>
        </div>
        <div
          className={cx(
            "summary-item",
            "fix-sequence",
            !sequenceFix && "close"
          )}
          ref={ref => setRef(ref, "sequence")}
        >
          <div className={cx("fix-wrapper")}>
            <div className={cx("sum-title")}>
              <div className={cx("sum-title-text")}>
                Reference Amplicon Sequence
              </div>
              <div className={cx("sum-info")}>
                <div className={cx("info")}>
                  <div className={cx("blue", "info-icon")} />
                  <div className={cx("text")}>Comparision sequence</div>
                </div>
                <div className={cx("info")}>
                  <div className={cx("green", "info-icon")} />
                  <div className={cx("text")}>crRNA sequence</div>
                </div>
              </div>
            </div>
            <div className={cx("sum-val", "wt-wrapper")}>
              {summary[analysisId].map((e, i) => (
                <span className={cx(`sum-${e.type}`)} key={i}>
                  {e.data}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div
          className={cx("summary-item")}
          ref={ref => setRef(ref, "sequence")}
        >
          <div className={cx("sum-title")}>
            <div className={cx("sum-title-text")}>
              Reference Amplicon Sequence
            </div>
            <div className={cx("sum-info")}>
              <div className={cx("info")}>
                <div className={cx("blue", "info-icon")} />
                <div className={cx("text")}>Comparision sequence</div>
              </div>
              <div className={cx("info")}>
                <div className={cx("green", "info-icon")} />
                <div className={cx("text")}>crRNA sequence</div>
              </div>
            </div>
          </div>
          <div className={cx("sum-val", "wt-wrapper")}>
            {summary[analysisId].map((e, i) => (
              <span className={cx(`sum-${e.type}`)} key={i}>
                {e.data}
              </span>
            ))}
          </div>
        </div>
        {summaryList.map((e, i) => {
          const analysis = analysisList[e];
          const charIndex = analysis.chartIndex || [];
          return (
            <div className={cx("analysis-container")} key={i}>
              <div className={cx("analysis-id")}>{analysis.fileId}</div>
              <div className={cx("summary-item")}>
                <div className={cx("sum-title")}>
                  <div className={cx("sum-title-text")}>Result</div>
                </div>
                <div className={cx("sum-val")}>
                  {resultList.map((e, i) => (
                    <div className={cx("result-item")} key={i}>
                      <div className={cx("result-title")}>{e.title}</div>
                      <div className={cx("result-val")}>
                        {analysis[e.value] || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={cx("summary-item")}>
                <div className={cx("sum-title")}>
                  <div className={cx("sum-title-text")}>
                    Sequence Information
                  </div>
                  <div className={cx("color-wrapper")}>
                    {infoColorList.map((e, i) => {
                      return (
                        <div className={cx("color-box", e.class)} key={i}>
                          <div className={cx("bg")} />
                          <div className={cx("text")}>{e.title}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={cx("sum-val")}>
                  <Table
                    columns={sequenceList}
                    rowKey={record => record.id}
                    dataSource={analysis.table}
                  />
                </div>
              </div>
              <div className={cx("summary-item")}>
                <div className={cx("sum-title")}>
                  <div className={cx("sum-title-text")}>Sequence</div>
                  <div className={cx("color-wrapper")}>
                    {changeColorList.map((e, i) => {
                      return (
                        <div className={cx("color-box", e.class)} key={i}>
                          <div className={cx("bg")} />
                          <div className={cx("text")}>{e.title}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={cx("sum-val")}>
                  <div className={cx("char-box")}></div>
                  {seqList.map((s, i) => {
                    const index = seqList.length - i;
                    return (
                      <div className={cx("char-box", "origin-char")} key={i}>
                        {s} {index}
                      </div>
                    );
                  })}
                </div>
                <div className={cx("sum-val")}>
                  <div className={cx("char-box")}>
                    {sequenceCharList.map((k, j) => (
                      <div className={cx("char", "char-title")} key={j}>
                        {k}
                      </div>
                    ))}
                  </div>
                  {charIndex.map((e, i) => {
                    const total = analysis.tot_count;
                    return (
                      <div className={cx("char-box")} key={i}>
                        {sequenceCharList.map((k, j) => {
                          const val =
                            e[k] > 0 ? ((e[k] / total) * 100).toFixed(1) : 0;

                          const origin = +val > 0 && k === seqList[i];
                          const change =
                            +val > 0 &&
                            seqList[i] === format[analysisId].targetSeq &&
                            k === format[analysisId].changeSeq;
                          const sub = +val > 0 && !change && k !== seqList[i];
                          const opacity =
                            +val <= 0
                              ? 1
                              : Math.max(Math.floor(val / 10) / 10, 0.1);

                          const color = opacity < 0.3 ? "#242424" : "#fffff";
                          const charClass = {
                            char: true,
                            "sub-val": sub,
                            "origin-val": origin,
                            "target-val": change,
                            changed: sub || origin || change
                          };

                          return (
                            <Tooltip key={j} title={e[k]}>
                              <div className={cx(charClass)}>
                                <div className={cx("bg")} style={{ opacity }} />
                                <span style={{ color }}>{+val}</span>
                              </div>
                            </Tooltip>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={cx("summary-item")}>
                <div className={cx("sum-title")}>
                  <div className={cx("sum-title-text")}>Changed</div>
                  <div className={cx("standard")}>
                    {`Standard Length: ${analysis.standardLen}`}
                  </div>
                </div>
                <div className={cx("sum-val")}>
                  <div className={cx("change-seq")}>
                    <div className={cx("seq")}>
                      {format[analysisId].targetSeq}
                    </div>
                    <Icon type="arrow-right" />
                    <div className={cx("seq")}>
                      {format[analysisId].changeSeq}
                    </div>
                  </div>
                  <Tooltip title={`${analysis.changed}/${analysis.tot_count}`}>
                    <div className={cx("change-result")}>
                      {analysis.changed > 0
                        ? (
                            (analysis.changed / analysis.tot_count) *
                            100
                          ).toFixed(2) + "%"
                        : 0}
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Analysis;
