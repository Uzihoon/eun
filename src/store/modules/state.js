import { createAction, handleActions } from "redux-actions";
import { Map } from "immutable";

const SHOW_MSG = "state/SHOW_MSG";
const HIDE_MSG = "state/HIDE_MSG";
const SET_PENDING = "state/SET_PENDING";
const SET_FINISH = "state/SET_FINISH";

export const showMsg = createAction(SHOW_MSG);
export const hideMsg = createAction(HIDE_MSG);
export const setPending = createAction(SET_PENDING);
export const setFinish = createAction(SET_FINISH);

const initialState = Map({
  msg: {
    status: "",
    content: "",
    show: false
  },
  loading: false,
  authed: false
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
    }
  },
  initialState
);
