import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Analysis from "components/Analysis";
import Webworker from "worker/Webworker";
import analysisWorker from "worker/analysis.worker.js";
import indelWorker from "worker/indel.worker.js";
import Loading from "components/common/Loading";
import { getUniqId } from "lib/utility";

import * as uploadActions from "store/modules/upload";
import * as analysisActions from "store/modules/analysis";
import * as stateActions from "store/modules/state";
import * as indelActions from "store/modules/indel";

class AnalysisContainer extends Component {
  constructor(props) {
    super(props);
    const { format, match } = props;
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
            const { analysisId } = this.state;
            const seq = val.origin.split("");
            return (
              <div className={"value-wrapper"}>
                {seq.map((e, i) => {
                  const diff = val.graphic[i] !== "|" ? "diff" : "";
                  const targetDiff =
                    val.origin[i] === format[analysisId].targetSeq &&
                    val.change[i] === format[analysisId].changeSeq
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
          filters: [
            { text: "WT or Sub", value: 0 },
            { text: "INS", value: 1 },
            { text: "DEL", value: 2 }
          ],
          onFilter: (value, record) => record.type === value,
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
      excelData: null,
      analysisId: match.params.analysisId
    };
  }

  componentWillMount() {
    const { summary, history } = this.props;
    const { analysisId } = this.state;
    const targetSUM = summary[analysisId];

    if (!analysisId || !targetSUM || targetSUM.length <= 0) {
      history.push("/analysis");
    }
  }

  componentDidMount() {
    const { StateActions } = this.props;
    StateActions.setState({ key: "sampleLoading", value: false });

    this.analysisWorker = new Webworker(analysisWorker);
    this.analysisWorker.onmessage = this.getDownload;

    this.indelWorker = new Webworker(indelWorker);
    this.indelWorker.onmessage = this.getIndelWorker;
  }

  getIndelWorker = e => {
    const { history, IndelActions } = this.props;
    const id = getUniqId();
    IndelActions.saveIndel({ id, data: e.data });
    history.push(`/indel/${id}`);
  };

  getDownload = e => {
    const data = e.data;
    this.setState({
      download: true,
      excelData: data
    });
  };

  componentWillUnmount() {
    const { UploadActions } = this.props;
    UploadActions.resetUpload();
  }

  handleExcel = _ => {
    const { resultList, sequenceCharList, analysisId } = this.state;
    const { analysisList, format } = this.props;
    this.setState({ download: false, excelData: null });
    this.analysisWorker.postMessage({
      analysisList: analysisList[analysisId],
      resultList,
      sequenceCharList,
      format: format[analysisId]
    });
  };

  getAnalysisData = _ => {
    const { analysisId } = this.state;
    const { analysisList } = this.props;
    return analysisList[analysisId] || {};
  };

  handleIndel = _ => {
    const { analysisId } = this.state;
    const { analysisList, format } = this.props;
    const target = format[analysisId] || {};
    const key = `${target.targetSeq}${target.changeSeq}`;
    const indel = [{ key, value: analysisList[analysisId] }];
    this.indelWorker.postMessage(indel);
  };

  handleIndelFile = _ => {
    const { analysisId } = this.state;
    const { format } = this.props;

    const target = format[analysisId] || {};
    const analysisData = JSON.stringify(this.getAnalysisData());
    const fileName = `${target.targetSeq}${target.changeSeq}`;
    const blob = new Blob([analysisData], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  render() {
    const { indelStatus } = this.state;
    return (
      <>
        <Analysis {...this.state} {...this.props} {...this} />
        {indelStatus.loading && <Loading title="" gauge={indelStatus.gauge} />}
      </>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      summary: state.analysis.get("summary").toJS(),
      analysisList: state.analysis.get("analysisList").toJS(),
      format: state.analysis.get("format").toJS(),
      failList: state.analysis.get("failList").toJS()
    }),
    dispatch => ({
      UploadActions: bindActionCreators(uploadActions, dispatch),
      AnalysisActions: bindActionCreators(analysisActions, dispatch),
      StateActions: bindActionCreators(stateActions, dispatch),
      IndelActions: bindActionCreators(indelActions, dispatch)
    })
  )(AnalysisContainer)
);
