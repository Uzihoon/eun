import React, { useState, useEffect } from "react";
import Convert from "components/Convert";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Loading from "components/common/Loading";

import * as convertActions from "store/modules/convert";
import * as stateActions from "store/modules/state";

const ConvertContainer = props => {
  const { ConvertActions, StateActions, convertFileList } = props;

  let fileIndex = 0;
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    uploadInfo: {
      name: "json",
      accept: "application/json, .json",
      beforeUpload: (file, fileList) => {
        const len = fileList.length;
        let render = false;
        if (len === 1) {
          render = true;
        } else {
          ++fileIndex;

          if (fileIndex === len) {
            fileIndex = 0;
          } else if (fileIndex === 1) {
            render = true;
          }
        }
        if (render) {
          ConvertActions.addFile(fileList);
        }
        return false;
      },
      multiple: true,
      onRemove: file => {
        ConvertActions.deleteFile(file);
        return true;
      }
    },
    convertFileList: []
  });
  const [selected, setSelected] = useState([]);

  const handleConvert = convertId => {
    const hasConvert = selected.findIndex(e => e === convertId);
    const select = selected.concat();
    if (hasConvert < 0) {
      select.push(convertId);
    } else {
      select.splice(hasConvert, 1);
    }

    setSelected(select);
  };

  const warningMsg = content => {
    StateActions.showMsg({ status: "warning", content });
  };

  const handleConvertFile = _ => {
    let msg;
    if (selected.length <= 0) {
      msg = "Please select at least one convert types";
    }

    if (convertFileList.size <= 0) {
      msg = "Please input correct file!";
    }

    if (msg) {
      warningMsg(msg);
      return;
    }

    ConvertActions.convertFile({
      convertType: selected,
      fileList: convertFileList
    });
    setLoading(true);
  };

  useEffect(() => {
    if (props.gauge === 100) {
      setLoading(false);
      ConvertActions.setGauge(0);
    }
  }, [props.gauge]);

  return (
    <>
      <Convert
        {...state}
        selected={selected}
        handleConvert={handleConvert}
        convertList={props.convertList}
        handleConvertFile={handleConvertFile}
      />
      {loading && <Loading gauge={props.gauge} />}
    </>
  );
};

export default connect(
  state => ({
    convertList: state.convert.get("convertList").toJS(),
    convertFileList: state.convert.get("convertFileList"),
    gauge: state.convert.get("gauge")
  }),
  dispatch => ({
    StateActions: bindActionCreators(stateActions, dispatch),
    ConvertActions: bindActionCreators(convertActions, dispatch)
  })
)(ConvertContainer);
