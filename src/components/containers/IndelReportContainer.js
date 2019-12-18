import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import IndelReport from "components/IndelReport";
import Webworker from "worker/Webworker";
import indelWorker from "worker/indel.worker.js";
import { withRouter } from "react-router";
import { getUniqId } from "lib/utility";

import * as indelActions from "store/modules/indel";

const IndelReportContainer = props => {
  const fileList = [];
  const [state, setState] = useState({
    uploadInfo: {
      name: "json",
      accept: "application/json, .json",
      beforeUpload: file => {
        const hasFile = getFileIndex(file);
        if (hasFile < 0) {
          readFile(file);
        }
        return false;
      },
      multiple: true,
      onRemove: file => {
        const index = getFileIndex(file);
        if (index >= 0) {
          const fileList = [...state.fileList];
          fileList.splice(index, 1);
        }
        return false;
      }
    }
  });
  let worker;

  const readFile = file => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = event => setFileList(event, file);
  };

  const setFileList = (event, file) => {
    const value = JSON.parse(event.target.result);
    const key = file.name.replace(".json", "").replace("_", " ");
    fileList.push({ key, value });
  };

  // componentDidMount
  useEffect(() => {
    worker = new Webworker(indelWorker);
    worker.onmessage = handleMessage;
  }, []);

  const getFileIndex = file => {
    return fileList.findIndex(e => {
      const key = e.key || "";
      const name = key.replace(" ", "_") + ".json";
      return name === file.name;
    });
  };

  const handleMessage = message => {
    const { history, IndelActions } = props;
    const id = getUniqId();
    IndelActions.saveIndel({ id, data: message.data });
    history.push(`/indel/${id}`);
  };

  const handleReport = _ => {
    console.log(fileList);
    worker.postMessage(fileList);
  };

  return <IndelReport {...state} {...props} handleReport={handleReport} />;
};

export default withRouter(
  connect(
    state => ({}),
    dispatch => ({
      IndelActions: bindActionCreators(indelActions, dispatch)
    })
  )(IndelReportContainer)
);
