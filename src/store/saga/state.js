import { call, put } from "redux-saga/effects";
import { Auth } from "aws-amplify";
import * as stateActions from "store/modules/state";

export function* login(action) {
  const { val, history } = action.payload;
  const { email, password } = val;
  try {
    const data = yield call(signIn, email, password);
    yield put(stateActions.loginSuccess(data.attributes));
    history.push("/");
  } catch (error) {
    const msg = error.message || error;
    yield errorMsg(msg);

    if (error.code === "UserNotConfirmedException") {
      // if user did not confirm validation code,
      yield put(stateActions.handleConfirm());
      yield put(stateActions.setTempUsername(email));
      history.push("/signup");
    }
  }
}

export function* logout(action) {
  try {
    const { payload: history } = action;
    yield call(signOut);
    yield put(stateActions.resetUser());
    history.push("/login");
  } catch (error) {
    const msg = error.message || error;
    yield errorMsg(msg);
  }
}

export function* checkAuth(action) {
  try {
    const { history, location } = action.payload;
    const data = yield call(checkSession);
    yield put(stateActions.loginSuccess(data.idToken.payload));
    const prevLocation = location.hash;
    history.push(prevLocation);
  } catch (error) {
    if (error !== "No current user") {
      if (typeof error === "string") {
        yield errorMsg(error);
      }
    }
  }
}

function signIn(email, password) {
  const data = Auth.signIn(email, password);

  return data;
}

function signOut() {
  const data = Auth.signOut();
  return data;
}

function checkSession() {
  const data = Auth.currentSession();
  return data;
}

function* errorMsg(msg) {
  yield put(
    stateActions.showMsg({
      status: "error",
      content: msg
    })
  );
}
