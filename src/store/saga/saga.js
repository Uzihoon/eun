import { all, takeEvery } from "redux-saga/effects";

// Saga
import * as StateSaga from "./state";
import * as UploadSaga from "./upload";
import * as AnalysisSaga from "./analysis";

// Reducers
import * as StateActions from "store/modules/state";
import * as UploadActions from "store/modules/upload";
import * as AnalysisActions from "store/modules/analysis";

export default function* rootSaga() {
  yield all([handleState(), handleUpload(), handleAnalysis()]);
}

function* handleState() {
  yield takeEvery(StateActions.login, StateSaga.login);
  yield takeEvery(StateActions.checkAuth, StateSaga.checkAuth);
  yield takeEvery(StateActions.logout, StateSaga.logout);
}

function* handleUpload() {
  yield takeEvery(UploadActions.formatData, UploadSaga.formatData);
}

function* handleAnalysis() {
  yield takeEvery(AnalysisActions.runSample, AnalysisSaga.runSample);
}
