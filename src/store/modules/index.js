import { combineReducers } from "redux";
import base from "./base";
import upload from "./upload"

export default combineReducers({
  base,
  upload
});
