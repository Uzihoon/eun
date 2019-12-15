import { createAction, handleActions } from "redux-actions";
import { Map, fromJS } from "immutable";

const SAVE_INDEL = "indel/SAVE_INDEL";

export const saveIndel = createAction(SAVE_INDEL);

const initialState = Map({
  indel: Map({})
});

export default handleActions(
  {
    [SAVE_INDEL]: (state, action) => {
      const { id, data } = action.payload;
      return state.setIn(["indel", id], fromJS(data));
    }
  },
  initialState
);
