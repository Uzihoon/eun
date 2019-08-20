import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Analysis from "components/Analysis";

class AnalysisContainer extends Component {
  constructor(props) {
    super(props);
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
                  return (
                    <div className="value-box" key={i}>
                      <div className={diff}>{val.origin[i]}</div>
                      <div className={diff}>{val.change[i]}</div>
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
    null
  )(AnalysisContainer)
);
