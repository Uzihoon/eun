import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import IndelReport from "components/IndelReport";
import Webworker from "worker/Webworker";
import indelWorker from "worker/indel.worker.js";

const IndelReportContainer = props => {
  const fileList = [];
  const [state, setState] = useState({
    uploadInfo: {
      name: "json",
      accept: "application/json, .json",
      beforeUpload: file => {
        console.log(file);
        const hasFile = getFileIndex(file);
        if (hasFile < 0) {
          readFile(file);
        }
        return false;
      },
      multiple: true,
      onRemove: file => {
        const index = getFileIndex(file);
        console.log(index);
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
    reader.onload = setFileList;
  };

  const setFileList = event => {
    const data = event.target.result;
    fileList.push(JSON.parse(data));
  };

  // componentDidMount
  useEffect(() => {
    worker = new Webworker(indelWorker);
    worker.onmessage = handleMessage;
  }, []);

  const getFileIndex = file => {
    return fileList.findIndex(e => e.name === file.name);
  };

  const handleMessage = message => {
    console.log(message);
  };

  const handleReport = async _ => {
    console.log(fileList);
  };

  return <IndelReport {...state} {...props} handleReport={handleReport} />;
};

export default connect(
  state => ({}),
  dispatch => ({})
)(IndelReportContainer);
