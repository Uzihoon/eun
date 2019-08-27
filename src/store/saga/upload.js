import { put } from "redux-saga/effects";

import * as uploadActions from "store/modules/upload";
import * as stateActions from "store/modules/state";
import * as analysisActions from "store/modules/analysis";

export function* formatData(action) {
  try {
    const { payload: data } = action;
    const {
      fullseq,
      rgenseq,
      nuctype,
      nucleases,
      files,
      targetSeq,
      changeSeq,
      namePattern,
      indexPattern
    } = data;
    const seq_wt = fullseq.toUpperCase().replace(/\s/g, "");
    const seq_RGEN = rgenseq.toUpperCase().replace(/\s/g, "");
    const msgType = 0;
    //TODO: optfile select box 설정 필요 우선 하드코딩
    const fileopt = 0;
    //OPTIONAL
    const filt_n = 1;
    const filt_r = 5;
    const end_range = 70;

    let rgen_type = 0;
    let seq_RGEN2 = "";

    if (+nuctype === 0 && +nucleases === 6) {
      rgen_type = 1;
    } else if (+nuctype === 1) {
      seq_RGEN2 = "";
      if (+nucleases === 9) {
        rgen_type = 4;
      } else if (+nucleases === 10) {
        rgen_type = 3;
      } else {
        rgen_type = 2;
      }
    }

    const fileList = {};
    const failList = [];
    const filePattern = new RegExp(`${namePattern}(.*)${indexPattern}`);

    files.forEach(e => {
      const match = filePattern.exec(e.name);
      if (match) {
        if (fileList[match[1]]) {
          fileList[match[1]].push(e);
        } else {
          fileList[match[1]] = [e];
        }
      } else {
        failList.push(e.name);
      }
    });

    if (Object.keys(fileList).length <= 0) {
      yield put(
        stateActions.showMsg({
          status: "warning",
          content: "Please check file again!"
        })
      );
    } else {

      const format = {
        msgtype: 0,
        seq_wt,
        rgen_type,
        seq_RGEN,
        seq_RGEN2,
        end_range,
        filt_n,
        filt_r,
        fileList,
        msgType,
        targetSeq: targetSeq.toUpperCase(),
        changeSeq: changeSeq.toUpperCase()
      };

      yield put(uploadActions.setUpload({ type: "format", data: format }));
      yield put(
        analysisActions.saveAnalysis({ type: "failList", data: failList })
      );
    }
  } catch (error) {
    console.error(error);
  }
}
