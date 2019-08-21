import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Analysis from "components/Analysis";
import * as uploadActions from "store/modules/upload";
import * as analysisActions from "store/modules/analysis";

class AnalysisContainer extends Component {
  constructor(props) {
    super(props);
    const { format } = props;
    console.log(format);
    this.state = {
      resultList: [
        {
          title: "Total Sequences",
          value: "joins_length"
        },
        {
          title: "With both indicator sequences",
          value: "totlr_count"
        },
        {
          title: "More than minimum frequency",
          value: "tot_count"
        },
        {
          title: "Insertions",
          value: "ins_count"
        },
        {
          title: "Deletions",
          value: "del_count"
        }
      ],
      sequenceList: [
        {
          title: "ID",
          dataIndex: "id"
        },
        {
          title: "Sequence",
          dataIndex: "origin",
          render: (text, val) => {
            const seq = val.origin.split("");
            return (
              <div className={"value-wrapper"}>
                {seq.map((e, i) => {
                  const diff = val.graphic[i] !== "|" ? "diff" : "";
                  const targetDiff =
                    val.origin[i] === format.targetSeq &&
                    val.change[i] === format.changeSeq
                      ? "target-diff"
                      : null;
                  const diffClass = targetDiff || diff;
                  return (
                    <div className="value-box" key={i}>
                      <div className={diffClass}>{val.origin[i]}</div>
                      <div className={diffClass}>{val.change[i]}</div>
                    </div>
                  );
                })}
              </div>
            );
          }
        },
        {
          title: "Length",
          dataIndex: "length",
          sorter: (a, b) => a.length - b.length
        },
        {
          title: "Count",
          dataIndex: "count",
          sorter: (a, b) => a.count - b.count
        },
        {
          title: "Type",
          dataIndex: "type",
          redner: text => {
            if (text === 0) return "WT or Sub";
            if (text === 1) return "Ins";
            return "del";
          }
        },
        {
          title: "HDR",
          dataIndex: "hdr",
          render: text => {
            if (text < -1) return "N/A";
            if (text === -1) return "X";
            return "O";
          }
        }
      ],
      sequenceCharList: ["A", "C", "G", "T"]
    };
  }

  componentDidMount() {
    const { summary, history } = this.props;
    if (summary.length <= 0) history.push("/upload");
  }

  componentWillUnmount() {
    const { UploadActions, AnalysisActions } = this.props;
    UploadActions.resetUpload();
    AnalysisActions.resetAnalysis();
  }

  render() {
    return <Analysis {...this.state} {...this.props} />;
  }
}

export default withRouter(
  connect(
    state => ({
      summary: state.analysis.get("summary").toJS(),
      analysisList: state.analysis.get("analysis").toJS(),
      format: state.upload.get("format").toJS(),
      failList: state.analysis.get("failList").toJS()
    }),
    dispatch => ({
      UploadActions: bindActionCreators(uploadActions, dispatch),
      AnalysisActions: bindActionCreators(analysisActions, dispatch)
    })
  )(AnalysisContainer)
);
