import React from "react";
import classNames from "classnames/bind";
import styles from "./Analysis.module.scss";
import { Table, Icon } from "antd";

const cx = classNames.bind(styles);

const Analysis = ({
  summary,
  analysis,
  format,
  resultList,
  sequenceCharList,
  sequenceList
}) => {
  console.log(analysis);
  const charIndex = analysis.chartIndex || [];
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
          <div className={cx("sum-val")} />
        </div>
        <div className={cx("summary-item")}>
          <div className={cx("sum-title")}>
            <div className={cx("sum-title-text")}>Result</div>
          </div>
          <div className={cx("sum-val")}>
            {resultList.map((e, i) => (
              <div className={cx("result-item")} key={i}>
                <div className={cx("result-title")}>{e.title}</div>
                <div className={cx("result-val")}>{analysis[e.value] || 0}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={cx("summary-item")}>
          <div className={cx("sum-title")}>
            <div className={cx("sum-title-text")}>Sequence Information</div>
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
                <div className={cx("char")} key={j}>
                  {k}
                </div>
              ))}
            </div>

            {charIndex.map((e, i) => {
              const total = analysis.tot_count;
              return (
                <div className={cx("char-box")} key={i}>
                  {sequenceCharList.map((k, j) => {
                    const val = e[k] > 0 ? Math.round((e[k] / total) * 100) : 0;
                    return (
                      <div className={cx("char")} key={j}>
                        {val}
                      </div>
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
              <Icon type="right" />
              <div className={cx("seq")}>{format.changeSeq}</div>
            </div>
            <div className={cx("change-result")}>
              {analysis.changed > 0 ? analysis.changed / analysis.tot_count : 0}
              ({analysis.changed}/{analysis.tot_count})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
