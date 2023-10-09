import { createAction, handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import Line from 'img/line.png';
import Dna from 'img/dna.png';
import File from 'img/file.png';
import List from 'img/list.png';

const SHOW_MSG = 'state/SHOW_MSG';
const HIDE_MSG = 'state/HIDE_MSG';
const SET_PENDING = 'state/SET_PENDING';
const SET_FINISH = 'state/SET_FINISH';
const LOGIN_SUCCESS = 'state/LOGIN_SUCCESS';
const LOGOUT = 'state/LOGOUT';
const HANDLE_CONFIRM = 'state/HANDLE_CONFIRM';
const SET_TEMP_USERNAME = 'state/SET_TEMP_USERNAME';
const SET_STATE = 'state/SET_STATE';
const LOGIN = 'state/LOGIN';
const CHECK_AUTH = 'state/CHECK_AUTH';
const RESET_USER = 'state/RESET_USER';

export const showMsg = createAction(SHOW_MSG);
export const hideMsg = createAction(HIDE_MSG);
export const setPending = createAction(SET_PENDING);
export const setFinish = createAction(SET_FINISH);
export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
export const handleConfirm = createAction(HANDLE_CONFIRM);
export const setTempUsername = createAction(SET_TEMP_USERNAME);
export const setState = createAction(SET_STATE);
export const login = createAction(LOGIN);
export const checkAuth = createAction(CHECK_AUTH);
export const resetUser = createAction(RESET_USER);

const initialState = Map({
  msg: {
    status: '',
    content: '',
    show: false,
  },
  loading: false,
  authed: false,
  userInfo: Map({}),
  confirm: false,
  tempUsername: null,
  sampleLoading: false,
  sample: Map({
    changeSeq: 'g',
    fullseq:
      'ACCTCTTATCTTCCTCCCACAGCTCCTGGGCAACGTGCTGGTCTGTGTGCTGGCCCATCACTTTGGCAAAGAATTCACCCCACCAGTGCAGGCTGCCTATCAGAAAGTGGTGGCTGGTGTGGCTAATGCCCTGGCCCACAAGTATCACTAAGCTCGCTTTCTTGCTGTCCAATTTCTATTAAAGGTTCCTTTGTTCCCTAAGTCCAACT',
    indexPattern: '_L001_',
    namePattern: '',
    nucleases: '1',
    nuctype: '0',
    rgenseq: 'TCAGAAAGTGGTGGCTGGTG',
    targetSeq: 'a',
    end_range: 70,
  }),
  menuList: [
    {
      title: 'Cas Analysis',
      url: '/analysis',
      icon: Dna,
    },
    {
      title: 'INDEL Type Report',
      url: '/indel',
      icon: Line,
    },
    {
      title: 'File Convert',
      url: '/convert',
      icon: File,
    },
    {
      title: 'Analysis List',
      url: '/list',
      icon: List,
    },
  ],
  intro: true,
  innerLoading: false,
});

export default handleActions(
  {
    [SHOW_MSG]: (state, action) => {
      const { status, content } = action.payload;
      return state
        .setIn(['msg', 'status'], status)
        .setIn(['msg', 'content'], content)
        .setIn(['msg', 'show'], true);
    },
    [HIDE_MSG]: (state, action) => {
      return state
        .setIn(['msg', 'status'], '')
        .setIn(['msg', 'content'], '')
        .setIn(['msg', 'show'], false);
    },
    [SET_PENDING]: (state, action) => {
      return state.set('loading', true);
    },
    [SET_FINISH]: (state, action) => {
      return state.set('loading', false);
    },
    [LOGIN_SUCCESS]: (state, action) => {
      const { payload: userInfo } = action;
      return state.set('authed', true).set('userInfo', fromJS(userInfo));
    },
    [RESET_USER]: (state, action) => {
      return state.set('authed', false).set('userInfo', Map({}));
    },
    [HANDLE_CONFIRM]: (state, action) => {
      return state.set('confirm', true);
    },
    [SET_TEMP_USERNAME]: (state, action) => {
      const { payload: username } = action;
      return state.set('tempUsername', username);
    },
    [SET_STATE]: (state, action) => {
      const { key, value } = action.payload;
      return state.set(key, value);
    },
  },
  initialState
);
