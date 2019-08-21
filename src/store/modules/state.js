import { createAction, handleActions } from "redux-actions";
import { Map, fromJS } from "immutable";

const SHOW_MSG = "state/SHOW_MSG";
const HIDE_MSG = "state/HIDE_MSG";
const SET_PENDING = "state/SET_PENDING";
const SET_FINISH = "state/SET_FINISH";
const TRY_LOGIN = "state/TRY_LOGIN";
const LOGIN_SUCCESS = "state/LOGIN_SUCCESS";
const LOGOUT = "state/LOGOUT";
const HANDLE_CONFIRM = "state/HANDLE_CONFIRM";
const SET_TEMP_USERNAME = "state/SET_TEMP_USERNAME";

export const showMsg = createAction(SHOW_MSG);
export const hideMsg = createAction(HIDE_MSG);
export const setPending = createAction(SET_PENDING);
export const setFinish = createAction(SET_FINISH);
export const tryLogin = createAction(TRY_LOGIN);
export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
export const handleConfirm = createAction(HANDLE_CONFIRM);
export const setTempUsername = createAction(SET_TEMP_USERNAME);

const initialState = Map({
  msg: {
    status: "",
    content: "",
    show: false
  },
  loading: false,
  authed: false,
  userInfo: Map({}),
  confirm: false,
  tempUsername: null
});

export default handleActions(
  {
    [SHOW_MSG]: (state, action) => {
      const { status, content } = action.payload;
      return state
        .setIn(["msg", "status"], status)
        .setIn(["msg", "content"], content)
        .setIn(["msg", "show"], true);
    },
    [HIDE_MSG]: (state, action) => {
      return state
        .setIn(["msg", "status"], "")
        .setIn(["msg", "content"], "")
        .setIn(["msg", "show"], false);
    },
    [SET_PENDING]: (state, action) => {
      return state.set("loading", true);
    },
    [SET_FINISH]: (state, action) => {
      return state.set("loading", false);
    },
    [LOGIN_SUCCESS]: (state, action) => {
      const { payload: userInfo } = action;
      return state.set("authed", true).set("userInfo", fromJS(userInfo));
    },
    [LOGOUT]: (state, action) => {
      return state.set("authed", false).set("userInfo", Map({}));
    },
    [HANDLE_CONFIRM]: (state, action) => {
      return state.set("confirm", true);
    },
    [SET_TEMP_USERNAME]: (state, action) => {
      const { payload: username } = action;
      return state.set("tempUsername", username);
    }
  },
  initialState
);
