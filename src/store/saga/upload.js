import { put } from "redux-saga/effects";

import * as uploadActions from "store/modules/upload";

export function* formatData(action) {
  try {
    const { payload: data } = action;
    const { fullseq, rgenseq, nuctype, nucleases, files } = data;
    const seq_wt = fullseq.toUpperCase().replace(/\s/g, "");
    const seq_RGEN = rgenseq.toUpperCase().replace(/\s/g, "");

    //TODO: optfile select box 설정 필요 우선 하드코딩
    const fileopt = 0;

    //OPTIONAL
    const filt_n = 1;
    const filt_r = 5;
    const end_range = 70;

    let rgen_type, seq_RGEN2;

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

    const format = {
      msgtype: 0,
      seq_wt,
      rgen_type,
      seq_RGEN,
      seq_RGEN2,
      end_range,
      filt_n,
      filt_r,
      files
    };

    yield put(uploadActions.setUpload({ type: "format", data: format }));
  } catch (error) {
    console.error(error);
  }
}
