import { all, takeEvery } from "redux-saga/effects";

// Saga
import * as StateSaga from "./state";
import * as UploadSaga from "./upload";

// Reducers
import * as StateActions from "store/modules/state";
import * as UploadActions from "store/modules/upload";

export default function* rootSaga() {
  yield all([handleState(), handleUpload()]);
}

function* handleState() {
  yield takeEvery(StateActions.tryLogin, StateSaga.tryLogin);
}

function* handleUpload() {
  yield takeEvery(UploadActions.formatData, UploadSaga.formatData);
}
