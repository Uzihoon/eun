import { call } from "redux-saga/effects";
import * as api from "lib/api";

export function* tryLogin(action) {
  try {
    const { payload: param } = action;
    console.log(param);
    const { data } = yield call(api.tryLogin, param);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
