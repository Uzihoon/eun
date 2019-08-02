import { createAction, handleActions } from "redux-actions";
import { Map } from "immutable";

const BASE = "base/BASE";

export const base = createAction(BASE);

const initialState = Map({
  base: ""
});

export default handleActions(
  {
    [BASE]: (state, action) => {
      const { payload: test } = action;
      return state.set("base", test);
    }
  },
  initialState
);
