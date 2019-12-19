import { put, select } from "redux-saga/effects";
import { fromJS } from "immutable";

import * as uploadActions from "store/modules/upload";
import * as stateActions from "store/modules/state";
import * as analysisActions from "store/modules/analysis";

const getAnalysisDataFromStore = state => state.analysis;

export function* formatData(action) {
  try {
    const { data, analysisId } = action.payload;
    const {
      fullseq,
      rgenseq,
      nuctype,
      nucleases,
      files,
      targetSeq,
      changeSeq,
      namePattern,
      indexPattern,
      end_range
    } = data;
    const seq_wt = fullseq.toUpperCase().replace(/\s/g, "");
    const seq_RGEN = rgenseq.toUpperCase().replace(/\s/g, "");
    const msgType = 0;
    //TODO: optfile select box 설정 필요 우선 하드코딩
    const fileopt = 0;
    //OPTIONAL
    const filt_n = 1;
    const filt_r = 5;

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
      const analysisData = yield select(getAnalysisDataFromStore);
      const prevFormat = analysisData.get("format");
      const nextFormat = prevFormat.set(analysisId, fromJS(format));

      yield put(
        analysisActions.saveAnalysisImmu({ type: "format", data: nextFormat })
      );
      yield put(
        analysisActions.saveAnalysis({ type: "failList", data: failList })
      );
    }
  } catch (error) {
    console.error(error);
  }
}
