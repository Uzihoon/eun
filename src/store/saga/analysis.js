import { call, select, put } from "redux-saga/effects";
import * as stateActions from "store/modules/state";
import * as uploadActions from "store/modules/upload";

import Sample1 from "asset/Sample-ID-71_S71_L001_R1_001.fastq.gz";
import Sample2 from "asset/Sample-ID-71_S71_L001_R2_001.fastq.gz";
import Sample3 from "asset/Sample-ID-72_S72_L001_R1_001.fastq.gz";
import Sample4 from "asset/Sample-ID-72_S72_L001_R2_001.fastq.gz";

import axios from "axios";

const getStateFromStore = state => state.state;

export function* runSample() {
  yield put(stateActions.setState({ key: "sampleLoading", value: true }));
  const stateStore = yield select(getStateFromStore);
  const sample = stateStore.get("sample").toJS();

  sample.files = yield call(getFileList);
  yield put(uploadActions.formatData(sample));
}

async function getFileList() {
  const fileURL = [
    { url: Sample1, name: "71_S71_L001_R1" },
    { url: Sample2, name: "71_S71_L001_R2" },
    { url: Sample3, name: "72_S72_L001_R1" },
    { url: Sample4, name: "72_S72_L001_R2" }
  ];
  const fileList = [];
  const promise = [];
  const header = { responseType: "blob" };
  fileURL.map(file => promise.push(axios.get(file.url, header)));
  await axios.all(promise).then(
    axios.spread((...args) => {
      args.map((result, index) => {
        const title = `Sample-ID-${fileURL[index].name}_001.fastq.gz`;
        const file = new File([result.data], title);
        fileList.push(file);
      });
    })
  );

  return fileList;
}
