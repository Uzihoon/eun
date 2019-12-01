import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Analysis from "components/Analysis";
import Webworker from "worker/Webworker";
import analysisWorker from "worker/analysis.worker.js";
import indelWorker from "worker/indel.worker.js";
import Loading from "components/common/Loading";

import * as uploadActions from "store/modules/upload";
import * as analysisActions from "store/modules/analysis";
import * as stateActions from "store/modules/state";

class AnalysisContainer extends Component {
  constructor(props) {
    super(props);
    const { format } = props;
    this.state = {
      indelStatus: {
        loading: false,
        gauge: 0
      },
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
          value: "cnt_ins"
        },
        {
          title: "Deletions",
          value: "cnt_del"
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
          render: text => {
            if (+text === 0) return "WT or Sub";
            if (+text === 1) return "INS";
            return "DEL";
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
      sequenceCharList: ["A", "C", "G", "T"],
      download: false,
      excelData: null
    };
  }

  componentDidMount() {
    const { summary, history, StateActions } = this.props;
    StateActions.setState({ key: "sampleLoading", value: false });
    if (summary.length <= 0) {
      history.push("/upload");
    } else {
      this.analysisWorker = new Webworker(analysisWorker);
      this.analysisWorker.onmessage = this.getDownload;

      this.indelWorker = new Webworker(indelWorker);
      this.indelWorker.onmessage = this.getIndelWorker;
    }
  }

  getIndelWorker = e => {
    console.log(e);
  }

  getDownload = e => {
    const data = e.data;
    this.setState({
      download: true,
      excelData: data
    });
  };

  componentWillUnmount() {
    const { UploadActions, AnalysisActions } = this.props;
    UploadActions.resetUpload();
    AnalysisActions.resetAnalysis();
  }

  handleExcel = _ => {
    const { resultList, sequenceCharList } = this.state;
    const { analysisList, format } = this.props;
    this.setState({ download: false, excelData: null });
    this.analysisWorker.postMessage({
      analysisList,
      resultList,
      sequenceCharList,
      format
    });
  };

  handleIndel = _ => {
    const { analysisList } = this.props;
    this.indelWorker.postMessage(analysisList);
  }

  render() {
    const { indelStatus } = this.state;
    return (
      <>
        <Analysis {...this.state} {...this.props} {...this} />
        {indelStatus.loading && <Loading title="" gauge={indelStatus.gauge}/>}
      </>
    )
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
      AnalysisActions: bindActionCreators(analysisActions, dispatch),
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(AnalysisContainer)
);
