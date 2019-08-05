import { all, takeEvery } from "redux-saga/effects";

// Saga
import * as StateSaga from "./state";

// Reducers
import * as StateActions from "store/modules/state";

export default function* rootSaga() {
  yield all([handleState()]);
}

function* handleState() {
  yield takeEvery(StateActions.tryLogin, StateSaga.tryLogin);
}
