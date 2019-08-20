import React from "react";
import classNames from "classnames/bind";
import styles from "./Analysis.module.scss";
import { Table, Icon, Tooltip } from "antd";

const cx = classNames.bind(styles);

const Analysis = ({
  summary,
  analysisList,
  format,
  resultList,
  sequenceCharList,
  sequenceList,
  failList
}) => {
  console.log(failList);
  const summaryList = Object.keys(analysisList);
  return (
    <div className={cx("analysis-wrapper")}>
      <div className={cx("summary")}>
        <div className={cx("title")}>Summary</div>
        <div className={cx("summary-item")}>
          <div className={cx("sum-title")}>
            <div className={cx("sum-title-text")}>WT Sequence</div>
            <div className={cx("sum-info")}>
              <div className={cx("info")}>
                <div className={cx("blue", "info-icon")} />
                <div className={cx("text")}>
                  indicator sequences at each ends of comparision range
                </div>
              </div>
              <div className={cx("info")}>
                <div className={cx("green", "info-icon")} />
                <div className={cx("text")}>crRNA sequence</div>
              </div>
              <div className={cx("info")}>
                <div className={cx("red", "info-icon")} />
                <div className={cx("text")}>WT marker sequence</div>
              </div>
            </div>
          </div>
          <div className={cx("sum-val")}>
            {summary.map((e, i) => (
              <div className={cx(`sum-${e.type}`)} key={i}>
                {e.data}
              </div>
            ))}
          </div>
        </div>
        <div className={cx("summary-item")}>
          <div className={cx("sum-title")}>
            <div className={cx("sum-title-text")}>crRNA sequence</div>
          </div>
          <div className={cx("sum-val")}>{format.seq_RGEN}</div>
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
                          return (
                            <Tooltip key={j} title={e[k]}>
                              <div className={cx("char")}>{val}</div>
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
                </div>
                <div className={cx("sum-val")}>
                  <div className={cx("change-seq")}>
                    <div className={cx("seq")}>{format.targetSeq}</div>
                    <Icon type="arrow-right" />
                    <div className={cx("seq")}>{format.changeSeq}</div>
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
